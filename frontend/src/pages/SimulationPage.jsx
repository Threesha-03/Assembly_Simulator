/**
 * SimulationPage.jsx
 *
 * The main simulation view.
 * Layout: top bar | Memory Panel (left) | CPU Panel (right)
 *
 * CPUPanel handles all interaction with the backend execution API.
 * MemoryPanel displays state received from API responses via Redux.
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MemoryPanel } from '../components/Memory/MemoryPanel'
import { CPUPanel } from '../components/CPU/CPUPanel'
import { Button } from '../components/Shared/Button'
import '../styles/simulation.css'

export function SimulationPage() {
  const navigate = useNavigate()

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col px-6 pt-4 pb-4">
      {/* Top bar — fixed height */}
      <div className="flex items-center justify-between mb-4 max-w-7xl mx-auto w-full shrink-0">
        <h1 className="text-xl font-bold text-slate-100">Assembly Simulator</h1>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate('/')}>
            ← Home
          </Button>
          <Button variant="ghost" onClick={toggleDarkMode}>
            Toggle Theme
          </Button>
        </div>
      </div>

      {/* Main panels — fill all remaining vertical space, no page scroll */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <MemoryPanel />
        <CPUPanel />
      </div>
    </div>
  )
}

export default SimulationPage
