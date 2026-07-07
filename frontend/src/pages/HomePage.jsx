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

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loadProgram } from '../components/Memory/memorySlice'
import { DataRow } from '../components/Data/DataRow'
import { InstructionRow } from '../components/Instruction/InstructionRow'
import { Button } from '../components/Shared/Button'
import { useData } from '../hooks/useData'
import { useInstruction } from '../hooks/useInstruction'
import '../styles/home.css'

const SAMPLE_VARIABLES = [
  { name: 'count', type: 'WORD', initialValue: 0 },
  { name: 'sum', type: 'DWORD', initialValue: 100 },
  { name: 'flag', type: 'BYTE', initialValue: 1 },
  { name: 'total', type: 'QWORD', initialValue: 999 },
]

const SAMPLE_INSTRUCTIONS = [
  { label: 'main', text: 'MOV R1, 10' },
  { label: null, text: 'LOAD R2, [count]' },
  { label: null, text: 'ADD R1, R2' },
  { label: null, text: 'STORE [sum], R1' },
  { label: 'loop', text: 'INC R3' },
  { label: null, text: 'JMP loop' },
  { label: null, text: 'HLT' },
]

export function HomePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { variables, addVariable, updateVariable, removeVariable } = useData(SAMPLE_VARIABLES)
  const { instructions, addInstruction, updateInstruction, removeInstruction } =
    useInstruction(SAMPLE_INSTRUCTIONS)

  const handleStart = () => {
    const validVariables = variables.filter((v) => v.name.trim() !== '')
    const validInstructions = instructions.filter((i) => i.text.trim() !== '')
    dispatch(loadProgram({ variables: validVariables, instructionLines: validInstructions }))
    navigate('/simulation')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title */}
        <div className="text-center space-y-2 pt-8">
          <h1 className="text-3xl font-bold text-slate-100">
            Assembly Program Execution Simulator
          </h1>
          <p className="text-slate-400">
            Define your variables and instructions below, then run the simulation.
          </p>
        </div>

        {/* Data Panel */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-200">Data Panel — Variables</h2>
            <Button onClick={addVariable} variant="ghost">
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
              />
            ))}
          </div>
        </section>

        {/* Instruction Panel */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-200">
              Instruction Panel — Program
            </h2>
            <Button onClick={addInstruction} variant="ghost">
              + Add Instruction
            </Button>
          </div>
          <div className="space-y-2">
            {instructions.map((instruction, idx) => (
              <InstructionRow
                key={idx}
                instruction={instruction}
                onChange={(field, value) => updateInstruction(idx, field, value)}
                onRemove={() => removeInstruction(idx)}
              />
            ))}
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
