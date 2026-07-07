# CPU Design

## Registers

- **R1–R6** — general-purpose registers (integer, 16-bit)
- **ACC** — accumulator
- **PC** — program counter (starts at 0x1000)
- **IR** — instruction register (holds the current instruction text)

## Fetch-Execute Cycle

1. Fetch instruction from `instruction_memory[PC]`
2. Load into IR
3. Decode (InstructionDecoder)
4. Execute (ExecutionEngine dispatches to ALU / MemoryManager / register writes)
5. Increment PC (unless a jump occurred)

## Supported Instructions

| Opcode | Description                     |
|--------|---------------------------------|
| MOV    | Move value to register          |
| LOAD   | Load from data memory           |
| STORE  | Store to data memory            |
| ADD    | Add two registers                |
| SUB    | Subtract                        |
| MUL    | Multiply                        |
| DIV    | Integer divide                  |
| INC    | Increment register by 1         |
| DEC    | Decrement register by 1         |
| PUSH   | Push register to stack          |
| POP    | Pop from stack to register      |
| CALL   | Call subroutine                 |
| RET    | Return from subroutine          |
| JMP    | Unconditional jump              |
| JE     | Jump if equal                   |
| JNE    | Jump if not equal               |
| JG     | Jump if greater                 |
| JL     | Jump if less                    |
| NOP    | No operation                    |
| HLT    | Halt execution                  |
