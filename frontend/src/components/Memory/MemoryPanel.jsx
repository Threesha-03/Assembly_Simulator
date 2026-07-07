/**
 * MemoryPanel.jsx
 *
 * The single Memory Card: header (title + stats + status + view switch + controls),
 * then Data Memory and Instruction Memory tables with a divider between them.
 * This is the main component other parts of the app import.
 */

import React from 'react'
import { DataMemory } from './DataMemory'
import { CodeMemory } from './CodeMemory'
import { useMemory } from '../../hooks/useMemory'
import { nextViewMode } from './valueFormat'

const STATUS_STYLES = {
  ready: 'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300',
  executing: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  updating: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
}

const VIEW_MODE_LABEL = {
  decimal: 'Decimal',
  hexadecimal: 'Hexadecimal',
  binary: 'Binary',
}

export function MemoryPanel() {
  const { dataRows, instructionRows, stats, viewMode, status, canGoBack, setViewMode, goToPreviousStep, reset } =
    useMemory()

  return (
    <div
      className="
        rounded-2xl border border-slate-200/70 dark:border-white/10
        bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl
        shadow-[0_8px_30px_rgba(15,23,42,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-200/70 dark:border-white/10">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold tracking-widest text-slate-700 dark:text-slate-100 uppercase">
            Memory
          </h2>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_STYLES[status]}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <StatItem label="Instructions" value={stats.totalInstructions} />
          <StatItem label="Variables" value={stats.totalVariables} />
          <StatItem label="Bytes Used" value={stats.totalBytesUsed} />

          <button
            type="button"
            onClick={() => setViewMode(nextViewMode(viewMode))}
            className="
              px-3 py-1.5 rounded-lg text-xs font-medium
              bg-slate-100 hover:bg-slate-200 text-slate-700
              dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-200
              transition-colors
            "
            title="Switch value display format"
          >
            {VIEW_MODE_LABEL[viewMode]}
          </button>

          <button
            type="button"
            onClick={goToPreviousStep}
            disabled={!canGoBack}
            className="
              px-3 py-1.5 rounded-lg text-xs font-medium
              bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed
              dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-200
              transition-colors
            "
          >
            Previous
          </button>

          <button
            type="button"
            onClick={reset}
            className="
              px-3 py-1.5 rounded-lg text-xs font-medium
              bg-rose-50 hover:bg-rose-100 text-rose-600
              dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-300
              transition-colors
            "
          >
            Reset
          </button>
        </div>
      </div>

      {/* Data Memory */}
      <DataMemory rows={dataRows} />

      {/* Divider */}
      <div className="relative flex items-center gap-3 px-5 my-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-white/20 to-transparent" />
        <span className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase">
          Memory Divider
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-white/20 to-transparent" />
      </div>

      {/* Instruction Memory */}
      <div className="pb-4">
        <CodeMemory rows={instructionRows} />
      </div>
    </div>
  )
}

function StatItem({ label, value }) {
  return (
    <span className="hidden sm:inline-flex items-baseline gap-1">
      <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">{value}</span>
      <span>{label}</span>
    </span>
  )
}

export default MemoryPanel
