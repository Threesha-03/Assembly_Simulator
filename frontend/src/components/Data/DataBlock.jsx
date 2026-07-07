import React from 'react'

/**
 * DataBlock — display-only block for a single variable's allocated memory cell.
 * Used in the simulation view to show a variable's current state.
 * Props:
 *   name: string
 *   type: DataType
 *   address: string   (formatted, e.g. "100AH")
 *   value: string     (formatted per current view mode)
 *   isWritten: boolean
 *   isRead: boolean
 */
export function DataBlock({ name, type, address, value, isWritten, isRead }) {
  let highlight = ''
  if (isWritten) highlight = 'border-yellow-400/60 bg-yellow-400/5'
  else if (isRead) highlight = 'border-sky-400/60 bg-sky-400/5'

  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-lg
        border border-slate-700/50 transition-colors
        ${highlight}
      `}
    >
      <span className="text-sm font-semibold text-slate-200 w-24 truncate">{name}</span>
      <span className="text-xs text-slate-400 w-16">{type}</span>
      <span className="font-mono text-xs text-slate-400 w-16">{address}</span>
      <span className="font-mono text-sm text-slate-100 flex-1 text-right">{value}</span>
    </div>
  )
}

export default DataBlock
