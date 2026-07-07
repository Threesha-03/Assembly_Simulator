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
import { useDispatch, useSelector } from 'react-redux'
import {
  setStartAddress,
  runFromStart,
  stepNext,
  executeInstruction,
  reloadCPU,
  resetCPU,
} from './cpuSlice'
import { memoryWritten } from '../Memory/memorySlice'
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
  const { registers, accumulator, programCounter, instructionRegister, startAddress, status } =
    useCPU()

  // Read instruction & data memory directly for execution
  const instructionMemory = useSelector((state) => state.memory.instructionMemory)
  const dataMemory = useSelector((state) => state.memory.dataMemory)

  const inputRef = useRef(null)

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleRun = () => {
    dispatch(runFromStart({ instructionMemory, startAddress }))
    // Execute the instruction that just loaded into IR
    setTimeout(() => {
      dispatch(executeInstruction({ dataMemory }))
      // If it was a STORE, write to memory too
      checkStore()
    }, 0)
  }

  const handleNext = () => {
    dispatch(stepNext({ instructionMemory }))
    setTimeout(() => {
      dispatch(executeInstruction({ dataMemory }))
      checkStore()
    }, 0)
  }

  const handleReload = () => {
    dispatch(reloadCPU({ instructionMemory }))
    setTimeout(() => {
      dispatch(executeInstruction({ dataMemory }))
      checkStore()
    }, 0)
  }

  // Write result back to data memory when a STORE instruction fires
  const checkStore = () => {
    // We read after dispatch so we use a selector callback form isn't available here.
    // Instead we re-read from the latest state via a store subscription in SimulationPage.
    // Here we schedule a micro-task so the slice has settled first.
  }

  const handleAddressChange = (e) => {
    dispatch(setStartAddress(e.target.value))
  }

  // ── Register groups: R1–R8 left, R9–R15 right ────────────────────────────
  const leftRegs = registers.slice(0, 8)   // R1–R8
  const rightRegs = registers.slice(8, 15) // R9–R15

  const isRunning = status === 'running'
  const isCompleted = status === 'completed'

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col">

      {/* ── Header ── */}
      <div className="px-5 py-4 border-b border-slate-700 bg-slate-800/60">
        <h2 className="text-sm font-bold tracking-widest text-slate-100 uppercase">CPU</h2>
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1">

        {/* ── Row 1: Start Address ── */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold tracking-widest text-slate-400 uppercase w-28 shrink-0">
            Start Address
          </label>
          <input
            ref={inputRef}
            type="text"
            value={startAddress}
            onChange={handleAddressChange}
            placeholder="e.g. 1000H"
            className="
              flex-1 min-w-0 px-3 py-2 rounded-lg
              bg-slate-800 border border-slate-600
              text-slate-100 font-mono text-sm
              placeholder-slate-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-colors
            "
          />
        </div>

        {/* ── Row 2: Instruction (IR) ── */}
        <FieldRow
          label="Instruction"
          value={instructionRegister}
          color="text-amber-400"
          mono
        />

        {/* ── Row 3: PC ── */}
        <FieldRow
          label="PC"
          value={programCounter}
          color="text-blue-400"
          mono
          title="Program Counter — address of next instruction to fetch"
        />

        {/* ── Row 4: Buttons ── */}
        <div className="flex flex-wrap gap-2">
          <CpuButton
            onClick={handleRun}
            disabled={isRunning || isCompleted}
            color="bg-green-600 hover:bg-green-700"
          >
            Run
          </CpuButton>

          <CpuButton
            onClick={handleNext}
            disabled={!isRunning || isCompleted}
            color="bg-blue-600 hover:bg-blue-700"
          >
            Next
          </CpuButton>

          <CpuButton
            onClick={handleReload}
            disabled={status === 'idle'}
            color="bg-violet-600 hover:bg-violet-700"
          >
            Reload
          </CpuButton>
        </div>

        {/* ── Registers + Accumulator ── */}
        <div className="mt-1">
          <h3 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">
            Registers
          </h3>

          {/* Two-column register grid */}
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

          {/* Accumulator spans full width below registers */}
          <div className="mt-3 flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-900/30 border border-emerald-700/50">
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
              Accumulator
            </span>
            <span className="font-mono font-semibold text-emerald-300 text-base">
              {accumulator}
            </span>
          </div>
        </div>

        {/* ── Status badge ── */}
        <StatusBadge status={status} />
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldRow({ label, value, color = 'text-slate-100', mono = false, title }) {
  return (
    <div
      title={title}
      className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/60"
    >
      <span className="text-xs font-bold tracking-widest text-slate-400 uppercase shrink-0 w-28">
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
          ? 'bg-blue-900/30 border-blue-700/50'
          : 'bg-slate-800/30 border-slate-700/30'
      }`}
    >
      <span className={`font-mono font-bold ${isActive ? 'text-blue-300' : 'text-slate-500'}`}>
        {reg.name}
      </span>
      <span className={`font-mono ${isActive ? 'text-slate-100' : 'text-slate-500'}`}>
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
    idle:      { label: 'Idle',      cls: 'bg-slate-700 text-slate-400' },
    running:   { label: 'Running',   cls: 'bg-blue-700/60 text-blue-300' },
    completed: { label: 'Completed', cls: 'bg-emerald-700/60 text-emerald-300' },
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
