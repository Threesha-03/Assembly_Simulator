"""
loader.py — Loads a program (variables + instructions) from JSON or dict payload.
"""

from typing import List
from app.models.variable import Variable
from app.models.instruction import InstructionLine


def load_from_dict(payload: dict) -> tuple[List[InstructionLine], List[Variable]]:
    """Parse a raw program dict into instruction lines and variable declarations."""
    instruction_dicts = payload.get("instruction_lines", [])
    variable_dicts = payload.get("variables", [])

    instructions = [
        InstructionLine(text=i["text"], label=i.get("label"))
        for i in instruction_dicts
    ]

    variables = [
        Variable(name=v["name"], type=v["type"], initial_value=v.get("initial_value", 0))
        for v in variable_dicts
    ]

    return instructions, variables
