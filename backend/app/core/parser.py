"""
parser.py — Parses raw instruction text into opcode and operands.
"""

import re
from typing import Optional


LABEL_RE = re.compile(r"^(\w+)\s*:\s*(.+)$")
INSTRUCTION_RE = re.compile(r"^(\w+)\s*(.*)?$")

# All supported opcodes
VALID_OPCODES = {
    "MOV", "LOAD", "STORE",
    "ADD", "SUB", "MUL", "DIV", "INC", "DEC",
    "CMP", "JMP", "JE", "JNE", "JG", "JL",
    "NOP", "HLT",
}

# Expected operand counts: (min, max)
OPERAND_COUNTS = {
    "MOV":   (2, 2),
    "LOAD":  (2, 2),
    "STORE": (2, 2),
    "ADD":   (2, 2),
    "SUB":   (2, 2),
    "MUL":   (2, 2),
    "DIV":   (2, 2),
    "INC":   (1, 1),
    "DEC":   (1, 1),
    "CMP":   (2, 2),
    "JMP":   (1, 1),
    "JE":    (1, 2),   # JE label  or  JE Rx, label
    "JNE":   (1, 2),
    "JG":    (1, 3),   # JG label  or  JG Rx, label  or  JG Rx, val, label
    "JL":    (1, 3),
    "NOP":   (0, 0),
    "HLT":   (0, 0),
}


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
    # Clean brackets for operand counting
    clean = re.sub(r"[\[\]]", "", operand_str)
    operands = [op.strip() for op in clean.split(",") if op.strip()] if operand_str else []

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


def validate_program(instruction_lines: list[dict]) -> list[dict]:
    """
    Validate a list of instruction dicts { text, label }.
    Returns a list of errors: [{ line, instruction, error }]
    Empty list means no errors.
    """
    errors = []

    for i, line in enumerate(instruction_lines):
        text = (line.get("text") or "").strip()
        line_num = i + 1

        if not text:
            continue

        # Strip label prefix before parsing
        _, body = extract_label(text)
        if not body.strip():
            errors.append({
                "line": line_num,
                "instruction": text,
                "error": "Label defined but no instruction after it.",
            })
            continue

        parsed = parse_instruction(body)
        opcode = parsed["opcode"]

        # Unknown opcode
        if opcode not in VALID_OPCODES:
            errors.append({
                "line": line_num,
                "instruction": text,
                "error": f"Unknown instruction '{opcode}'. "
                         f"Supported: {', '.join(sorted(VALID_OPCODES))}",
            })
            continue

        # Wrong operand count
        operands = parsed["operands"]
        min_ops, max_ops = OPERAND_COUNTS[opcode]
        count = len(operands)
        if not (min_ops <= count <= max_ops):
            expected = (
                f"{min_ops}" if min_ops == max_ops
                else f"{min_ops}–{max_ops}"
            )
            errors.append({
                "line": line_num,
                "instruction": text,
                "error": f"'{opcode}' expects {expected} operand(s), got {count}.",
            })

    return errors
