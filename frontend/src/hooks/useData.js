/**
 * useData.js
 *
 * Hook for managing the variable (data) list on the Home page.
 * Provides add / update / remove helpers and the variable array.
 */

import { useState, useCallback } from 'react'

const DEFAULT_VARIABLE = () => ({ name: '', type: 'int', initialValue: 0 })

export function useData(initialVariables = []) {
  const [variables, setVariables] = useState(
    initialVariables.length > 0 ? initialVariables : [DEFAULT_VARIABLE()]
  )

  const addVariable = useCallback(() => {
    setVariables((prev) => [...prev, DEFAULT_VARIABLE()])
  }, [])

  const updateVariable = useCallback((index, field, value) => {
    setVariables((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    )
  }, [])

  const removeVariable = useCallback((index) => {
    setVariables((prev) => prev.filter((_, i) => i !== index))
  }, [])

  return { variables, addVariable, updateVariable, removeVariable }
}

export default useData
