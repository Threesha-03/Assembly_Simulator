"""
validators.py — Input validation helpers.
"""

import re
from app.utils.constants import SUPPORTED_INSTRUCTIONS, TYPE_BYTE_SIZE

IDENTIFIER_RE = re.compile(r"^[A-Za-z_]\w*$")


def is_valid_identifier(name: str) -> bool:
    """Check if `name` is a valid variable or label identifier."""
    return bool(IDENTIFIER_RE.match(name))


def is_valid_data_type(type_str: str) -> bool:
    """Check if `type_str` is a supported data type."""
    return type_str in TYPE_BYTE_SIZE


def is_valid_instruction(text: str) -> bool:
    """Check if the instruction starts with a known opcode."""
    opcode = text.strip().split()[0].upper() if text.strip() else ""
    return opcode in SUPPORTED_INSTRUCTIONS


def validate_variable(variable: dict) -> list[str]:
    """Return a list of validation error messages, empty if valid."""
    errors = []
    if not variable.get("name") or not is_valid_identifier(variable["name"]):
        errors.append(f"Invalid variable name: '{variable.get('name')}'")
    if not is_valid_data_type(variable.get("type", "")):
        errors.append(f"Invalid data type: '{variable.get('type')}'")
    return errors


def validate_instruction(instruction: dict) -> list[str]:
    """Return a list of validation error messages, empty if valid."""
    errors = []
    text = instruction.get("text", "").strip()
    if not text:
        errors.append("Instruction text cannot be empty")
    elif not is_valid_instruction(text):
        errors.append(f"Unknown opcode in: '{text}'")
    return errors
