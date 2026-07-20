/**
 * SimulationContext.jsx
 *
 * Thin context wrapper — simulation control now lives entirely in the backend.
 * This context is kept for any components that may consume useSimulation(),
 * but is no longer responsible for execution logic.
 */

import React, { createContext, useContext } from 'react'

const SimulationContext = createContext(null)

export function SimulationProvider({ children }) {
  return (
    <SimulationContext.Provider value={{}}>
      {children}
    </SimulationContext.Provider>
  )
}

export function useSimulation() {
  return useContext(SimulationContext) ?? {}
}

export default SimulationContext
