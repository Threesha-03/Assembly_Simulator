/**
 * HomePage.jsx
 *
 * The landing page where the user:
 *   1. Declares variables (Data Panel) via DataRow inputs
 *   2. Writes instructions (Instruction Panel) via InstructionRow inputs
 *   3. Clicks "Start Simulation" to navigate to SimulationPage
 *
 * On submit, dispatches loadProgram to the memory slice and navigates.
 */

import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadProgram } from '../components/Memory/memorySlice'
import { DataRow } from '../components/Data/DataRow'
import { Button } from '../components/Shared/Button'
import '../styles/home.css'

export function HomePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLightMode, setIsLightMode] = useState(false)
  const memoryState = useSelector((state) => state.memory)
  const [variables, setVariables] = useState([])
  const [programText, setProgramText] = useState('')

  useEffect(() => {
    const existingVariables = (memoryState.variables ?? []).map((variable) => ({
      ...variable,
      name: variable.name ?? '',
      type: variable.type ?? 'int',
      initialValue: variable.initialValue ?? 0,
    }))

    const existingProgramText = (memoryState.instructionLines ?? [])
      .map((line) => {
        const label = line.label ? `${line.label}: ` : ''
        return `${label}${line.text ?? ''}`.trim()
      })
      .filter(Boolean)
      .join('\n')

    setVariables(existingVariables.length > 0 ? existingVariables : [{ name: '', type: 'int', initialValue: 0 }])
    setProgramText(existingProgramText)
  }, [memoryState.variables, memoryState.instructionLines])

  const handleStart = () => {
    const validVariables = variables.filter((v) => v.name.trim() !== '')
    const lines = programText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const match = line.match(/^([A-Za-z_]\w*):\s*(.*)$/)
        if (match) {
          return { label: match[1], text: match[2] }
        }
        return { label: null, text: line }
      })

    dispatch(loadProgram({ variables: validVariables, instructionLines: lines }))
    navigate('/simulation')
  }

  const updateVariable = (index, field, value) => {
    setVariables((prev) => prev.map((variable, currentIndex) => (currentIndex === index ? { ...variable, [field]: value } : variable)))
  }

  const addVariable = () => {
    setVariables((prev) => [...prev, { name: '', type: 'int', initialValue: 0 }])
  }

  const removeVariable = (index) => {
    setVariables((prev) => prev.filter((_, currentIndex) => currentIndex !== index))
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
            onClick={() => setIsLightMode((value) => !value)}
            variant="ghost"
            className={isLightMode ? 'bg-white/80 text-slate-800 hover:bg-white' : 'bg-slate-800/70 text-white hover:bg-slate-700 border border-slate-600'}
          >
            Toggle Theme
          </Button>
        </div>

        {/* Title */}
        <div className="text-center space-y-2 pt-2">
          <h1 className={`text-3xl font-bold ${isLightMode ? 'text-slate-100' : 'text-slate-100'}`}>
            Assembly Program Execution Simulator
          </h1>
          <p className={subTextClass}>
            Define your variables and instructions below, then run the simulation.
          </p>
        </div>

        {/* Data Panel */}
        <section className={`space-y-4 rounded-2xl border p-5 ${panelClass}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold ${headingClass}`}>Data Panel - Variables</h2>
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
              Instruction Panel - Program
            </h2>
          </div>
          <div className="relative">
            <textarea
              value={programText}
              onChange={(e) => setProgramText(e.target.value)}
              placeholder="Write your assembly program here..."
              className="w-full min-h-[320px] resize-none rounded-xl border border-slate-700 bg-slate-950/90 p-4 font-mono text-sm text-slate-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <div className="pointer-events-none absolute right-4 top-4 text-xs text-slate-400">
              Line editor
            </div>
          </div>
        </section>

        {/* Start Button */}
        <div className="flex justify-center pb-8">
          <Button onClick={handleStart} variant="primary" className="px-8 py-3 text-base">
            Start Simulation →
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HomePage
