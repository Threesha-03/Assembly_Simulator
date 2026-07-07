"""
parser.py — Parses raw instruction text into opcode and operands.
"""

import re
from typing import Optional


LABEL_RE = re.compile(r"^(\w+)\s*:\s*(.+)$")
INSTRUCTION_RE = re.compile(r"^(\w+)\s*(.*)?$")


def parse_instruction(text: str) -> dict:
    """
    Parse an instruction string like 'MOV R1, 10' or 'LOAD R2, [count]'.
    Returns { opcode, operands, raw }.
    """
    text = text.strip()
    m = INSTRUCTION_RE.match(text)
    if not m:
        return {"opcode": None, "operands": [], "raw": text}

    opcode = m.group(1).upper()
    operand_str = m.group(2).strip() if m.group(2) else ""
    operands = [op.strip() for op in operand_str.split(",") if op.strip()] if operand_str else []

    return {"opcode": opcode, "operands": operands, "raw": text}


def extract_label(text: str) -> tuple[Optional[str], str]:
    """
    If the instruction line starts with 'label:', strip the label and return
    (label, rest). Otherwise return (None, original_text).
    """
    m = LABEL_RE.match(text.strip())
    if m:
        return m.group(1), m.group(2).strip()
    return None, text
