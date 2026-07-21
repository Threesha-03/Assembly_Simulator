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
    "int": 4,
    "float": 4,
    "double": 8,
    "boolean": 1,
}
