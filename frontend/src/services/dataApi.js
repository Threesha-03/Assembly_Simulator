/**
 * dataApi.js — API client for data/variable operations (placeholder).
 */

const API_BASE = '/api'

export async function fetchVariables() {
  const res = await fetch(`${API_BASE}/data/variables`)
  if (!res.ok) throw new Error('Failed to fetch variables')
  return res.json()
}

export async function createVariable(variable) {
  const res = await fetch(`${API_BASE}/data/variables`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(variable),
  })
  if (!res.ok) throw new Error('Failed to create variable')
  return res.json()
}

export async function updateVariable(id, updates) {
  const res = await fetch(`${API_BASE}/data/variables/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error('Failed to update variable')
  return res.json()
}

export async function deleteVariable(id) {
  const res = await fetch(`${API_BASE}/data/variables/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete variable')
  return res.json()
}
