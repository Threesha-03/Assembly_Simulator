/**
 * instructionApi.js — API client for instruction operations (placeholder).
 */

const API_BASE = '/api'

export async function fetchInstructions() {
  const res = await fetch(`${API_BASE}/instructions`)
  if (!res.ok) throw new Error('Failed to fetch instructions')
  return res.json()
}

export async function loadProgram(payload) {
  const res = await fetch(`${API_BASE}/instructions/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to load program')
  return res.json()
}
