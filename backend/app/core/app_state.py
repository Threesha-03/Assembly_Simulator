"""
app_state.py — Global singleton holding the ExecutionEngine instance.
FastAPI is single-process in dev, so module-level state persists across requests.
"""

from app.core.execution_engine import ExecutionEngine

engine = ExecutionEngine()
