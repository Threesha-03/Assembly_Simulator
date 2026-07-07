/**
 * useMemory.js
 *
 * Hook that reads derived memory state from Redux and exposes formatted rows,
 * stats, and dispatchable user-facing actions (view switch, previous, reset).
 *
 * Used by MemoryPanel, DataMemory, CodeMemory, and DataTable/InstructionTable.
 */

import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setViewMode as setViewModeAction,
  previousStep as previousStepAction,
  resetMemory as resetMemoryAction,
  highlightsCleared as highlightsClearedAction,
} from '../components/Memory/memorySlice'
import { formatValue } from '../components/Memory/valueFormat'
import { formatAddress } from '../components/Memory/AddressGenerator'

// ─── Selectors ────────────────────────────────────────────────────────────────

function selectMemory(state) {
  return state.memory
}

function getDataMemoryRows(memory) {
  return Object.values(memory.dataMemory).sort((a, b) => a.address - b.address)
}

function getInstructionMemoryRows(memory) {
  return Object.values(memory.instructionMemory).sort((a, b) => a.address - b.address)
}

function getMemoryStats(memory) {
  const totalInstructions = Object.keys(memory.instructionMemory).length
  const totalVariables = Object.keys(memory.dataMemory).length
  const dataAddresses = Object.values(memory.dataMemory)
  const lastDataAddress = dataAddresses.length
    ? Math.max(...dataAddresses.map((c) => c.address))
    : null
  const instructionAddresses = Object.keys(memory.instructionMemory).length
  const totalBytesUsed =
    lastDataAddress !== null
      ? lastDataAddress -
        Math.min(...Object.values(memory.instructionMemory).map((c) => c.address), lastDataAddress) +
        1
      : instructionAddresses
  return { totalInstructions, totalVariables, totalBytesUsed }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useMemory() {
  const dispatch = useDispatch()
  const memory = useSelector(selectMemory)

  const dataRows = useMemo(
    () =>
      getDataMemoryRows(memory).map((cell) => ({
        address: cell.address,
        addressLabel: formatAddress(cell.address),
        label: cell.label,
        type: cell.type,
        displayValue: formatValue(cell.value, cell.type, memory.viewMode),
        isWritten: memory.lastWrittenAddresses.includes(cell.address),
        isRead: memory.lastReadAddresses.includes(cell.address),
      })),
    [memory]
  )

  const instructionRows = useMemo(
    () =>
      getInstructionMemoryRows(memory).map((cell) => ({
        address: cell.address,
        addressLabel: formatAddress(cell.address),
        label: cell.label,
        instruction: cell.instruction,
        isCurrent: memory.currentInstructionAddress === cell.address,
      })),
    [memory]
  )

  const stats = useMemo(() => getMemoryStats(memory), [memory])

  const setViewMode = useCallback((mode) => dispatch(setViewModeAction(mode)), [dispatch])
  const goToPreviousStep = useCallback(() => dispatch(previousStepAction()), [dispatch])
  const reset = useCallback(() => dispatch(resetMemoryAction()), [dispatch])
  const clearHighlights = useCallback(() => dispatch(highlightsClearedAction()), [dispatch])

  return {
    dataRows,
    instructionRows,
    stats,
    viewMode: memory.viewMode,
    status: memory.status,
    canGoBack: memory.history.length > 0,
    setViewMode,
    goToPreviousStep,
    reset,
    clearHighlights,
  }
}

export default useMemory
