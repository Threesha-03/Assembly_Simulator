import React from 'react'

/**
 * Table — generic table wrapper with sticky header and scroll.
 * columns: Array of { key, label }
 * rows: Array of objects with keys matching column keys
 * renderCell: optional (row, colKey) => ReactNode for custom rendering
 */
export function Table({ columns, rows, renderCell, maxHeight = '16rem', emptyMessage = 'No data.' }) {
  return (
    <div
      className="overflow-y-auto rounded-lg border border-slate-200/70 dark:border-white/10 scroll-smooth"
      style={{ maxHeight }}
    >
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <tr className="border-b border-slate-200 dark:border-white/10 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2 font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-sm text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr
                key={idx}
                className={`border-b border-slate-200/60 dark:border-white/10 ${
                  idx % 2 === 1 ? 'bg-slate-50/60 dark:bg-white/[0.03]' : ''
                } hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-colors`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2 text-slate-800 dark:text-slate-100">
                    {renderCell ? renderCell(row, col.key) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
