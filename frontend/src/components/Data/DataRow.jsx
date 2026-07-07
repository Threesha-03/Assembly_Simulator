import React from 'react'
import { Input } from '../Shared/Input'
import { Dropdown } from '../Shared/Dropdown'
import { Button } from '../Shared/Button'

const TYPE_OPTIONS = [
  { value: 'BYTE', label: 'BYTE (1 byte)' },
  { value: 'WORD', label: 'WORD (2 bytes)' },
  { value: 'DWORD', label: 'DWORD (4 bytes)' },
  { value: 'QWORD', label: 'QWORD (8 bytes)' },
]

/**
 * DataRow — a single variable entry row in the Data Panel.
 * Props:
 *   variable: { name, type, initialValue }
 *   onChange: (field, value) => void
 *   onRemove: () => void
 */
export function DataRow({ variable, onChange, onRemove }) {
  return (
    <div className="flex items-end gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50">
      <Input
        label="Name"
        value={variable.name}
        onChange={(e) => onChange('name', e.target.value)}
        placeholder="varName"
        className="flex-1 min-w-0"
      />
      <Dropdown
        label="Type"
        value={variable.type}
        onChange={(e) => onChange('type', e.target.value)}
        options={TYPE_OPTIONS}
        className="w-40"
      />
      <Input
        label="Initial Value"
        type="number"
        value={variable.initialValue}
        onChange={(e) => onChange('initialValue', Number(e.target.value))}
        placeholder="0"
        className="w-32"
      />
      <Button variant="danger" onClick={onRemove} className="mb-[2px]" title="Remove variable">
        ✕
      </Button>
    </div>
  )
}

export default DataRow
