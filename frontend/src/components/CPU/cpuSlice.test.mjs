import test from 'node:test'
import assert from 'node:assert/strict'
import cpuReducer, { setStartAddress, runFromStart, executeInstruction, previousInstruction } from './cpuSlice.js'

test('previousInstruction restores the prior CPU snapshot without shifting PC backward', () => {
  const instructionMemory = {
    4000: { address: 4000, instruction: 'LOAD R1, [a]' },
    4008: { address: 4008, instruction: 'HLT' },
  }

  let state = cpuReducer(undefined, { type: '@@INIT' })
  state = cpuReducer(state, setStartAddress('4000'))
  state = cpuReducer(state, runFromStart({ instructionMemory, startAddress: '4000' }))
  state = cpuReducer(state, executeInstruction({ instructionMemory, dataMemory: {} }))
  state = cpuReducer(state, previousInstruction({ instructionMemory }))

  assert.equal(state.programCounter, 4008)
  assert.equal(state.instructionRegister, 'LOAD R1, [a]')
  assert.equal(state.status, 'running')
})
