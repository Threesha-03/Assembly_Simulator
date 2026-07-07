import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SimulationPage from './pages/SimulationPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/simulation" element={<SimulationPage />} />
      </Routes>
    </BrowserRouter>
  )
}
