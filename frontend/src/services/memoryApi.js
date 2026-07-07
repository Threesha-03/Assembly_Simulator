/**
 * memoryApi.js — API client for memory state queries (placeholder).
 */

const API_BASE = '/api'

export async function fetchMemoryState() {
  const res = await fetch(`${API_BASE}/memory/state`)
  if (!res.ok) throw new Error('Failed to fetch memory state')
  return res.json()
}

export async function fetchDataMemory() {
  const res = await fetch(`${API_BASE}/memory/data`)
  if (!res.ok) throw new Error('Failed to fetch data memory')
  return res.json()
}

export async function fetchInstructionMemory() {
  const res = await fetch(`${API_BASE}/memory/instructions`)
  if (!res.ok) throw new Error('Failed to fetch instruction memory')
  return res.json()
}
