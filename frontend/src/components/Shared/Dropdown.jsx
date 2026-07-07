import React from 'react'

/**
 * Dropdown — shared select component.
 * options: Array of { value: string, label: string }
 */
export function Dropdown({ label, id, value, onChange, options = [], disabled = false, className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-slate-400">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="
          px-3 py-2 rounded-lg text-sm
          bg-slate-800 border border-slate-700
          text-slate-100
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:opacity-40 disabled:cursor-not-allowed
        "
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Dropdown
