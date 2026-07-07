/**
 * valueFormat.js
 *
 * Formats a stored numeric value for display per the active ViewMode.
 * The stored value is never mutated — only its on-screen representation changes.
 */

import { TYPE_BYTE_SIZE } from './AddressGenerator'

export function bitWidthForType(type) {
  return (TYPE_BYTE_SIZE[type] ?? 1) * 8
}

export function toBinary(value, type) {
  const width = bitWidthForType(type)
  const unsigned = value < 0 ? (1 << width) + value : value
  return unsigned.toString(2).padStart(width, '0')
}

export function toHex(value, type) {
  const hexDigits = (TYPE_BYTE_SIZE[type] ?? 1) * 2
  const width = bitWidthForType(type)
  const unsigned = value < 0 ? value + Math.pow(2, width) : value
  return `${unsigned.toString(16).toUpperCase().padStart(hexDigits, '0')}H`
}

export function formatValue(value, type, mode) {
  switch (mode) {
    case 'hexadecimal':
      return toHex(value, type)
    case 'binary':
      return toBinary(value, type)
    case 'decimal':
    default:
      return String(value)
  }
}

export const VIEW_MODE_CYCLE = ['decimal', 'hexadecimal', 'binary']

export function nextViewMode(current) {
  const idx = VIEW_MODE_CYCLE.indexOf(current)
  return VIEW_MODE_CYCLE[(idx + 1) % VIEW_MODE_CYCLE.length]
}
