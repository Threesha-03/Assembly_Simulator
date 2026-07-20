/**
 * cpuSlice.js — Display-only Redux slice for CPU state.
 *
 * All execution logic has moved to the backend (Python/FastAPI).
 * This slice receives state from API responses and stores it for rendering.
 *
 * Actions:
 *   setCPUState(state)   — update all CPU fields from a backend response
 *   setStartAddress(str) — track user-typed start address input
 *   resetCPUDisplay()    — clear back to initial display state
 */

import { createSlice } from '@reduxjs/toolkit'

function makeRegisters() {
  return Array.from({ length: 16 }, (_, i) => ({ name: `R${i}`, value: 0 }))
}

const initialState = {
  registers: makeRegisters(),
  accumulator: 0,
  programCounter: null,
  instructionRegister: '',
  startAddress: '',
  status: 'idle',          // 'idle' | 'running' | 'completed'
  canGoBack: false,
  error: null,
}

const cpuSlice = createSlice({
  name: 'cpu',
  initialState,
  reducers: {
    /**
     * Apply a full state object returned by the backend.
     * Shape: { registers, accumulator, program_counter, instruction_register,
     *          start_address, status, can_go_back }
     */
    setCPUState(state, action) {
      const s = action.payload
      if (s.registers)             state.registers = s.registers
      if (s.accumulator !== undefined) state.accumulator = s.accumulator
      if (s.program_counter !== undefined) state.programCounter = s.program_counter
      if (s.instruction_register !== undefined) state.instructionRegister = s.instruction_register ?? ''
      if (s.start_address !== undefined) state.startAddress = s.start_address ?? state.startAddress
      if (s.status)                state.status = s.status
      if (s.can_go_back !== undefined) state.canGoBack = s.can_go_back
      state.error = null
    },

    setStartAddress(state, action) {
      state.startAddress = action.payload
    },

    setError(state, action) {
      state.error = action.payload
    },

    resetCPUDisplay(state) {
      return { ...initialState, startAddress: state.startAddress }
    },
  },
})

export const { setCPUState, setStartAddress, setError, resetCPUDisplay } = cpuSlice.actions
export default cpuSlice.reducer
