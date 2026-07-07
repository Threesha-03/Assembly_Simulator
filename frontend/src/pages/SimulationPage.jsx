/**
 * SimulationPage.jsx
 *
 * The main simulation view (page 2).
 * Layout:
 *   – top bar with title + navigation
 *   – two-column grid: Memory Panel (left) | CPU Panel (right)
 *
 * The CPU Panel is self-contained and owns Run / Next / Reload controls.
 * This page handles one cross-slice side-effect:
 *   When a STORE instruction executes, write the result back to data memory
 *   via memorySlice.memoryWritten.
 */

import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { MemoryPanel } from '../components/Memory/MemoryPanel'
import { CPUPanel } from '../components/CPU/CPUPanel'
import { Button } from '../components/Shared/Button'
import { memoryWritten } from '../components/Memory/memorySlice'
import '../styles/simulation.css'

export function SimulationPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const store = useStore()

  /**
   * Watch the instruction register for STORE instructions.
   * When one fires, write the computed value back to the data memory cell.
   */
  const prevIR = useRef('')
  const instructionRegister = useSelector((state) => state.cpu.instructionRegister)
  const registers = useSelector((state) => state.cpu.registers)
  const accumulator = useSelector((state) => state.cpu.accumulator)
  const dataMemory = useSelector((state) => state.memory.dataMemory)

  useEffect(() => {
    const ir = instructionRegister
    if (!ir || ir === '—' || ir === '(end)') return
    if (ir === prevIR.current) return  // same instruction, skip duplicate
    prevIR.current = ir

    const op = ir.trim().split(/\s+/)[0]?.toUpperCase()
    if (op !== 'STORE') return

    // Parse  STORE [label], Rx | ACC
    const labelMatch = ir.match(/STORE\s+\[([^\]]+)\]/i)
    const srcMatch   = ir.match(/STORE\s+\[[^\]]+\]\s*,\s*(\S+)/i)
    if (!labelMatch) return

    const label = labelMatch[1]
    const srcToken = srcMatch ? srcMatch[1].toUpperCase() : 'ACC'
    let value
    if (srcToken === 'ACC') {
      value = accumulator
    } else {
      const reg = registers.find((r) => r.name === srcToken)
      value = reg ? reg.value : accumulator
    }

    // Find the data memory address for this label
    const cell = Object.values(dataMemory).find(
      (c) => c.label?.toLowerCase() === label.toLowerCase()
    )
    if (cell) {
      dispatch(memoryWritten({ address: cell.address, value }))
    }
  }, [instructionRegister, registers, accumulator, dataMemory, dispatch])

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-slate-100">Assembly Simulator</h1>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate('/')}>
            ← Home
          </Button>
          <Button variant="ghost" onClick={toggleDarkMode}>
            Toggle Theme
          </Button>
        </div>
      </div>

      {/* Main panels */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <MemoryPanel />
        <CPUPanel />
      </div>
    </div>
  )
}

export default SimulationPage
