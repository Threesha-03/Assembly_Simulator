# Sample Programs

This folder contains example assembly programs that are compatible with the current Assembly Simulator project.

## Programs

- `addition.json`
  - Simple addition of two variables and storing the result.
  - Uses: `LOAD`, `ADD`, `STORE`, `HLT`

  ### Assembly code
  ```assembly
  LOAD R1, [a]
  LOAD R2, [b]
  ADD R1, R2
  STORE [result], R1
  HLT
  ```

- `array_sum.json`
  - Sums four values from memory and writes the total to `sum`.
  - Uses: `MOV`, `LOAD`, `ADD`, `STORE`, `HLT`

  ### Assembly code
  ```assembly
  MOV R1, 0
  LOAD R2, [arr0]
  ADD R1, R2
  LOAD R2, [arr1]
  ADD R1, R2
  LOAD R2, [arr2]
  ADD R1, R2
  LOAD R2, [arr3]
  ADD R1, R2
  STORE [sum], R1
  HLT
  ```

- `factorial.json`
  - Computes factorial via repeated multiplication and conditional jumps.
  - Uses: `LOAD`, `MUL`, `DEC`, `JG`, `STORE`, `HLT`

  ### Assembly code
  ```assembly
  LOAD R1, [n]
  LOAD R2, [result]
  loop: MUL R2, R1
  DEC R1
  JG R1, 0, loop
  STORE [result], R2
  HLT
  ```

- `fibonacci.json`
  - Generates a Fibonacci-like sequence and stores results in `result`.
  - Uses: `LOAD`, `MOV`, `ADD`, `DEC`, `JG`, `STORE`, `HLT`

  ### Assembly code
  ```assembly
  LOAD R1, [a]
  LOAD R2, [b]
  LOAD R3, [count]
  loop: MOV R4, R1
  ADD R4, R2
  STORE [result], R4
  MOV R1, R2
  MOV R2, R4
  DEC R3
  JG R3, 0, loop
  HLT
  ```

- `multiplication.json`
  - Multiplies two numbers by repeated addition.
  - Uses: `LOAD`, `MOV`, `ADD`, `DEC`, `JG`, `STORE`, `HLT`

  ### Assembly code
  ```assembly
  LOAD R1, [x]
  LOAD R2, [y]
  MOV R3, 0
  loop: ADD R3, R1
  DEC R2
  JG R2, 0, loop
  STORE [product], R3
  HLT
  ```

## Compatibility Notes

These sample programs are written to match the simulator's current supported instruction set and program loading format.

Supported instructions used here include:
- `MOV`, `LOAD`, `ADD`, `SUB`, `MUL`, `DIV`, `INC`, `DEC`
- `STORE`, `JMP`, `JE`, `JNE`, `JG`, `JL`, `NOP`, `HLT`

> The folder is intended for manual loading or future sample-selection support in the UI.
