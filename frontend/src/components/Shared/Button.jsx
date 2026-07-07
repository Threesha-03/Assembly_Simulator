import React from 'react'

/**
 * Button — shared button component with variant support.
 * Variants: primary | secondary | danger | ghost
 */
export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  type = 'button',
  className = '',
  title,
}) {
  const base =
    'px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white',
    ghost:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-200',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
