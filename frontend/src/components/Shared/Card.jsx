import React from 'react'

/**
 * Card — glass-morphism styled container card.
 */
export function Card({ children, className = '', title }) {
  return (
    <div
      className={`
        rounded-2xl border border-slate-200/70 dark:border-white/10
        bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl
        shadow-[0_8px_30px_rgba(15,23,42,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]
        overflow-hidden
        ${className}
      `}
    >
      {title && (
        <div className="px-5 py-4 border-b border-slate-200/70 dark:border-white/10">
          <h2 className="text-sm font-bold tracking-widest text-slate-700 dark:text-slate-100 uppercase">
            {title}
          </h2>
        </div>
      )}
      {children}
    </div>
  )
}

export default Card
