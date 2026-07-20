"""
constants.py — Simulator-wide constants.
"""

INSTRUCTION_MEMORY_BASE = 0x1000

SUPPORTED_INSTRUCTIONS = [
    "LOAD", "STORE", "MOV", "ADD", "SUB", "MUL", "DIV",
    "INC", "DEC", "PUSH", "POP", "CALL", "RET",
    "JMP", "JE", "JNE", "JG", "JL", "NOP", "HLT",
]

MEMORY_WRITE_INSTRUCTIONS = ["STORE"]

TYPE_BYTE_SIZE = {
    "BYTE": 1,
    "WORD": 2,
    "DWORD": 4,
    "QWORD": 8,
    "int": 4,
    "float": 4,
    "double": 8,
    "boolean": 1,
}
