/**
 * HomePage.jsx
 *
 * Landing page — user declares variables and writes instructions,
 * then clicks "Start Simulation".
 *
 * On submit:
 *   1. Calls POST /api/instructions/load  (backend allocates memory)
 *   2. Backend returns full state (instruction_memory + data_memory)
 *   3. Redux memory slice is updated for display
 *   4. Navigate to /simulation
 */

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setMemoryState, setStatus } from '../components/Memory/memorySlice'
import { resetCPUDisplay } from '../components/CPU/cpuSlice'
import { loadProgram } from '../services/instructionApi'
import { DataRow } from '../components/Data/DataRow'
import { Button } from '../components/Shared/Button'
import '../styles/home.css'

export function HomePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLightMode, setIsLightMode] = useState(false)
  const [variables, setVariables] = useState([{ name: '', type: 'int', initialValue: 0 }])
  const [programText, setProgramText] = useState('')
  const [error, setError] = useState(null)
  const [syntaxErrors, setSyntaxErrors] = useState([])
  const [loading, setLoading] = useState(false)

  // Restore form state if user navigates back from simulation
  const memoryState = useSelector((state) => state.memory)
  useEffect(() => {
    const existingVars = Object.values(memoryState.dataMemory).map((cell) => ({
      name: cell.label ?? '',
      type: cell.type ?? 'int',
      initialValue: cell.value ?? 0,
    }))
    const existingProgram = Object.values(memoryState.instructionMemory)
      .sort((a, b) => a.address - b.address)
      .map((cell) => {
        const prefix = cell.label ? `${cell.label}: ` : ''
        return `${prefix}${cell.instruction}`.trim()
      })
      .filter(Boolean)
      .join('\n')

    if (existingVars.length > 0) setVariables(existingVars)
    if (existingProgram) setProgramText(existingProgram)
  }, []) // run once on mount

  const handleStart = async () => {
    setError(null)
    setSyntaxErrors([])
    const validVariables = variables.filter((v) => v.name.trim() !== '')
    const instructionLines = programText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const match = line.match(/^([A-Za-z_]\w*)\s*:\s*(.*)$/)
        if (match) return { label: match[1], text: match[2].trim() }
        return { label: null, text: line }
      })
      .filter((line) => line.text.length > 0)

    if (instructionLines.length === 0) {
      setError('Please enter at least one instruction.')
      return
    }

    setLoading(true)
    try {
      const state = await loadProgram({ instructionLines, variables: validVariables })
      dispatch(setMemoryState({
        data_memory: state.data_memory,
        instruction_memory: state.instruction_memory,
      }))
      dispatch(setStatus('ready'))
      dispatch(resetCPUDisplay())
      navigate('/simulation')
    } catch (e) {
      if (e.message === 'SYNTAX_ERRORS' && e.syntaxErrors) {
        setSyntaxErrors(e.syntaxErrors)
      } else {
        setError(e.message || 'Failed to load program. Is the backend running?')
      }
    } finally {
      setLoading(false)
    }
  }

  const updateVariable = (index, field, value) => {
    setVariables((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    )
  }

  const addVariable = () => {
    setVariables((prev) => [...prev, { name: '', type: 'int', initialValue: 0 }])
  }

  const removeVariable = (index) => {
    setVariables((prev) => prev.filter((_, i) => i !== index))
  }

  const panelClass = isLightMode
    ? 'bg-white/90 text-slate-900 border-slate-200 shadow-[0_8px_30px_rgba(15,23,42,0.08)]'
    : 'bg-slate-900/80 text-slate-100 border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.35)]'

  const headingClass = isLightMode ? 'text-slate-800' : 'text-slate-200'
  const subTextClass = isLightMode ? 'text-slate-600' : 'text-slate-400'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="flex justify-end pt-2">
          <Button
            onClick={() => setIsLightMode((v) => !v)}
            variant="ghost"
            className={
              isLightMode
                ? 'bg-white/80 text-slate-800 hover:bg-white'
                : 'bg-slate-800/70 text-white hover:bg-slate-700 border border-slate-600'
            }
          >
            Toggle Theme
          </Button>
        </div>

        {/* Title */}
        <div className="text-center space-y-2 pt-2">
          <h1 className="text-3xl font-bold text-slate-100">
            Assembly Program Execution Simulator
          </h1>
          <p className={subTextClass}>
            Define your variables and instructions below, then run the simulation.
          </p>
        </div>

        {/* General error banner */}
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-900/40 border border-red-700 text-red-300 text-sm">
            ⚠ {error}
          </div>
        )}

        {/* Syntax error list */}
        {syntaxErrors.length > 0 && (
          <div className="rounded-xl border border-red-700 bg-red-900/30 overflow-hidden">
            <div className="px-4 py-2 bg-red-800/50 flex items-center gap-2">
              <span className="text-red-300 font-bold text-sm">
                ✕ {syntaxErrors.length} Syntax Error{syntaxErrors.length > 1 ? 's' : ''} Found
              </span>
              <span className="text-red-400 text-xs">— Fix them before starting simulation</span>
            </div>
            <div className="divide-y divide-red-800/50">
              {syntaxErrors.map((err, idx) => (
                <div key={idx} className="px-4 py-2 flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 px-2 py-0.5 rounded bg-red-800/60 text-red-300 font-mono text-xs font-bold">
                    Line {err.line}
                  </span>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-mono text-xs text-red-200 truncate">
                      {err.instruction}
                    </span>
                    <span className="text-xs text-red-400">
                      {err.error}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Panel */}
        <section className={`space-y-4 rounded-2xl border p-5 ${panelClass}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold ${headingClass}`}>Data Panel — Variables</h2>
            <Button onClick={addVariable} variant={isLightMode ? 'secondary' : 'ghost'}>
              + Add Variable
            </Button>
          </div>
          <div className="space-y-2">
            {variables.map((variable, idx) => (
              <DataRow
                key={idx}
                variable={variable}
                onChange={(field, value) => updateVariable(idx, field, value)}
                onRemove={() => removeVariable(idx)}
                isLightMode={isLightMode}
              />
            ))}
          </div>
        </section>

        {/* Instruction Panel */}
        <section className={`space-y-4 rounded-2xl border p-5 ${panelClass}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold ${headingClass}`}>
              Instruction Panel — Program
            </h2>
          </div>
          <div className="relative">
            <textarea
              value={programText}
              onChange={(e) => setProgramText(e.target.value)}
              placeholder={'Write your assembly program here...\ne.g.\n  MOV R1, 10\n  MOV R2, 5\n  ADD R1, R2\n  HLT'}
              className="w-full min-h-[320px] resize-none rounded-xl border border-slate-700 bg-slate-950/90 p-4 font-mono text-sm text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <div className="pointer-events-none absolute right-4 top-4 text-xs text-slate-400">
              Line editor
            </div>
          </div>
        </section>

        {/* Start Button */}
        <div className="flex justify-center pb-8">
          <Button
            onClick={handleStart}
            variant="primary"
            className="px-8 py-3 text-base"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Start Simulation →'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HomePage
