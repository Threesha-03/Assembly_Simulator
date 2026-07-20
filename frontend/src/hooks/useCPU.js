/**
 * useCPU.js — Hook exposing CPU display state from Redux.
 * State is populated by API calls made in CPUPanel.
 */

import { useSelector } from 'react-redux'

export function useCPU() {
  const cpu = useSelector((state) => state.cpu)

  return {
    registers: cpu.registers,
    accumulator: cpu.accumulator,
    programCounter: cpu.programCounter !== null ? String(cpu.programCounter) : '—',
    instructionRegister: cpu.instructionRegister || '—',
    startAddress: cpu.startAddress,
    status: cpu.status,
    canGoBack: cpu.canGoBack,
    error: cpu.error,
  }
}

export default useCPU
