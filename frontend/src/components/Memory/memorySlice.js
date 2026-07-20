/**
 * memorySlice.js — Display-only Redux slice for memory state.
 *
 * All allocation and mutation logic has moved to the backend.
 * This slice receives memory state from API responses and stores it for rendering.
 *
 * Actions:
 *   setMemoryState(payload)  — set data + instruction memory from backend response
 *   setCurrentInstruction(addr) — highlight the current instruction row
 *   setStatus(status)        — update display status badge
 *   resetMemoryDisplay()     — clear all display state
 */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  dataMemory: {},          // { [address]: { address, label, type, value } }
  instructionMemory: {},   // { [address]: { address, label, instruction } }
  currentInstructionAddress: null,
  lastWrittenAddress: null,
  viewMode: 'decimal',
  status: 'ready',
}

function toRecord(cells) {
  const record = {}
  for (const cell of cells) record[cell.address] = cell
  return record
}

const memorySlice = createSlice({
  name: 'memory',
  initialState,
  reducers: {
    /**
     * Apply memory arrays returned by the backend.
     * payload: { data_memory: [...], instruction_memory: [...] }
     */
    setMemoryState(state, action) {
      const { data_memory, instruction_memory } = action.payload
      if (data_memory)        state.dataMemory = toRecord(data_memory)
      if (instruction_memory) state.instructionMemory = toRecord(instruction_memory)
    },

    setCurrentInstruction(state, action) {
      state.currentInstructionAddress = action.payload
    },

    setLastWrittenAddress(state, action) {
      state.lastWrittenAddress = action.payload
    },

    setStatus(state, action) {
      state.status = action.payload
    },

    setViewMode(state, action) {
      state.viewMode = action.payload
    },

    resetMemoryDisplay(state) {
      return { ...initialState }
    },
  },
})

export const {
  setMemoryState,
  setCurrentInstruction,
  setLastWrittenAddress,
  setStatus,
  setViewMode,
  resetMemoryDisplay,
} = memorySlice.actions

export default memorySlice.reducer
