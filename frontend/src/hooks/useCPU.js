/**
 * useCPU.js
 *
 * Hook for reading CPU state (registers R1-R15, accumulator, PC, IR)
 * from the cpuSlice in the Redux store.
 */

import { useSelector } from 'react-redux'
import { formatAddress } from '../components/Memory/AddressGenerator'

export function useCPU() {
  const cpu = useSelector((state) => state.cpu)

  return {
    registers: cpu.registers,           // [{ name: 'R1', value: 0 }, ...]
    accumulator: cpu.accumulator,        // number
    programCounter:
      cpu.programCounter !== null
        ? formatAddress(cpu.programCounter)
        : '—',                           // formatted "1001H" or "—"
    instructionRegister: cpu.instructionRegister || '—',
    startAddress: cpu.startAddress,      // raw user input string
    status: cpu.status,                  // 'idle' | 'running' | 'completed'
  }
}

export default useCPU
