/**
 * useMemory.js — Hook that reads memory display state from Redux.
 * State is populated by API calls made in CPUPanel and HomePage.
 */

import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setViewMode as setViewModeAction, resetMemoryDisplay } from '../components/Memory/memorySlice'
import { formatValue } from '../components/Memory/valueFormat'

function formatAddress(address) {
  return String(address)
}

export function useMemory() {
  const dispatch = useDispatch()
  const memory = useSelector((state) => state.memory)

  const dataRows = useMemo(
    () =>
      Object.values(memory.dataMemory)
        .sort((a, b) => a.address - b.address)
        .map((cell) => ({
          address: cell.address,
          addressLabel: formatAddress(cell.address),
          label: cell.label,
          type: cell.type,
          displayValue: formatValue(cell.value, cell.type, memory.viewMode),
          isWritten: memory.lastWrittenAddress === cell.address,
          isRead: false,
        })),
    [memory]
  )

  const instructionRows = useMemo(
    () =>
      Object.values(memory.instructionMemory)
        .sort((a, b) => a.address - b.address)
        .map((cell) => ({
          address: cell.address,
          addressLabel: formatAddress(cell.address),
          label: cell.label,
          instruction: cell.instruction,
          isCurrent: memory.currentInstructionAddress === cell.address,
        })),
    [memory]
  )

  const stats = useMemo(() => ({
    totalInstructions: Object.keys(memory.instructionMemory).length,
    totalVariables: Object.keys(memory.dataMemory).length,
    totalBytesUsed:
      Object.keys(memory.instructionMemory).length +
      Object.keys(memory.dataMemory).length,
  }), [memory])

  const setViewMode = useCallback((mode) => dispatch(setViewModeAction(mode)), [dispatch])
  const reset = useCallback(() => dispatch(resetMemoryDisplay()), [dispatch])

  return {
    dataRows,
    instructionRows,
    stats,
    viewMode: memory.viewMode,
    status: memory.status,
    setViewMode,
    reset,
  }
}

export default useMemory
