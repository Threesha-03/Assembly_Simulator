# Architecture Overview

## One-Way Data Flow

```
User Input (Home Page)
    ↓
Redux: loadProgram()
    ↓
AddressGenerator (pure, no side effects)
    ↓
memorySlice state (data + instruction memory cells)
    ↓
Memory Panel (React components read state only)
```

## During Simulation

```
CPU Engine (execution_engine.py)
    ↓ dispatches actions via
Memory Manager (memory_manager.py)
    ↓
Redux actions: memoryWritten / memoryRead / instructionPointerMoved
    ↓
memorySlice state update
    ↓
Memory Panel re-renders (only changed rows, via React.memo)
```

## Key Design Decisions

- **No hardcoded addresses.** AddressGenerator is the single source of truth.
- **Memory Panel never imports CPU Engine.** One-way flow only.
- **Highlights are local, not Redux.** useHighlightPulse gives a ~1s animation window without timers in state.
- **Previous/Reset** use an immutable snapshot stack.
- **View mode** (decimal/hex/binary) only changes formatting; stored values are untouched.
