import React from 'react'
import { useMemory } from '../../hooks/useMemory'
import { DataBlock } from './DataBlock'

/**
 * DataTable — displays all data memory cells (variables) in the simulation view.
 */
export function DataTable() {
  const { dataRows } = useMemory()

  return (
    <div className="space-y-2">
      {dataRows.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">No variables declared.</p>
      ) : (
        dataRows.map((row) => (
          <DataBlock
            key={row.address}
            name={row.label}
            type={row.type || 'BYTE'}
            address={row.addressLabel}
            value={row.displayValue}
            isWritten={row.isWritten}
            isRead={row.isRead}
          />
        ))
      )}
    </div>
  )
}

export default DataTable
