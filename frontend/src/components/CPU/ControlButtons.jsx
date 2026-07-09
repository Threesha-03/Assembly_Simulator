import React from 'react'
import { Button } from '../Shared/Button'

/**
 * ControlButtons — simulation control buttons (Run, Previous, Next, Reset).
 * Props:
 *   onRun, onPrevious, onNext, onReset: handler functions
 *   isRunning: boolean
 *   isCompleted: boolean
 *   canGoBack: boolean
 */
export function ControlButtons({
  onRun,
  onPrevious,
  onNext,
  onReset,
  isRunning,
  isCompleted,
  canGoBack = false,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-5 py-4">
      <Button onClick={onRun} disabled={isRunning || isCompleted} className="bg-green-600 hover:bg-green-700">
        Run
      </Button>
      <Button onClick={onPrevious} disabled={!canGoBack || !isRunning || isCompleted} className="bg-blue-600 hover:bg-blue-700">
        Previous
      </Button>
      <Button onClick={onNext} disabled={!isRunning || isCompleted} className="bg-yellow-500 hover:bg-yellow-600 text-slate-900">
        Next
      </Button>
      <Button onClick={onReset} className="bg-red-600 hover:bg-red-700">
        Reset
      </Button>
    </div>
  )
}

export default ControlButtons
