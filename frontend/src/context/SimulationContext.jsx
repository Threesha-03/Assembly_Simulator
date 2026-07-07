/**
 * SimulationContext.jsx
 *
 * Provides simulation-wide state that doesn't live in Redux:
 * - current step index
 * - running/paused/completed flags
 * - start / step / pause / reset handlers
 *
 * Redux-managed state (memory, CPU registers, etc.) continues to live in
 * the Redux store; this context handles transient UI-level simulation control.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  loadProgram,
  memoryWritten,
  memoryRead,
  instructionPointerMoved,
  simulationStatusChanged,
  snapshotPushed,
  resetMemory,
} from '../components/Memory/memorySlice'
import { INSTRUCTION_MEMORY_BASE } from '../components/Memory/AddressGenerator'

const SimulationContext = createContext(null)

export function SimulationProvider({ children, variables = [], instructionLines = [] }) {
  const dispatch = useDispatch()
  const [isRunning, setIsRunning] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  // Load program whenever variables/instructions change
  useEffect(() => {
    if (variables.length > 0 || instructionLines.length > 0) {
      dispatch(loadProgram({ variables, instructionLines }))
      dispatch(instructionPointerMoved({ address: INSTRUCTION_MEMORY_BASE }))
    }
  }, [dispatch, variables, instructionLines])

  const start = useCallback(() => {
    setIsRunning(true)
    setIsCompleted(false)
    setCurrentStep(0)
    dispatch(simulationStatusChanged('executing'))
    dispatch(instructionPointerMoved({ address: INSTRUCTION_MEMORY_BASE }))
  }, [dispatch])

  const step = useCallback(() => {
    if (!isRunning || isCompleted) return
    dispatch(snapshotPushed())
    setCurrentStep((prev) => {
      const next = prev + 1
      dispatch(instructionPointerMoved({ address: INSTRUCTION_MEMORY_BASE + next }))
      dispatch(simulationStatusChanged('updating'))
      if (next >= instructionLines.length) {
        setIsCompleted(true)
        setIsRunning(false)
        dispatch(simulationStatusChanged('completed'))
      }
      return next
    })
  }, [dispatch, isRunning, isCompleted, instructionLines.length])

  const pause = useCallback(() => {
    setIsRunning(false)
    dispatch(simulationStatusChanged('ready'))
  }, [dispatch])

  const reset = useCallback(() => {
    setIsRunning(false)
    setIsCompleted(false)
    setCurrentStep(0)
    dispatch(resetMemory())
    dispatch(instructionPointerMoved({ address: INSTRUCTION_MEMORY_BASE }))
  }, [dispatch])

  return (
    <SimulationContext.Provider
      value={{ isRunning, isCompleted, currentStep, start, step, pause, reset }}
    >
      {children}
    </SimulationContext.Provider>
  )
}

export function useSimulation() {
  const ctx = useContext(SimulationContext)
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider')
  return ctx
}

export default SimulationContext
