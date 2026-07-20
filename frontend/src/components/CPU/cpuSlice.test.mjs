/**
 * cpuSlice.test.mjs
 *
 * Tests for the display-only cpuSlice.
 * Execution logic lives in the backend; this slice just stores display state.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import cpuReducer, { setCPUState, setStartAddress, resetCPUDisplay, setError } from './cpuSlice.js'

test('initial state is idle with zeroed registers', () => {
  const state = cpuReducer(undefined, { type: '@@INIT' })
  assert.equal(state.status, 'idle')
  assert.equal(state.accumulator, 0)
  assert.equal(state.programCounter, null)
  assert.equal(state.registers.length, 16)
  assert.equal(state.registers[0].name, 'R0')
  assert.equal(state.registers[0].value, 0)
})

test('setStartAddress updates the startAddress field', () => {
  let state = cpuReducer(undefined, { type: '@@INIT' })
  state = cpuReducer(state, setStartAddress('4000'))
  assert.equal(state.startAddress, '4000')
})

test('setCPUState applies a backend response', () => {
  let state = cpuReducer(undefined, { type: '@@INIT' })
  state = cpuReducer(state, setCPUState({
    registers: [{ name: 'R0', value: 0 }, { name: 'R1', value: 42 }],
    accumulator: 10,
    program_counter: 4008,
    instruction_register: 'MOV R1, 42',
    status: 'running',
    can_go_back: true,
  }))
  assert.equal(state.accumulator, 10)
  assert.equal(state.programCounter, 4008)
  assert.equal(state.instructionRegister, 'MOV R1, 42')
  assert.equal(state.status, 'running')
  assert.equal(state.canGoBack, true)
  assert.equal(state.registers[1].value, 42)
})

test('resetCPUDisplay clears execution state but not startAddress', () => {
  let state = cpuReducer(undefined, { type: '@@INIT' })
  state = cpuReducer(state, setStartAddress('4000'))
  state = cpuReducer(state, setCPUState({ status: 'running', accumulator: 99, program_counter: 4008 }))
  state = cpuReducer(state, resetCPUDisplay())
  assert.equal(state.status, 'idle')
  assert.equal(state.accumulator, 0)
  assert.equal(state.programCounter, null)
  // startAddress is preserved so the user doesn't have to retype it
  assert.equal(state.startAddress, '4000')
})

test('setError stores an error message', () => {
  let state = cpuReducer(undefined, { type: '@@INIT' })
  state = cpuReducer(state, setError('Invalid start address'))
  assert.equal(state.error, 'Invalid start address')
  // setCPUState clears the error
  state = cpuReducer(state, setCPUState({ status: 'running' }))
  assert.equal(state.error, null)
})
