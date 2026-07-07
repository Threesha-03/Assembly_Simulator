# Frontend — Assembly Simulator

React + Vite frontend for the Assembly Program Execution Simulator.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Structure

- `src/components/` — Reusable UI components organized by domain
  - `Data/` — Data panel components (variables)
  - `Instruction/` — Instruction panel components
  - `Memory/` — Memory visualization panel
  - `CPU/` — CPU state panel (registers, PC, IR, accumulator)
  - `Shared/` — Generic shared UI components
- `src/pages/` — Page-level components
- `src/services/` — API client functions
- `src/context/` — React context (SimulationContext)
- `src/hooks/` — Custom hooks
- `src/styles/` — CSS stylesheets
