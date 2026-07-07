import React from 'react'
import { Button } from '../Shared/Button'

/**
 * ControlButtons — simulation control buttons (Start, Step, Pause, Reset).
 * Props:
 *   onStart, onStep, onPause, onReset: handler functions
 *   isRunning: boolean
 *   isCompleted: boolean
 */
export function ControlButtons({ onStart, onStep, onPause, onReset, isRunning, isCompleted }) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-5 py-4">
      <Button onClick={onStart} disabled={isRunning} variant="primary">
        Start
      </Button>
      <Button onClick={onStep} disabled={!isRunning || isCompleted} variant="secondary">
        Step Forward
      </Button>
      <Button onClick={onPause} disabled={!isRunning} variant="ghost">
        Pause
      </Button>
      <Button onClick={onReset} variant="danger">
        Reset
      </Button>
    </div>
  )
}

export default ControlButtons
