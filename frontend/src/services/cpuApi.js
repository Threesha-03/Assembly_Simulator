/**
 * cpuApi.js — API client for CPU simulation operations (placeholder).
 */

const API_BASE = '/api'

export async function fetchCPUState() {
  const res = await fetch(`${API_BASE}/cpu/state`)
  if (!res.ok) throw new Error('Failed to fetch CPU state')
  return res.json()
}

export async function stepExecution() {
  const res = await fetch(`${API_BASE}/cpu/step`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to execute step')
  return res.json()
}

export async function resetExecution() {
  const res = await fetch(`${API_BASE}/cpu/reset`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to reset execution')
  return res.json()
}

export async function startExecution() {
  const res = await fetch(`${API_BASE}/cpu/start`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to start execution')
  return res.json()
}
