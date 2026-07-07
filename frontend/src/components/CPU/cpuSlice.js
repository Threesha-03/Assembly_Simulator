/**
 * cpuSlice.js
 *
 * Redux Toolkit slice owning all CPU execution state:
 *   - registers R1–R15
 *   - accumulator
 *   - programCounter (PC)
 *   - instructionRegister (IR) — the instruction currently executing
 *   - startAddress — user-supplied entry point
 *   - status: 'idle' | 'running' | 'completed'
 *
 * The simulation page drives this slice by:
 *   1. setStartAddress(addr)        — when user types a start address
 *   2. runFromStart(instructionMemory) — loads IR from startAddress, sets PC to next
 *   3. stepNext(instructionMemory)  — loads IR from PC, advances PC
 *   4. executeInstruction(instr, dataMemory) — updates registers / accumulator based on IR
 *   5. storeResult({ address, value }) — writes final result back (STORE instruction)
 *   6. reloadCPU()                  — resets back to startAddress state
 */

import { createSlice } from '@reduxjs/toolkit'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeRegisters() {
  return Array.from({ length: 15 }, (_, i) => ({ name: `R${i + 1}`, value: 0 }))
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  registers: makeRegisters(),
  accumulator: 0,
  programCounter: null,   // numeric address of NEXT instruction to fetch
  instructionRegister: '', // text of currently executing instruction
  startAddress: '',        // user-typed start address (e.g. "1000H" or "1000")
  status: 'idle',          // 'idle' | 'running' | 'completed'
}

// ─── Slice ────────────────────────────────────────────────────────────────────

const cpuSlice = createSlice({
  name: 'cpu',
  initialState,
  reducers: {
    /** User types a start address in the input field */
    setStartAddress(state, action) {
      state.startAddress = action.payload
    },

    /**
     * Run: load instruction at startAddress into IR, set PC to startAddress + 1.
     * payload: { instructionMemory: { [address]: { instruction, address } } }
     */
    runFromStart(state, action) {
      const { instructionMemory, startAddress } = action.payload
      const addr = parseAddress(startAddress ?? state.startAddress)
      if (addr === null) return

      const cell = instructionMemory[addr]
      state.instructionRegister = cell ? cell.instruction : '—'
      state.programCounter = addr + 1
      state.status = 'running'
    },

    /**
     * Next: load instruction at current PC into IR, advance PC by 1.
     * payload: { instructionMemory }
     */
    stepNext(state, action) {
      const { instructionMemory } = action.payload
      const pc = state.programCounter
      if (pc === null) return

      const cell = instructionMemory[pc]
      if (!cell) {
        // No instruction at this address — end of program
        state.instructionRegister = '(end)'
        state.status = 'completed'
        return
      }
      state.instructionRegister = cell.instruction
      state.programCounter = pc + 1
    },

    /**
     * Execute the current instruction register value.
     * Updates registers and accumulator based on simple instruction parsing.
     * payload: { dataMemory: { [address]: { value, label } } }
     */
    executeInstruction(state, action) {
      const { dataMemory = {} } = action.payload ?? {}
      const ir = state.instructionRegister
      if (!ir || ir === '—' || ir === '(end)') return

      applyInstruction(state, ir, dataMemory)
    },

    /**
     * STORE: write accumulator/register value back to a data memory cell.
     * This is handled by memorySlice (memoryWritten), but we record it here too.
     */
    storeResult(state, action) {
      // payload: { address, value } — informational for the CPU panel
      // Actual memory write goes via memorySlice.memoryWritten
    },

    /**
     * Reload: restart from startAddress without changing registers/accumulator.
     * Equivalent to pressing Run again from the same start address.
     */
    reloadCPU(state, action) {
      const { instructionMemory } = action.payload ?? {}
      const addr = parseAddress(state.startAddress)
      if (addr === null) {
        state.status = 'idle'
        return
      }
      const cell = instructionMemory ? instructionMemory[addr] : null
      state.instructionRegister = cell ? cell.instruction : '—'
      state.programCounter = addr + 1
      state.status = 'running'
    },

    /** Full reset including registers and accumulator */
    resetCPU(state) {
      state.registers = makeRegisters()
      state.accumulator = 0
      state.programCounter = null
      state.instructionRegister = ''
      state.status = 'idle'
    },

    /** Directly set a register value (used by execution engine) */
    setRegister(state, action) {
      const { name, value } = action.payload
      const reg = state.registers.find((r) => r.name === name.toUpperCase())
      if (reg) reg.value = value
    },

    /** Directly set accumulator */
    setAccumulator(state, action) {
      state.accumulator = action.payload
    },
  },
})

// ─── Instruction Execution Logic ──────────────────────────────────────────────

/**
 * Parse address from string like "1000H", "0x1000", or "1000".
 * Returns a numeric address or null if invalid.
 */
export function parseAddress(str) {
  if (str == null || str === '') return null
  const s = str.trim().toUpperCase()
  if (s.endsWith('H')) return parseInt(s.slice(0, -1), 16) || null
  if (s.startsWith('0X')) return parseInt(s.slice(2), 16) || null
  const n = parseInt(s, 10)
  return isNaN(n) ? null : n
}

/**
 * Very lightweight instruction interpreter.
 * Supports the subset used in the sample program:
 *   MOV  Rx, imm | Ry
 *   LOAD Rx, [label]
 *   ADD  Rx, Ry | imm
 *   SUB  Rx, Ry | imm
 *   MUL  Rx, Ry | imm
 *   DIV  Rx, Ry | imm
 *   INC  Rx
 *   DEC  Rx
 *   STORE [label], Rx | ACC
 *   MOV  ACC, Rx | imm
 *   HLT
 *   JMP  (no-op in step mode)
 */
function applyInstruction(state, ir, dataMemory) {
  const tokens = ir.replace(/[,\[\]]/g, ' ').trim().split(/\s+/)
  const op = tokens[0]?.toUpperCase()

  const getVal = (tok) => {
    if (!tok) return 0
    const t = tok.toUpperCase()
    // Register?
    if (/^R(\d+)$/.test(t)) {
      const reg = state.registers.find((r) => r.name === t)
      return reg ? Number(reg.value) : 0
    }
    if (t === 'ACC') return Number(state.accumulator)
    // Immediate?
    const n = Number(tok)
    return isNaN(n) ? 0 : n
  }

  const setReg = (name, value) => {
    const reg = state.registers.find((r) => r.name === name.toUpperCase())
    if (reg) reg.value = value
  }

  const findDataByLabel = (label) => {
    return Object.values(dataMemory).find(
      (cell) => cell.label?.toLowerCase() === label.toLowerCase()
    )
  }

  switch (op) {
    case 'MOV': {
      const dest = tokens[1]?.toUpperCase()
      const src = tokens[2]
      if (dest === 'ACC') {
        state.accumulator = getVal(src)
      } else if (/^R\d+$/.test(dest)) {
        setReg(dest, getVal(src))
      }
      break
    }
    case 'LOAD': {
      const dest = tokens[1]?.toUpperCase()
      const label = tokens[2]
      const cell = findDataByLabel(label)
      const val = cell ? Number(cell.value) : 0
      if (dest === 'ACC') state.accumulator = val
      else if (/^R\d+$/.test(dest)) setReg(dest, val)
      break
    }
    case 'ADD': {
      const dest = tokens[1]?.toUpperCase()
      const result = getVal(tokens[1]) + getVal(tokens[2])
      if (dest === 'ACC') state.accumulator = result
      else if (/^R\d+$/.test(dest)) setReg(dest, result)
      else state.accumulator += getVal(tokens[1])
      break
    }
    case 'SUB': {
      const dest = tokens[1]?.toUpperCase()
      const result = getVal(tokens[1]) - getVal(tokens[2])
      if (dest === 'ACC') state.accumulator = result
      else if (/^R\d+$/.test(dest)) setReg(dest, result)
      break
    }
    case 'MUL': {
      const dest = tokens[1]?.toUpperCase()
      const result = getVal(tokens[1]) * getVal(tokens[2])
      if (dest === 'ACC') state.accumulator = result
      else if (/^R\d+$/.test(dest)) setReg(dest, result)
      break
    }
    case 'DIV': {
      const dest = tokens[1]?.toUpperCase()
      const divisor = getVal(tokens[2])
      const result = divisor !== 0 ? Math.floor(getVal(tokens[1]) / divisor) : 0
      if (dest === 'ACC') state.accumulator = result
      else if (/^R\d+$/.test(dest)) setReg(dest, result)
      break
    }
    case 'INC': {
      const dest = tokens[1]?.toUpperCase()
      if (dest === 'ACC') state.accumulator += 1
      else if (/^R\d+$/.test(dest)) setReg(dest, getVal(tokens[1]) + 1)
      break
    }
    case 'DEC': {
      const dest = tokens[1]?.toUpperCase()
      if (dest === 'ACC') state.accumulator -= 1
      else if (/^R\d+$/.test(dest)) setReg(dest, getVal(tokens[1]) - 1)
      break
    }
    case 'STORE': {
      // STORE [label], Rx — the actual memory write is dispatched by SimulationPage
      // via memorySlice.memoryWritten. Nothing to do to the CPU registers here.
      break
    }
    case 'HLT': {
      state.status = 'completed'
      break
    }
    default:
      // JMP, NOP, unknown — no register side-effects in step mode
      break
  }
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export const {
  setStartAddress,
  runFromStart,
  stepNext,
  executeInstruction,
  storeResult,
  reloadCPU,
  resetCPU,
  setRegister,
  setAccumulator,
} = cpuSlice.actions

export default cpuSlice.reducer
