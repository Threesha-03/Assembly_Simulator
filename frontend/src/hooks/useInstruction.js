/**
 * useInstruction.js
 *
 * Hook for managing the instruction list on the Home page.
 * Provides add / update / remove helpers and the instruction array.
 */

import { useState, useCallback } from 'react'

const DEFAULT_INSTRUCTION = () => ({ label: null, text: '' })

export function useInstruction(initialInstructions = []) {
  const [instructions, setInstructions] = useState(
    initialInstructions.length > 0 ? initialInstructions : [DEFAULT_INSTRUCTION()]
  )

  const addInstruction = useCallback(() => {
    setInstructions((prev) => [...prev, DEFAULT_INSTRUCTION()])
  }, [])

  const updateInstruction = useCallback((index, field, value) => {
    setInstructions((prev) =>
      prev.map((instr, i) => (i === index ? { ...instr, [field]: value } : instr))
    )
  }, [])

  const removeInstruction = useCallback((index) => {
    setInstructions((prev) => prev.filter((_, i) => i !== index))
  }, [])

  return { instructions, addInstruction, updateInstruction, removeInstruction }
}

export default useInstruction
