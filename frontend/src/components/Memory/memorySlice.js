/**
 * memorySlice.js
 *
 * Redux Toolkit slice owning all state the Memory Panel renders.
 *
 * INTEGRATION CONTRACT:
 *   1. Dispatch `loadProgram({ variables, instructionLines })` when the user
 *      starts the simulation — this is the only place addresses are computed.
 *   2. The CPU Engine dispatches via the Memory Manager:
 *        - memoryWritten({ address, value })      — STORE / memory-write ops
 *        - memoryRead({ address })                — LOAD / memory-read ops
 *        - instructionPointerMoved({ address })   — when PC advances
 *        - simulationStatusChanged(status)        — status indicator
 *        - snapshotPushed()                       — after each instruction completes
 */

import { createSlice } from '@reduxjs/toolkit'
import { allocateProgramMemory } from './AddressGenerator'

const initialState = {
  variables: [],
  instructionLines: [],
  dataMemory: {},
  instructionMemory: {},
  lastWrittenAddresses: [],
  lastReadAddresses: [],
  currentInstructionAddress: null,
  viewMode: 'decimal',
  status: 'ready',
  history: [],
  initialSnapshot: null,
}

function toRecord(cells) {
  const record = {}
  for (const cell of cells) record[cell.address] = cell
  return record
}

function captureSnapshot(state) {
  return {
    dataMemory: JSON.parse(JSON.stringify(state.dataMemory)),
    instructionMemory: JSON.parse(JSON.stringify(state.instructionMemory)),
    variables: JSON.parse(JSON.stringify(state.variables)),
    instructionLines: JSON.parse(JSON.stringify(state.instructionLines)),
  }
}

function applySnapshot(state, snapshot) {
  state.dataMemory = snapshot.dataMemory
  state.instructionMemory = snapshot.instructionMemory
  state.variables = snapshot.variables
  state.instructionLines = snapshot.instructionLines
}

const memorySlice = createSlice({
  name: 'memory',
  initialState,
  reducers: {
    loadProgram(state, action) {
      const { variables, instructionLines } = action.payload
      const { instructionMemory, dataMemory } = allocateProgramMemory(instructionLines, variables)
      state.variables = variables
      state.instructionLines = instructionLines
      state.dataMemory = toRecord(dataMemory)
      state.instructionMemory = toRecord(instructionMemory)
      state.lastWrittenAddresses = []
      state.lastReadAddresses = []
      state.currentInstructionAddress = null
      state.status = 'ready'
      state.history = []
      state.initialSnapshot = captureSnapshot(state)
    },

    memoryWritten(state, action) {
      const { address, value } = action.payload
      const cell = state.dataMemory[address]
      if (cell) cell.value = value
      state.lastWrittenAddresses = [address]
      state.lastReadAddresses = []
    },

    memoryRead(state, action) {
      state.lastReadAddresses = [action.payload.address]
      state.lastWrittenAddresses = []
    },

    instructionPointerMoved(state, action) {
      state.currentInstructionAddress = action.payload.address
    },

    simulationStatusChanged(state, action) {
      state.status = action.payload
    },

    snapshotPushed(state) {
      state.history.push(captureSnapshot(state))
    },

    previousStep(state) {
      const snapshot = state.history.pop()
      if (snapshot) {
        applySnapshot(state, snapshot)
        state.lastWrittenAddresses = []
        state.lastReadAddresses = []
      }
    },

    resetMemory(state) {
      if (state.initialSnapshot) applySnapshot(state, state.initialSnapshot)
      state.lastWrittenAddresses = []
      state.lastReadAddresses = []
      state.currentInstructionAddress = null
      state.status = 'ready'
      state.history = []
    },

    setViewMode(state, action) {
      state.viewMode = action.payload
    },

    highlightsCleared(state) {
      state.lastWrittenAddresses = []
      state.lastReadAddresses = []
    },
  },
})

export const {
  loadProgram,
  memoryWritten,
  memoryRead,
  instructionPointerMoved,
  simulationStatusChanged,
  snapshotPushed,
  previousStep,
  resetMemory,
  setViewMode,
  highlightsCleared,
} = memorySlice.actions

export default memorySlice.reducer
