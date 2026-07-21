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



1. ADD 2 NUMBERS

LOAD R1, [A]
LOAD R2, [B]
ADD R1, R2
STORE [RESULT], R1
HLT


2. MERGE SORT

MOV R1, 38
MOV R2, 12
MOV R3, 56
MOV R4, 7
CMP R1, R2
JG swap1
JMP skip1
swap1: MOV R5, R1
MOV R1, R2
MOV R2, R5
skip1: CMP R3, R4
JG swap2
JMP skip2
swap2: MOV R5, R3
MOV R3, R4
MOV R4, R5
skip2: CMP R1, R3
JG swap3
JMP skip3
swap3: MOV R5, R1
MOV R1, R3
MOV R3, R5
skip3: CMP R2, R4
JG swap4
JMP skip4
swap4: MOV R5, R2
MOV R2, R4
MOV R4, R5
skip4: CMP R2, R3
JG swap5
JMP skip5
swap5: MOV R5, R2
MOV R2, R3
MOV R3, R5
skip5: STORE [a], R1
STORE [b], R2
STORE [c], R3
STORE [d], R4
HLT


3. FACTORIAL

MOV R1, 5
MOV R2, 1
loop: CMP R1, 0
JE done
MUL R2, R1
DEC R1
JMP loop
done: STORE [result], R2
HLT


4. Sum of 1 to N (1+2+...+10 = 55)

MOV R1, 10
MOV R2, 0
loop: CMP R1, 0
JE done
ADD R2, R1
DEC R1
JMP loop
done: STORE [total], R2
HLT


5. Fibonacci (10th term = 55)

MOV R1, 0
MOV R2, 1
MOV R3, 10
MOV R4, 0
loop: CMP R3, 0
JE done
MOV R5, R2
ADD R2, R1
MOV R1, R5
DEC R3
JMP loop
done: STORE [fib], R1
HLT


6. Power (2^8 = 256)

MOV R1, 2
MOV R2, 8
MOV R3, 1
loop: CMP R2, 0
JE done
MUL R3, R1
DEC R2
JMP loop
done: STORE [power], R3
HLT


7. GCD of two numbers

MOV R1, 48
MOV R2, 18
loop: CMP R1, R2
JE done
JG r1bigger
MOV R3, R1
MOV R1, R2
MOV R2, R3
r1bigger: SUB R1, R2
JMP loop
done: STORE [gcd], R1
HLT


8. Bubble Sort

LOAD R1, x
LOAD R2, y
LOAD R3, z
CMP R1, R2
JG swap1
JMP skip1
swap1: MOV R4, R1
MOV R1, R2
MOV R2, R4
skip1: CMP R2, R3
JG swap2
JMP skip2
swap2: MOV R4, R2
MOV R2, R3
MOV R3, R4
skip2: CMP R1, R2
JG swap3
JMP skip3
swap3: MOV R4, R1
MOV R1, R2
MOV R2, R4
skip3: STORE [x], R1
STORE [y], R2
STORE [z], R3
HLT


9. Count Even Numbers

MOV R1, 10
MOV R2, 0
loop: CMP R1, 0
JE done
MOV R3, R1
DIV R3, 2
MUL R3, 2
CMP R3, R1
JE iseven
JMP next
iseven: INC R2
next: DEC R1
JMP loop
done: STORE [count], R2
HLT


10. Arithmetic Expression — (a + b) * (c - d)

LOAD R1, a
LOAD R2, b
LOAD R3, c
LOAD R4, d
ADD R1, R2
SUB R3, R4
MUL R1, R3
STORE [result], R1
HLT


11. Greatest of 2

LOAD R1, a
LOAD R2, b
CMP R1, R2
JG r1wins
STORE [greatest], R2
JMP done
r1wins: STORE [greatest], R1
done: HLT


12. Greatest of 3

LOAD R1, a
LOAD R2, b
LOAD R3, c
CMP R1, R2
JG r1bigger
MOV R1, R2
r1bigger: CMP R1, R3
JG r1wins
STORE [greatest], R3
JMP done
r1wins: STORE [greatest], R1
done: HLT
