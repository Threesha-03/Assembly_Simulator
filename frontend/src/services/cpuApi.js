/**
 * cpuApi.js — API client for CPU simulation control.
 * All execution logic lives in the backend; frontend just calls these.
 */

const API_BASE = '/api'

export async function fetchCPUState() {
  const res = await fetch(`${API_BASE}/cpu/state`)
  if (!res.ok) throw new Error('Failed to fetch CPU state')
  return res.json()
}

export async function runExecution(startAddress) {
  const res = await fetch(`${API_BASE}/cpu/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ start_address: startAddress }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Failed to start execution')
  }
  return res.json()
}

export async function stepExecution() {
  const res = await fetch(`${API_BASE}/cpu/step`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to execute step')
  return res.json()
}

export async function previousStep() {
  const res = await fetch(`${API_BASE}/cpu/previous`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to go to previous step')
  return res.json()
}

export async function resetExecution() {
  const res = await fetch(`${API_BASE}/cpu/reset`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to reset execution')
  return res.json()
}
