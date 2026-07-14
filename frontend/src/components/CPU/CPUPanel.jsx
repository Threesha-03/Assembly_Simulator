/**
 * CPUPanel.jsx
 *
 * Self-contained CPU block for the Simulation page.
 *
 * Controls:
 *   Start Address — user enters the memory address to begin execution from
 *   Run           — loads instruction at Start Address into IR; PC → next address
 *   Next          — loads instruction at PC into IR; PC advances by 1
 *   Reload        — restarts from Start Address (IR ← start instr, PC ← start+1)
 *
 * Displays:
 *   Instruction   — the instruction currently being executed (IR)
 *   PC            — memory address of the NEXT instruction to fetch
 *   R1–R15        — general-purpose register values
 *   Accumulator   — result accumulator
 *
 * On a STORE instruction the result is also written back to data memory
 * via the memorySlice.memoryWritten action.
 */

import React, { useRef } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import {
  setStartAddress,
  runFromStart,
  stepNext,
  executeInstruction,
  previousInstruction,
  resetCPU,
} from './cpuSlice'
import {
  instructionPointerMoved,
  memoryWritten,
  previousStep,
  resetMemory,
  snapshotPushed,
} from '../Memory/memorySlice'
import { useCPU } from '../../hooks/useCPU'
import { parseAddress } from './cpuSlice'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Find the data-memory address for a label reference in a STORE/LOAD instruction */
function findAddressByLabel(dataMemory, label) {
  return Object.values(dataMemory).find(
    (cell) => cell.label?.toLowerCase() === label?.toLowerCase()
  )
}

/** Pull the destination label from "STORE [label], Rx" */
function parseStoreLabel(ir) {
  const match = ir?.match(/STORE\s+\[([^\]]+)\]/i)
  return match ? match[1] : null
}

/** Pull source value from "STORE [label], Rx|ACC" given current registers & acc */
function parseStoreValue(ir, registers, accumulator) {
  const match = ir?.match(/STORE\s+\[[^\]]+\]\s*,\s*(\S+)/i)
  if (!match) return accumulator
  const src = match[1].toUpperCase()
  if (src === 'ACC') return accumulator
  const reg = registers.find((r) => r.name === src)
  return reg ? reg.value : accumulator
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CPUPanel() {
  const dispatch = useDispatch()
  const store = useStore()
  const { registers, programCounter, instructionRegister, startAddress, status } = useCPU()

  // Read instruction & data memory directly for execution
  const instructionMemory = useSelector((state) => state.memory.instructionMemory)
  const dataMemory = useSelector((state) => state.memory.dataMemory)
  const hasHistory = useSelector((state) => state.cpu.history.length > 0)

  const inputRef = useRef(null)

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleRun = () => {
    const addr = parseAddress(startAddress)
    if (addr === null) return

    dispatch(runFromStart({ instructionMemory, startAddress }))
    dispatch(instructionPointerMoved({ address: addr }))
    dispatch(snapshotPushed())
    dispatch(executeInstruction({ dataMemory, instructionMemory }))
    persistStoreValue(addr, instructionMemory[addr]?.instruction)
  }

  const handleNext = () => {
    const currentPc = parseAddress(programCounter)
    if (currentPc === null) return

    dispatch(stepNext({ instructionMemory }))
    dispatch(instructionPointerMoved({ address: currentPc }))
    dispatch(snapshotPushed())
    dispatch(executeInstruction({ dataMemory, instructionMemory }))
    persistStoreValue(currentPc, instructionMemory[currentPc]?.instruction)
  }

  const handlePrevious = () => {
    dispatch(previousInstruction({ instructionMemory }))
    dispatch(previousStep())
  }

  const handleReset = () => {
    dispatch(resetCPU({ instructionMemory, startAddress: '' }))
    dispatch(resetMemory())
    dispatch(setStartAddress(''))
    dispatch(instructionPointerMoved({ address: null }))
  }

  const persistStoreValue = (address, instructionText) => {
    if (!instructionText || !instructionText.trim().toUpperCase().startsWith('STORE')) return

    const cpuState = store.getState().cpu
    const labelMatch = instructionText.match(/STORE\s+\[([^\]]+)\]/i)
    const srcMatch = instructionText.match(/STORE\s+\[[^\]]+\]\s*,\s*(\S+)/i)
    if (!labelMatch) return

    const label = labelMatch[1]
    const srcToken = srcMatch ? srcMatch[1].toUpperCase() : 'ACC'
    let value
    if (srcToken === 'ACC') {
      value = cpuState.accumulator
    } else {
      const reg = cpuState.registers.find((entry) => entry.name === srcToken)
      value = reg ? reg.value : cpuState.accumulator
    }

    const cell = Object.values(dataMemory).find(
      (entry) => entry.label?.toLowerCase() === label.toLowerCase()
    )

    if (cell) {
      dispatch(memoryWritten({ address: cell.address, value }))
    }
  }

  const handleAddressChange = (e) => {
    dispatch(setStartAddress(e.target.value))
  }

  // ── Register groups: R0–R7 left, R8–R15 right ────────────────────────────
  const leftRegs = registers.slice(0, 8)   // R0–R7
  const rightRegs = registers.slice(8, 16) // R8–R15

  const isRunning = status === 'running'
  const isCompleted = status === 'completed'

  return (
    <div className="h-full rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.08)] dark:shadow-2xl overflow-hidden flex flex-col">

      {/* ── Header ── */}
      <div className="flex-none px-5 py-3 border-b border-slate-200/70 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/60">
        <h2 className="text-sm font-bold tracking-widest text-slate-700 dark:text-slate-100 uppercase">CPU</h2>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5 flex flex-col gap-3">

        {/* ── Row 1: Start Address ── */}
        <div className="flex items-center gap-3 shrink-0">
          <label className="text-xs font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase w-28 shrink-0">
            Start Address
          </label>
          <input
            ref={inputRef}
            type="text"
            value={startAddress}
            onChange={handleAddressChange}
            placeholder="e.g. 4000"
            className="
              flex-1 min-w-0 px-3 py-1.5 rounded-lg
              bg-white border border-slate-300
              text-slate-800 font-mono text-sm
              placeholder-slate-400
              dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-colors
            "
          />
        </div>

        {/* ── Row 2: Instruction (IR) ── */}
        <div className="shrink-0">
          <FieldRow label="Instruction" value={instructionRegister} color="text-amber-400" mono />
        </div>

        {/* ── Row 3: PC ── */}
        <div className="shrink-0">
          <FieldRow
            label="PC"
            value={programCounter}
            color="text-blue-400"
            mono
            title="Program Counter — address of next instruction to fetch"
          />
        </div>

        {/* ── Row 4: Buttons ── */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <CpuButton
            onClick={handleRun}
            disabled={isRunning || isCompleted}
            color="bg-green-600 hover:bg-green-700"
          >
            Run
          </CpuButton>

          <CpuButton
            onClick={handlePrevious}
            disabled={!hasHistory || !isRunning || isCompleted}
            color="bg-blue-600 hover:bg-blue-700"
          >
            Previous
          </CpuButton>

          <CpuButton
            onClick={handleNext}
            disabled={!isRunning || isCompleted}
            color="bg-yellow-500 hover:bg-yellow-600"
          >
            Next
          </CpuButton>

          <CpuButton
            onClick={handleReset}
            color="bg-red-600 hover:bg-red-700"
          >
            Reset
          </CpuButton>
        </div>

        {/* ── Registers ── */}
        <div className="flex-1 min-h-0 flex flex-col">
          <h3 className="shrink-0 text-xs font-bold tracking-widest text-slate-600 dark:text-slate-500 uppercase mb-2">
            Registers
          </h3>

          <div className="flex-1 min-h-0 overflow-visible">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {/* Left: R1–R8 */}
              <div className="space-y-1">
                {leftRegs.map((reg) => (
                  <RegisterRow key={reg.name} reg={reg} />
                ))}
              </div>
              {/* Right: R9–R15 */}
              <div className="space-y-1">
                {rightRegs.map((reg) => (
                  <RegisterRow key={reg.name} reg={reg} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Status badge ── */}
        <div className="shrink-0 flex items-center justify-end gap-2">
          <span className="text-xs font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase">
            Current Status:
          </span>
          <StatusBadge status={status} />
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldRow({ label, value, color = 'text-slate-100', mono = false, title }) {
  return (
    <div
      title={title}
      className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50/80 border border-slate-200/70 dark:bg-slate-800/50 dark:border-slate-700/60"
    >
      <span className="text-xs font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase shrink-0 w-28">
        {label}
      </span>
      <span
        className={`font-semibold text-sm truncate max-w-xs text-right ${color} ${
          mono ? 'font-mono' : ''
        }`}
      >
        {value || '—'}
      </span>
    </div>
  )
}

function RegisterRow({ reg }) {
  const isActive = reg.value !== 0
  return (
    <div
      className={`flex items-center justify-between px-2 py-1 rounded-md text-xs border transition-colors ${
        isActive
          ? 'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700/50 dark:text-blue-300'
          : 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800/30 dark:border-slate-700/30 dark:text-slate-500'
      }`}
    >
      <span className={`font-mono font-bold ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-500'}`}>
        {reg.name}
      </span>
      <span className={`font-mono ${isActive ? 'text-blue-700 dark:text-slate-100' : 'text-slate-600 dark:text-slate-500'}`}>
        {reg.value}
      </span>
    </div>
  )
}

function CpuButton({ children, onClick, disabled, color }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg font-semibold text-sm text-white
        transition-colors disabled:opacity-40 disabled:cursor-not-allowed
        ${color}
      `}
    >
      {children}
    </button>
  )
}

function StatusBadge({ status }) {
  const map = {
    idle:      { label: 'Idle',      cls: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
    running:   { label: 'Running',   cls: 'bg-blue-100 text-blue-700 dark:bg-blue-700/60 dark:text-blue-300' },
    completed: { label: 'Completed', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-700/60 dark:text-emerald-300' },
  }
  const { label, cls } = map[status] ?? map.idle
  return (
    <div className="flex justify-end">
      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${cls}`}>
        {label}
      </span>
    </div>
  )
}

export default CPUPanel
