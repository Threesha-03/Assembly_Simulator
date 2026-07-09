import React from 'react'

/**
 * Input — shared text/number input with optional label.
 */
export function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  disabled = false,
  className = '',
  isLightMode = false,
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className={`text-xs font-medium ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          px-3 py-2 rounded-lg text-sm
          ${isLightMode ? 'bg-white border border-slate-300 text-slate-800 placeholder-slate-400' : 'bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500'}
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:opacity-40 disabled:cursor-not-allowed
        `}
      />
    </div>
  )
}

export default Input
