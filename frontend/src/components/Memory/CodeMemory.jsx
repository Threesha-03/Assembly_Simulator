/**
 * CodeMemory.jsx  (Instruction Memory)
 *
 * Renders the "INSTRUCTION MEMORY" table: Label | Address | Instruction.
 * Highlights the currently executing row with a blue glow.
 */

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { currentInstructionVariants } from './animations'

function InstructionRowImpl({ addressLabel, label, instruction, isCurrent, zebra }) {
  const zebraClass = zebra ? 'bg-slate-50/60 dark:bg-white/[0.03]' : 'bg-transparent'

  return (
    <motion.tr
      className={`border-b border-slate-200/60 dark:border-white/10 transition-colors ${zebraClass} hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 ${
        isCurrent ? 'relative' : ''
      }`}
      variants={currentInstructionVariants}
      animate={isCurrent ? 'active' : 'idle'}
      initial="idle"
    >
      <td className="px-4 py-2 font-medium text-slate-700 dark:text-slate-200">
        {label || <span className="text-slate-300 dark:text-slate-600">—</span>}
      </td>
      <td className="px-4 py-2 font-mono text-xs text-slate-500 dark:text-slate-400">
        {addressLabel}
      </td>
      <td className="px-4 py-2 font-mono text-sm text-slate-800 dark:text-slate-100">
        <span className="inline-flex items-center gap-2">
          {isCurrent && (
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          )}
          {instruction}
        </span>
      </td>
    </motion.tr>
  )
}

const InstructionRow = memo(InstructionRowImpl)

/**
 * CodeMemory — INSTRUCTION MEMORY section of the Memory Panel.
 * Props: rows — array of FormattedInstructionRow from useMemory hook
 */
export function CodeMemory({ rows }) {
  return (
    <section aria-labelledby="instruction-memory-heading" className="flex flex-col h-full overflow-hidden">
      <h3
        id="instruction-memory-heading"
        className="flex-none px-4 pt-3 pb-2 text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase"
      >
        Instruction Memory
      </h3>
      <div className="flex-1 min-h-0 overflow-y-auto rounded-lg border border-slate-200/70 dark:border-white/10 scroll-smooth mx-4">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            <tr className="border-b border-slate-200 dark:border-white/10 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <th className="px-4 py-2 font-semibold">Label</th>
              <th className="px-4 py-2 font-semibold">Address</th>
              <th className="px-4 py-2 font-semibold">Instruction</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-sm text-slate-400">
                  No instructions loaded - Load on the Home Page.
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <InstructionRow
                  key={row.address}
                  addressLabel={row.addressLabel}
                  label={row.label}
                  instruction={row.instruction}
                  isCurrent={row.isCurrent}
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

export default CodeMemory
