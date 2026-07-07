/**
 * DataMemory.jsx
 *
 * Renders the "DATA MEMORY" table section: Label | Address | Value.
 * Sticky header, zebra striping, animated highlights per write/read ops.
 */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import {
  writeHighlightVariants,
  readHighlightVariants,
  useHighlightPulse,
} from './animations'

function DataMemoryRowImpl({ addressLabel, label, displayValue, isWritten, isRead, zebra }) {
  const writePulse = useHighlightPulse(isWritten)
  const readPulse = useHighlightPulse(isRead && !isWritten)
  const zebraClass = zebra ? 'bg-slate-50/60 dark:bg-white/[0.03]' : 'bg-transparent'

  return (
    <motion.tr
      className={`group border-b border-slate-200/60 dark:border-white/10 transition-colors ${zebraClass} hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10`}
      variants={writePulse ? writeHighlightVariants : readHighlightVariants}
      animate={writePulse || readPulse ? 'active' : 'idle'}
      initial="idle"
    >
      <td className="px-4 py-2 font-medium text-slate-700 dark:text-slate-200">
        {label || <span className="text-slate-300 dark:text-slate-600">—</span>}
      </td>
      <td className="px-4 py-2 font-mono text-xs text-slate-500 dark:text-slate-400">
        {addressLabel}
      </td>
      <td className="px-4 py-2 font-mono text-sm text-slate-800 dark:text-slate-100">
        {displayValue}
      </td>
    </motion.tr>
  )
}

const DataMemoryRow = memo(DataMemoryRowImpl)

/**
 * DataMemory — DATA MEMORY section of the Memory Panel.
 * Props: rows — array of FormattedDataRow from useMemory hook
 */
export function DataMemory({ rows }) {
  return (
    <section aria-labelledby="data-memory-heading">
      <h3
        id="data-memory-heading"
        className="px-4 pt-4 pb-2 text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase"
      >
        Data Memory
      </h3>
      <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-200/70 dark:border-white/10 scroll-smooth">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            <tr className="border-b border-slate-200 dark:border-white/10 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <th className="px-4 py-2 font-semibold">Label</th>
              <th className="px-4 py-2 font-semibold">Address</th>
              <th className="px-4 py-2 font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-slate-400">
                  No variables declared yet — add some on the Home page.
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <DataMemoryRow
                  key={row.address}
                  addressLabel={row.addressLabel}
                  label={row.label}
                  displayValue={row.displayValue}
                  isWritten={row.isWritten}
                  isRead={row.isRead}
                  zebra={idx % 2 === 1}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default DataMemory
