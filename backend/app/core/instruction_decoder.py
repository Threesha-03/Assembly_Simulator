"""
instruction_decoder.py — Decodes a parsed instruction into an executable action.
"""

from app.core.parser import parse_instruction


class InstructionDecoder:
    """Decodes opcode + operands from raw instruction text."""

    def decode(self, raw_instruction: str) -> dict:
        parsed = parse_instruction(raw_instruction)
        return {
            "opcode": parsed["opcode"],
            "operands": parsed["operands"],
            "raw": parsed["raw"],
            "is_memory_write": parsed["opcode"] == "STORE",
            "is_memory_read": parsed["opcode"] == "LOAD",
            "is_control_flow": parsed["opcode"] in ("JMP", "JE", "JNE", "JG", "JL", "CALL", "RET"),
            "is_halt": parsed["opcode"] == "HLT",
        }
