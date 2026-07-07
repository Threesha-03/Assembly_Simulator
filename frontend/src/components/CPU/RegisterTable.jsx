import React from 'react'
import { useCPU } from '../../hooks/useCPU'

/**
 * RegisterTable — displays all general-purpose CPU registers.
 */
export function RegisterTable() {
  const { registers } = useCPU()

  return (
    <section aria-labelledby="register-table-heading">
      <h3
        id="register-table-heading"
        className="px-4 pt-4 pb-2 text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase"
      >
        Registers
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/10">
              <th className="px-4 py-2 font-semibold">Register</th>
              <th className="px-4 py-2 font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            {registers.map((reg, idx) => (
              <tr
                key={reg.name}
                className={`border-b border-slate-200/60 dark:border-white/10 ${
                  idx % 2 === 1 ? 'bg-slate-50/60 dark:bg-white/[0.03]' : ''
                }`}
              >
                <td className="px-4 py-2 font-mono font-semibold text-blue-400">{reg.name}</td>
                <td className="px-4 py-2 font-mono text-slate-100">{reg.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default RegisterTable
