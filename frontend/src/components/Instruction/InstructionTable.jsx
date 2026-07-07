import React from 'react'
import { useMemory } from '../../hooks/useMemory'
import { InstructionBlock } from './InstructionBlock'

/**
 * InstructionTable — displays all instruction memory cells in the simulation view.
 */
export function InstructionTable() {
  const { instructionRows } = useMemory()

  return (
    <div className="space-y-2">
      {instructionRows.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">No instructions loaded.</p>
      ) : (
        instructionRows.map((row) => (
          <InstructionBlock
            key={row.address}
            label={row.label}
            address={row.addressLabel}
            instruction={row.instruction}
            isCurrent={row.isCurrent}
          />
        ))
      )}
    </div>
  )
}

export default InstructionTable
