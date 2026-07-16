import React from 'react'
import { Input } from '../Shared/Input'
import { Dropdown } from '../Shared/Dropdown'
import { Button } from '../Shared/Button'

const TYPE_OPTIONS = [
  { value: 'int', label: 'int (4 bytes)' },
  { value: 'float', label: 'float (4 bytes)' },
  { value: 'double', label: 'double (8 bytes)' },
  { value: 'boolean', label: 'boolean (1 byte)' },
]

/**
 * DataRow — a single variable entry row in the Data Panel.
 * Props:
 *   variable: { name, type, initialValue }
 *   onChange: (field, value) => void
 *   onRemove: () => void
 */
export function DataRow({ variable, onChange, onRemove, isLightMode = false }) {
  const rowClass = isLightMode
    ? 'bg-slate-50 border-slate-200'
    : 'bg-slate-800/40 border-slate-700/50'
  const textClass = isLightMode ? 'text-slate-700' : 'text-slate-100'

  return (
    <div className={`flex items-end gap-3 p-3 rounded-lg border ${rowClass}`}>
      <Input
        label="Name"
        value={variable.name}
        onChange={(e) => onChange('name', e.target.value)}
        placeholder="varName"
        className="flex-1 min-w-0"
        isLightMode={isLightMode}
      />
      <Dropdown
        label="Type"
        value={variable.type}
        onChange={(e) => onChange('type', e.target.value)}
        options={TYPE_OPTIONS}
        className="w-40"
        isLightMode={isLightMode}
      />
      <Input
        label="Initial Value"
        type="number"
        value={variable.initialValue ?? 0}
        onChange={(e) => onChange('initialValue', Number(e.target.value || 0))}
        placeholder="0"
        className="w-32"
        isLightMode={isLightMode}
      />
      <Button variant="danger" onClick={onRemove} className="mb-[2px]" title="Remove variable">
        ✕
      </Button>
    </div>
  )
}

export default DataRow
