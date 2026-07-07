# Assembly Program Execution Simulator

A comprehensive web-based simulator for CPU architecture and assembly language program execution, featuring real-time memory visualization, CPU state management, and step-by-step instruction execution.

## Features

- **Memory Management**: Visualize data and instruction memory with dynamic address allocation
- **CPU Simulation**: Track registers, accumulator, program counter, and instruction register
- **Step-by-Step Execution**: Execute assembly programs instruction by instruction
- **Multiple View Modes**: Display memory values in decimal, hexadecimal, or binary
- **Time Travel Debugging**: Step backward through execution history
- **Dark Mode Support**: Toggle between light and dark themes

## Tech Stack

### Frontend
- React 18 with TypeScript
- Redux Toolkit for state management
- Framer Motion for animations
- Tailwind CSS for styling
- Vite for build tooling

### Backend
- FastAPI (Python)
- Pydantic for data validation
- RESTful API architecture

## Project Structure

```
assembly-program-execution-simulator/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client services
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   └── styles/         # CSS stylesheets
├── backend/                # FastAPI backend
│   └── app/
│       ├── routes/         # API route handlers
│       ├── services/       # Business logic
│       ├── models/         # Data models
│       ├── schemas/        # Pydantic schemas
│       ├── core/           # Core simulation engine
│       └── utils/          # Utility functions
├── docs/                   # Documentation
└── sample-programs/        # Example assembly programs
```

## Getting Started

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:5173

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend API will be available at http://localhost:8000

## Documentation

See the `docs/` directory for detailed documentation:
- [API Documentation](docs/API.md)
- [Memory Design](docs/MemoryDesign.md)
- [CPU Design](docs/CPUDesign.md)
- [Architecture Overview](docs/Architecture.md)

## Sample Programs

The `sample-programs/` directory contains example assembly programs:
- `addition.json` - Simple addition program
- `factorial.json` - Factorial calculation
- `fibonacci.json` - Fibonacci sequence generator
- `multiplication.json` - Multiplication using repeated addition
- `array_sum.json` - Array summation

## License

MIT License - see LICENSE file for details
