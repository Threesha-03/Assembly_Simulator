"""
execution_engine.py — Ties together decoder, ALU, register manager,
and memory manager to execute one instruction at a time.
"""

from app.core.instruction_decoder import InstructionDecoder
from app.core.alu import ALU
from app.core.register_manager import RegisterManager
from app.core.memory_manager import MemoryManager
from app.core.cpu_state import CPUStateManager


class ExecutionEngine:
    """
    Executes instructions step-by-step.
    Architecture: CPU Engine -> Memory Manager -> Redux (via notification callbacks).
    """

    def __init__(self, memory_manager: MemoryManager):
        self.memory = memory_manager
        self.cpu = CPUStateManager()
        self.decoder = InstructionDecoder()
        self.alu = ALU()
        self._label_map: dict[str, int] = {}

    def load_label_map(self, label_map: dict[str, int]) -> None:
        """Pre-compute label -> address map for jump resolution."""
        self._label_map = label_map

    def step(self) -> dict:
        """Execute the instruction at the current PC. Returns execution info."""
        if self.cpu.state.is_halted:
            return {"status": "halted"}

        cell = self.memory.get_instruction(self.cpu.state.program_counter)
        if not cell:
            self.cpu.state.is_halted = True
            return {"status": "halted", "reason": "No instruction at PC"}

        decoded = self.decoder.decode(cell.instruction)
        self.cpu.state.instruction_register = cell.instruction

        result = self._execute(decoded)

        # If no jump/branch occurred, advance PC normally
        if not result.get("jumped"):
            self.cpu.state.program_counter += 1

        return {
            "status": "ok",
            "instruction": cell.instruction,
            "program_counter": self.cpu.state.program_counter,
            **result,
        }

    def _execute(self, decoded: dict) -> dict:
        opcode = decoded["opcode"]
        ops = decoded["operands"]

        if opcode == "HLT":
            self.cpu.state.is_halted = True
            return {"halted": True}

        if opcode == "NOP":
            return {}

        if opcode == "MOV":
            val = self._resolve_operand(ops[1])
            self._write_operand(ops[0], val)
            return {"moved": val}

        if opcode == "ADD":
            a = self._resolve_operand(ops[0])
            b = self._resolve_operand(ops[1])
            result = self.alu.add(a, b)
            self._write_operand(ops[0], result)
            return {"result": result}

        if opcode == "SUB":
            a = self._resolve_operand(ops[0])
            b = self._resolve_operand(ops[1])
            result = self.alu.sub(a, b)
            self._write_operand(ops[0], result)
            return {"result": result}

        if opcode == "MUL":
            a = self._resolve_operand(ops[0])
            b = self._resolve_operand(ops[1])
            result = self.alu.mul(a, b)
            self._write_operand(ops[0], result)
            return {"result": result}

        if opcode == "DIV":
            a = self._resolve_operand(ops[0])
            b = self._resolve_operand(ops[1])
            result = self.alu.div(a, b)
            self._write_operand(ops[0], result)
            return {"result": result}

        if opcode == "INC":
            a = self._resolve_operand(ops[0])
            self._write_operand(ops[0], self.alu.inc(a))
            return {}

        if opcode == "DEC":
            a = self._resolve_operand(ops[0])
            self._write_operand(ops[0], self.alu.dec(a))
            return {}

        if opcode == "LOAD":
            addr = self._resolve_memory_ref(ops[1])
            val = self.memory.read(addr)
            self._write_operand(ops[0], val or 0)
            return {"loaded": val}

        if opcode == "STORE":
            addr = self._resolve_memory_ref(ops[0])
            val = self._resolve_operand(ops[1])
            self.memory.write(addr, val)
            return {"stored": val}

        if opcode == "JMP":
            target = self._resolve_label(ops[0])
            if target is not None:
                self.cpu.state.program_counter = target
                return {"jumped": True}
            return {}

        return {}

    def _resolve_operand(self, op: str) -> int:
        op = op.strip()
        if op.upper() in self.cpu.register_manager._registers:
            return self.cpu.register_manager.read(op.upper())
        try:
            return int(op)
        except ValueError:
            return 0

    def _write_operand(self, op: str, value: int) -> None:
        op = op.strip().upper()
        if op in self.cpu.register_manager._registers:
            self.cpu.register_manager.write(op, value)

    def _resolve_memory_ref(self, op: str) -> int:
        """Resolves [label] or [address] to a numeric address."""
        op = op.strip()
        if op.startswith("[") and op.endswith("]"):
            inner = op[1:-1].strip()
            # If it's a label, look up the address from data memory
            for addr, cell in self.memory._memory.data_memory.items():
                if cell.label == inner:
                    return addr
            try:
                return int(inner, 16) if inner.endswith("H") else int(inner)
            except ValueError:
                return 0
        return 0

    def _resolve_label(self, label: str) -> int | None:
        return self._label_map.get(label)
