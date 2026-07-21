"""
instruction_routes.py — Load a program (variables + instructions) into the engine.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.core.app_state import engine
from app.core.parser import validate_program

router = APIRouter()


class InstructionLineIn(BaseModel):
    text: str
    label: Optional[str] = None


class VariableIn(BaseModel):
    name: str
    type: str
    initialValue: int = 0


class LoadProgramRequest(BaseModel):
    instruction_lines: List[InstructionLineIn]
    variables: List[VariableIn]


@router.get("/")
async def get_instructions():
    """Return currently loaded instruction memory."""
    state = engine.get_state()
    return state["instruction_memory"]


@router.post("/load")
async def load_program(payload: LoadProgramRequest):
    """
    Validate, then load variables + instructions into the execution engine.
    Returns 422 with error list if syntax errors are found.
    """
    instruction_lines = [{"text": i.text, "label": i.label} for i in payload.instruction_lines]
    variables = [{"name": v.name, "type": v.type, "initialValue": v.initialValue} for v in payload.variables]

    # Validate syntax before loading
    errors = validate_program(instruction_lines)
    if errors:
        raise HTTPException(
            status_code=422,
            detail={"syntax_errors": errors}
        )

    state = engine.load_program(instruction_lines, variables)
    return state
