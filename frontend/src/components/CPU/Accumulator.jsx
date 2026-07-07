import React from 'react'
import { useCPU } from '../../hooks/useCPU'

/**
 * Accumulator — displays the CPU accumulator register value.
 */
export function Accumulator() {
  const { accumulator } = useCPU()

  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
      <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
        Accumulator (ACC)
      </span>
      <span className="font-mono font-semibold text-emerald-400 text-lg">{accumulator}</span>
    </div>
  )
}

export default Accumulator
