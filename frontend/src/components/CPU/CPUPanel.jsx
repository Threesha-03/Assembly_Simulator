/**
 * CPUPanel.jsx
 *
 * CPU control panel — all execution logic is handled by the backend.
 * This component calls the API and updates Redux display state with the response.
 *
 * Controls:
 *   Start Address — hex/decimal address where execution begins
 *   Run           — POST /api/cpu/run  → execute first instruction
 *   Next          — POST /api/cpu/step → execute next instruction
 *   Previous      — POST /api/cpu/previous → undo last step
 *   Reset         — POST /api/cpu/reset → full reset
 *
 * Displays: IR, PC, R0–R15, Accumulator, Status
 */

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setCPUState, setStartAddress, setError } from './cpuSlice'
import { setMemoryState, setCurrentInstruction, setStatus, setLastWrittenAddress } from '../Memory/memorySlice'
import { useCPU } from '../../hooks/useCPU'
import {
  runExecution,
  stepExecution,
  previousStep,
  resetExecution,
} from '../../services/cpuApi'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Apply a backend response to Redux: update CPU + memory display state.
 * Backend returns the full simulation state on every call.
 */
function applyBackendState(dispatch, state) {
  dispatch(setCPUState(state))
  dispatch(setMemoryState({
    data_memory: state.data_memory,
    instruction_memory: state.instruction_memory,
  }))
  dispatch(setCurrentInstruction(state.program_counter))
  // Map backend status to memory panel display status
  const memStatus = state.status === 'running' ? 'executing'
                  : state.status === 'idle'    ? 'ready'
                  : state.status               // 'completed'
  dispatch(setStatus(memStatus))
}

/** Highlight the data memory cell that was just written by a STORE instruction. */
function updateWriteHighlight(dispatch, state) {
  const ir = state.instruction_register ?? ''
  if (!ir.trim().toUpperCase().startsWith('STORE')) {
    dispatch(setLastWrittenAddress(null))
    return
  }
  const match = ir.match(/STORE\s+\[([^\]]+)\]/i)
  if (!match) return
  const label = match[1]
  const cell = (state.data_memory ?? []).find(
    (c) => c.label?.toLowerCase() === label.toLowerCase()
  )
  if (cell) dispatch(setLastWrittenAddress(cell.address))
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CPUPanel() {
  const dispatch = useDispatch()
  const { registers, programCounter, instructionRegister, startAddress, status, canGoBack, error } = useCPU()
  const [loading, setLoading] = useState(false)

  const isRunning   = status === 'running'
  const isCompleted = status === 'completed'

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleRun = async () => {
    if (!startAddress.trim()) return
    setLoading(true)
    try {
      const state = await runExecution(startAddress)
      applyBackendState(dispatch, state)
      updateWriteHighlight(dispatch, state)
    } catch (e) {
      dispatch(setError(e.message))
    } finally {
      setLoading(false)
    }
  }

  const handleNext = async () => {
    if (!isRunning) return
    setLoading(true)
    try {
      const state = await stepExecution()
      applyBackendState(dispatch, state)
      updateWriteHighlight(dispatch, state)
    } catch (e) {
      dispatch(setError(e.message))
    } finally {
      setLoading(false)
    }
  }

  const handlePrevious = async () => {
    setLoading(true)
    try {
      const state = await previousStep()
      applyBackendState(dispatch, state)
      dispatch(setLastWrittenAddress(null))
    } catch (e) {
      dispatch(setError(e.message))
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    setLoading(true)
    try {
      const state = await resetExecution()
      // Apply full state (restores initial memory values)
      applyBackendState(dispatch, state)
      // Clear the start address input and the written-address highlight
      dispatch(setStartAddress(''))
      dispatch(setLastWrittenAddress(null))
      dispatch(setCurrentInstruction(null))
    } catch (e) {
      dispatch(setError(e.message))
    } finally {
      setLoading(false)
    }
  }

  const handleAddressChange = (e) => {
    dispatch(setStartAddress(e.target.value))
  }

  // ── Register split: R0–R7 left, R8–R15 right ─────────────────────────────
  const leftRegs  = registers.slice(0, 8)
  const rightRegs = registers.slice(8, 16)

  return (
    <div className="h-full rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.08)] dark:shadow-2xl overflow-hidden flex flex-col">

      {/* Header */}
      <div className="flex-none px-5 py-3 border-b border-slate-200/70 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/60">
        <h2 className="text-sm font-bold tracking-widest text-slate-700 dark:text-slate-100 uppercase">CPU</h2>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-5 flex flex-col gap-3">

        {/* Error banner */}
        {error && (
          <div className="px-3 py-2 rounded-lg bg-red-100 border border-red-300 text-red-700 text-xs dark:bg-red-900/30 dark:border-red-700/50 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Start Address */}
        <div className="flex items-center gap-3 shrink-0">
          <label className="text-xs font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase w-28 shrink-0">
            Start Address
          </label>
          <input
            type="text"
            value={startAddress}
            onChange={handleAddressChange}
            placeholder="e.g. 4000"
            className="flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 font-mono text-sm placeholder-slate-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Instruction Register */}
        <div className="shrink-0">
          <FieldRow label="Instruction" value={instructionRegister} color="text-amber-400" mono />
        </div>

        {/* Program Counter */}
        <div className="shrink-0">
          <FieldRow
            label="PC"
            value={programCounter}
            color="text-blue-400"
            mono
            title="Program Counter — address of next instruction to fetch"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <CpuButton
            onClick={handleRun}
            disabled={loading || isRunning || isCompleted}
            color="bg-green-600 hover:bg-green-700"
          >
            Run
          </CpuButton>

          <CpuButton
            onClick={handlePrevious}
            disabled={loading || !canGoBack}
            color="bg-blue-600 hover:bg-blue-700"
          >
            Previous
          </CpuButton>

          <CpuButton
            onClick={handleNext}
            disabled={loading || !isRunning || isCompleted}
            color="bg-yellow-500 hover:bg-yellow-600"
          >
            Next
          </CpuButton>

          <CpuButton
            onClick={handleReset}
            disabled={loading}
            color="bg-red-600 hover:bg-red-700"
          >
            Reset
          </CpuButton>
        </div>

        {/* Registers */}
        <div className="flex-1 min-h-0 flex flex-col">
          <h3 className="shrink-0 text-xs font-bold tracking-widest text-slate-600 dark:text-slate-500 uppercase mb-2">
            Registers
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="space-y-1">
              {leftRegs.map((reg) => <RegisterRow key={reg.name} reg={reg} />)}
            </div>
            <div className="space-y-1">
              {rightRegs.map((reg) => <RegisterRow key={reg.name} reg={reg} />)}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="shrink-0 flex items-center justify-end gap-2">
          <span className="text-xs font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase">
            Status:
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
      <span className={`font-semibold text-sm truncate max-w-xs text-right ${color} ${mono ? 'font-mono' : ''}`}>
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
      className={`px-4 py-2 rounded-lg font-semibold text-sm text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${color}`}
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
    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${cls}`}>
      {label}
    </span>
  )
}

export default CPUPanel
