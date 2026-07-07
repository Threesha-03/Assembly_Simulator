"""
cpu_routes.py — API routes for CPU simulation control.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/state")
async def get_cpu_state():
    """Return current CPU register state."""
    return {
        "registers": {"R1": 0, "R2": 0, "R3": 0, "R4": 0, "R5": 0, "R6": 0},
        "accumulator": 0,
        "program_counter": "1000H",
        "instruction_register": None,
        "is_halted": False,
    }


@router.post("/start")
async def start_execution():
    """Begin program execution."""
    return {"status": "executing"}


@router.post("/step")
async def step_execution():
    """Execute a single instruction step."""
    return {"status": "stepped", "step": 1}


@router.post("/reset")
async def reset_execution():
    """Reset execution to initial state."""
    return {"status": "reset"}
