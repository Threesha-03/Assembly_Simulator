import React from 'react'
import { useCPU } from '../../hooks/useCPU'

/**
 * ProgramCounter — displays the current Program Counter (PC) address.
 */
export function ProgramCounter() {
  const { programCounter } = useCPU()

  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
      <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
        Program Counter (PC)
      </span>
      <span className="font-mono font-semibold text-blue-400 text-lg">{programCounter}</span>
    </div>
  )
}

export default ProgramCounter
