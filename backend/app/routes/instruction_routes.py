"""
instruction_routes.py — API routes for instruction operations.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def get_instructions():
    """Retrieve all loaded instructions."""
    return []


@router.post("/load")
async def load_program(payload: dict):
    """Load a program (variables + instructions) and allocate memory."""
    return {"status": "loaded", "payload": payload}
