/**
 * animations.js
 *
 * Framer Motion variants for write (yellow), read (light-blue), and
 * current instruction (blue glow) highlights.
 * Also exports useHighlightPulse — turns a Redux "just changed" flag into
 * a ~1s local animated window so Redux stays timer-free.
 */

import { useEffect, useRef, useState } from 'react'

export const HIGHLIGHT_DURATION_MS = 1000

export const writeHighlightVariants = {
  idle: { backgroundColor: 'rgba(250, 204, 21, 0)', scale: 1 },
  active: {
    backgroundColor: [
      'rgba(250, 204, 21, 0)',
      'rgba(250, 204, 21, 0.45)',
      'rgba(250, 204, 21, 0.15)',
      'rgba(250, 204, 21, 0)',
    ],
    scale: [1, 1.015, 1.005, 1],
    transition: { duration: HIGHLIGHT_DURATION_MS / 1000, ease: 'easeOut' },
  },
}

export const readHighlightVariants = {
  idle: { backgroundColor: 'rgba(56, 189, 248, 0)' },
  active: {
    backgroundColor: [
      'rgba(56, 189, 248, 0)',
      'rgba(56, 189, 248, 0.35)',
      'rgba(56, 189, 248, 0)',
    ],
    transition: { duration: HIGHLIGHT_DURATION_MS / 1000, ease: 'easeOut' },
  },
}

export const currentInstructionVariants = {
  idle: { boxShadow: '0 0 0 rgba(59, 130, 246, 0)' },
  active: {
    boxShadow: [
      '0 0 0 rgba(59, 130, 246, 0)',
      '0 0 14px rgba(59, 130, 246, 0.55)',
      '0 0 8px rgba(59, 130, 246, 0.35)',
    ],
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

/**
 * Turns a Redux-driven boolean trigger into a ~1s local highlight window.
 * Re-triggers cleanly if the flag goes true again before the window ends.
 */
export function useHighlightPulse(trigger) {
  const [isActive, setIsActive] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (!trigger) return
    setIsActive(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsActive(false), HIGHLIGHT_DURATION_MS)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [trigger])

  return isActive
}
