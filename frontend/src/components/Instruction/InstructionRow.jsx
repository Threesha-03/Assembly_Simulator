import React from 'react'
import { Input } from '../Shared/Input'
import { Button } from '../Shared/Button'

/**
 * InstructionRow — a single instruction entry row in the Instruction Panel.
 * Props:
 *   instruction: { label, text }
 *   onChange: (field, value) => void
 *   onRemove: () => void
 */
export function InstructionRow({ instruction, onChange, onRemove }) {
  return (
    <div className="flex items-end gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
      <Input
        label="Label (optional)"
        value={instruction.label || ''}
        onChange={(e) => onChange('label', e.target.value || null)}
        placeholder="main:"
        className="w-32"
      />
      <Input
        label="Instruction"
        value={instruction.text}
        onChange={(e) => onChange('text', e.target.value)}
        placeholder="MOV R1, 10"
        className="flex-1 min-w-0"
      />
      <Button variant="danger" onClick={onRemove} className="mb-[2px]" title="Remove instruction">
        ✕
      </Button>
    </div>
  )
}

export default InstructionRow
