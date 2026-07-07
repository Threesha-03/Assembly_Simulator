import React from 'react'

/**
 * InstructionBlock — display-only block for a single instruction memory cell.
 * Used in the simulation view.
 * Props:
 *   label: string
 *   address: string  (formatted, e.g. "1000H")
 *   instruction: string
 *   isCurrent: boolean
 */
export function InstructionBlock({ label, address, instruction, isCurrent }) {
  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-lg
        border transition-colors font-mono text-sm
        ${
          isCurrent
            ? 'border-blue-500/50 bg-blue-500/10 shadow-[0_0_14px_rgba(59,130,246,0.2)]'
            : 'border-slate-700/50 bg-transparent'
        }
      `}
    >
      {isCurrent && (
        <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
      )}
      <span className="text-slate-400 w-12 text-xs">{address}</span>
      <span className="text-blue-300 w-20 truncate">{label || ''}</span>
      <span className="text-slate-100 flex-1">{instruction}</span>
    </div>
  )
}

export default InstructionBlock
