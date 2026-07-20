/**
 * instructionApi.js — API client for loading programs into the backend.
 */

const API_BASE = '/api'

export async function fetchInstructions() {
  const res = await fetch(`${API_BASE}/instructions`)
  if (!res.ok) throw new Error('Failed to fetch instructions')
  return res.json()
}

/**
 * Load a program into the backend execution engine.
 * @param {{ variables: Array, instructionLines: Array }} payload
 */
export async function loadProgram(payload) {
  const res = await fetch(`${API_BASE}/instructions/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instruction_lines: payload.instructionLines.map((line) => ({
        text: line.text,
        label: line.label ?? null,
      })),
      variables: payload.variables.map((v) => ({
        name: v.name,
        type: v.type,
        initialValue: v.initialValue ?? v.initial_value ?? 0,
      })),
    }),
  })
  if (!res.ok) throw new Error('Failed to load program')
  return res.json()
}
