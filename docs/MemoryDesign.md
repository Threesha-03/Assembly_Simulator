# Memory Design

## Address Layout

Instructions start at `0x1000` (4096 decimal). Data memory begins immediately after the last instruction, with each variable offset by its type's byte size:

```
0x1000  MOV R1, 10         ← instruction 0
0x1001  LOAD R2, [count]   ← instruction 1
0x1002  ADD R1, R2         ← instruction 2
0x1003  STORE [sum], R1    ← instruction 3
0x1004  INC R3             ← instruction 4
0x1005  JMP loop           ← instruction 5
0x1006  HLT                ← instruction 6
── data memory starts here ──
0x1007  count  WORD  = 0   (2 bytes)
0x1009  sum    DWORD = 100  (4 bytes)
0x100D  flag   BYTE  = 1   (1 byte)
0x100E  total  QWORD = 999 (8 bytes)
```

## Type Byte Sizes

| Type  | Bytes |
|-------|-------|
| BYTE  | 1     |
| WORD  | 2     |
| DWORD | 4     |
| QWORD | 8     |

## Highlights

- **Yellow glow** — write operation (STORE)
- **Light blue flash** — read operation (LOAD)
- **Blue glow** — currently executing instruction row

Highlights are driven locally (not stored in Redux) via `useHighlightPulse` — they decay after ~1s automatically.
