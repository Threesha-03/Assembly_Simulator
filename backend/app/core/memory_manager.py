"""
memory_manager.py — Authoritative memory manager for the CPU Engine.

Architecture:  CPU Engine -> Memory Manager -> Redux (via WebSocket/API)
The Memory Manager owns reads/writes and notifies the frontend of changes.
"""

from app.services.memory_service import MemoryService


class MemoryManager:
    """Thin facade over MemoryService with change-notification hooks."""

    def __init__(self, memory_service: MemoryService):
        self._memory = memory_service
        self._on_write_callbacks = []
        self._on_read_callbacks = []

    def on_write(self, callback):
        """Register a callback called with (address, value) on every write."""
        self._on_write_callbacks.append(callback)

    def on_read(self, callback):
        """Register a callback called with (address,) on every read."""
        self._on_read_callbacks.append(callback)

    def write(self, address: int, value: int) -> bool:
        result = self._memory.write(address, value)
        if result:
            for cb in self._on_write_callbacks:
                cb(address, value)
        return result

    def read(self, address: int) -> int | None:
        value = self._memory.read(address)
        if value is not None:
            for cb in self._on_read_callbacks:
                cb(address)
        return value

    def get_instruction(self, address: int):
        return self._memory.instruction_memory.get(address)
