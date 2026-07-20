"""
cpu_routes.py — CPU simulation control: run, step, previous, reset, state.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.app_state import engine

router = APIRouter()


class RunRequest(BaseModel):
    start_address: str


@router.get("/state")
async def get_cpu_state():
    """Return current full simulation state (CPU + memory)."""
    return engine.get_state()


@router.post("/run")
async def run_execution(body: RunRequest):
    """
    Start execution from a given start address.
    Loads the first instruction into IR and executes it.
    """
    if not engine.is_loaded():
        raise HTTPException(status_code=400, detail="No program loaded. Call /api/instructions/load first.")
    state = engine.run(body.start_address)
    if "error" in state:
        raise HTTPException(status_code=400, detail=state["error"])
    return state


@router.post("/step")
async def step_execution():
    """Execute the next instruction (PC → IR → execute → PC++)."""
    if not engine.is_loaded():
        raise HTTPException(status_code=400, detail="No program loaded.")
    return engine.step()


@router.post("/previous")
async def previous_step():
    """Restore the previous CPU + memory snapshot (undo last step)."""
    return engine.previous()


@router.post("/reset")
async def reset_execution():
    """Full reset: registers, accumulator, PC, and data memory back to initial values."""
    return engine.reset()
