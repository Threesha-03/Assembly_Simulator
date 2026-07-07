import React from 'react'
import { useCPU } from '../../hooks/useCPU'

/**
 * InstructionRegister — displays the current Instruction Register (IR) value.
 */
export function InstructionRegister() {
  const { instructionRegister } = useCPU()

  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
      <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
        Instruction Register (IR)
      </span>
      <span className="font-mono font-semibold text-amber-400 text-sm truncate max-w-[12rem]">
        {instructionRegister || '—'}
      </span>
    </div>
  )
}

export default InstructionRegister
