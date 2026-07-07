import React from 'react'

/**
 * ErrorMessage — displays error messages in a styled box.
 */
export function ErrorMessage({ message, onDismiss }) {
  if (!message) return null

  return (
    <div
      className="
        p-4 rounded-lg border border-rose-500/30
        bg-rose-500/10 text-rose-300
        flex items-start justify-between gap-3
      "
    >
      <div className="flex-1">
        <p className="font-medium text-sm">Error</p>
        <p className="text-sm opacity-90">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-rose-300 hover:text-rose-100 transition-colors"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
