"""
execution_engine.py — Full instruction execution engine.
Mirrors the logic that was previously in frontend/src/components/CPU/cpuSlice.js.
Supports: MOV, LOAD, STORE, ADD, SUB, MUL, DIV, INC, DEC, JMP, JE, JNE, JG, JL, NOP, HLT
Registers: R0–R15 + accumulator (ACC)
"""

import re
import copy
from typing import Optional
from app.models.register import GENERAL_PURPOSE_REGISTERS


INSTRUCTION_MEMORY_BASE = 4000
INSTRUCTION_BYTE_SIZE = 8
DATA_MEMORY_BASE = 1000


def parse_address(s: str) -> Optional[int]:
    """Parse '1000H', '0x1000', or '1000' to int. Returns None on failure."""
    if not s:
        return None
    s = s.strip().upper()
    if s.endswith("H"):
        try:
            return int(s[:-1], 16)
        except ValueError:
            return None
    if s.startswith("0X"):
        try:
            return int(s[2:], 16)
        except ValueError:
            return None
    try:
        return int(s)
    except ValueError:
        return None


class ExecutionEngine:
    """
    Manages full CPU + memory state and executes assembly instructions step-by-step.
    State is held in-process (singleton via AppState).
    """

    def __init__(self):
        self._registers: dict[str, int] = {name: 0 for name in GENERAL_PURPOSE_REGISTERS}
        self._accumulator: int = 0
        self._program_counter: Optional[int] = None
        self._instruction_register: str = ""
        self._start_address: str = ""
        self._status: str = "idle"          # idle | running | completed
        self._history: list[dict] = []
        self._flags: dict[str, int] = {"cmp_left": 0, "cmp_right": 0, "cmp_done": 0}

        # Memory: address -> cell dict
        self._instruction_memory: dict[int, dict] = {}  # {address, label, instruction}
        self._data_memory: dict[int, dict] = {}          # {address, label, type, value}
        self._label_map: dict[str, int] = {}             # label -> instruction address
        self._initial_data_memory: dict[int, dict] = {}  # for reset

    # ── Memory loading ────────────────────────────────────────────────────────

    def load_program(self, instruction_lines: list[dict], variables: list[dict]) -> dict:
        """
        Allocate memory and build label map.
        instruction_lines: [{ text, label? }]
        variables:         [{ name, type, initialValue? or initial_value? }]
        """
        self._instruction_memory = {}
        self._data_memory = {}
        self._label_map = {}
        self._history = []
        self._status = "idle"
        self._program_counter = None
        self._instruction_register = ""

        # Instruction memory — base 4000, stride 8
        for i, line in enumerate(instruction_lines):
            addr = INSTRUCTION_MEMORY_BASE + i * INSTRUCTION_BYTE_SIZE
            label = line.get("label") or ""
            text = line.get("text", "")
            self._instruction_memory[addr] = {
                "address": addr,
                "label": label,
                "instruction": text,
            }
            if label:
                self._label_map[label] = addr

        # Data memory — base 1000
        TYPE_BYTE_SIZE = {"int": 4, "float": 4, "double": 8, "boolean": 1}
        cursor = DATA_MEMORY_BASE
        for var in variables:
            name = var.get("name", "")
            vtype = var.get("type", "int")
            # support both camelCase and snake_case
            initial = var.get("initialValue", var.get("initial_value", 0))
            self._data_memory[cursor] = {
                "address": cursor,
                "label": name,
                "type": vtype,
                "value": int(initial),
            }
            cursor += TYPE_BYTE_SIZE.get(vtype, 1)

        # Deep-copy for reset
        self._initial_data_memory = copy.deepcopy(self._data_memory)

        return self._build_state()

    # ── CPU controls ──────────────────────────────────────────────────────────

    def set_start_address(self, addr_str: str) -> None:
        self._start_address = addr_str

    def run(self, start_address: str) -> dict:
        """Load IR from start_address, set PC to next instruction."""
        self._start_address = start_address
        addr = parse_address(start_address)
        if addr is None:
            return {"error": "Invalid start address"}

        self._history = []
        cell = self._instruction_memory.get(addr)
        self._instruction_register = cell["instruction"] if cell else "—"
        self._program_counter = addr + INSTRUCTION_BYTE_SIZE
        self._status = "running"

        # Execute the first instruction immediately
        self._history.append(self._snapshot())
        self._apply_instruction(self._instruction_register)
        if not self._instruction_memory.get(self._program_counter):
            self._status = "completed"

        return self._build_state()

    def step(self) -> dict:
        """Execute instruction at current PC, advance PC."""
        if self._status == "completed":
            return self._build_state()

        pc = self._program_counter
        if pc is None:
            return {"error": "No program counter set. Call run first."}

        cell = self._instruction_memory.get(pc)
        if not cell:
            self._status = "completed"
            return self._build_state()

        self._instruction_register = cell["instruction"]
        self._history.append(self._snapshot())

        # Advance PC before execution (so jumps can override it)
        self._program_counter = pc + INSTRUCTION_BYTE_SIZE
        self._apply_instruction(self._instruction_register)

        # Check if next instruction exists
        if self._status != "completed" and not self._instruction_memory.get(self._program_counter):
            self._status = "completed"

        return self._build_state()

    def previous(self) -> dict:
        """Restore previous CPU + memory snapshot."""
        if not self._history:
            return self._build_state()
        snap = self._history.pop()
        self._registers = dict(snap["registers"])
        self._accumulator = snap["accumulator"]
        self._program_counter = snap["program_counter"]
        self._instruction_register = snap["instruction_register"]
        self._status = snap["status"]
        self._flags = dict(snap.get("flags", {"cmp_left": 0, "cmp_right": 0, "cmp_done": 0}))
        self._data_memory = copy.deepcopy(snap["data_memory"])
        return self._build_state()

    def reset(self) -> dict:
        """Full reset — registers, accumulator, PC, memory back to initial."""
        self._registers = {name: 0 for name in GENERAL_PURPOSE_REGISTERS}
        self._accumulator = 0
        self._program_counter = None
        self._instruction_register = ""
        self._start_address = ""
        self._status = "idle"
        self._history = []
        self._flags = {"cmp_left": 0, "cmp_right": 0, "cmp_done": 0}
        self._data_memory = copy.deepcopy(self._initial_data_memory)
        return self._build_state()

    # ── Instruction execution ─────────────────────────────────────────────────

    def _apply_instruction(self, ir: str) -> None:
        """Parse and execute one instruction string."""
        if not ir or ir in ("—", "(end)"):
            return

        # Strip label prefix: "loop: ADD R1, 1" → "ADD R1, 1"
        text = re.sub(r"^\s*[A-Za-z_]\w*\s*:\s*", "", ir).strip()
        tokens = re.sub(r"[.,\[\]]", " ", text).strip().split()
        if not tokens:
            return
        op = tokens[0].upper()

        def get_val(tok: str) -> int:
            if not tok:
                return 0
            t = tok.upper()
            if re.match(r"^R\d+$", t):
                return self._registers.get(t, 0)
            if t == "ACC":
                return self._accumulator
            try:
                return int(tok)
            except ValueError:
                return 0

        def set_dest(dest: str, val: int) -> None:
            d = dest.upper()
            if d == "ACC":
                self._accumulator = val
            elif re.match(r"^R\d+$", d):
                self._registers[d] = val

        def find_data_by_label(label: str) -> Optional[dict]:
            for cell in self._data_memory.values():
                if cell["label"].lower() == label.lower():
                    return cell
            return None

        def find_instr_addr_by_label(label: str) -> Optional[int]:
            return self._label_map.get(label)

        if op == "HLT":
            self._status = "completed"
            return

        if op == "NOP":
            return

        if op == "MOV":
            if len(tokens) >= 3:
                set_dest(tokens[1], get_val(tokens[2]))
            return

        if op == "LOAD":
            # LOAD Rx, [label]  or  LOAD Rx, label
            if len(tokens) >= 3:
                cell = find_data_by_label(tokens[2])
                val = cell["value"] if cell else 0
                set_dest(tokens[1], val)
            return

        if op == "STORE":
            # STORE [label], Rx|ACC
            if len(tokens) >= 3:
                cell = find_data_by_label(tokens[1])
                if cell:
                    cell["value"] = get_val(tokens[2])
            return

        if op == "ADD":
            if len(tokens) >= 3:
                result = get_val(tokens[1]) + get_val(tokens[2])
                set_dest(tokens[1], result)
            return

        if op == "SUB":
            if len(tokens) >= 3:
                result = get_val(tokens[1]) - get_val(tokens[2])
                set_dest(tokens[1], result)
            return

        if op == "MUL":
            if len(tokens) >= 3:
                result = get_val(tokens[1]) * get_val(tokens[2])
                set_dest(tokens[1], result)
            return

        if op == "DIV":
            if len(tokens) >= 3:
                divisor = get_val(tokens[2])
                result = get_val(tokens[1]) // divisor if divisor != 0 else 0
                set_dest(tokens[1], result)
            return

        if op == "INC":
            if len(tokens) >= 2:
                set_dest(tokens[1], get_val(tokens[1]) + 1)
            return

        if op == "DEC":
            if len(tokens) >= 2:
                set_dest(tokens[1], get_val(tokens[1]) - 1)
            return

        if op == "CMP":
            # CMP Ra, Rb — sets flags for subsequent JE/JNE/JG/JL
            if len(tokens) >= 3:
                self._flags["cmp_left"] = get_val(tokens[1])
                self._flags["cmp_right"] = get_val(tokens[2])
                self._flags["cmp_done"] = 1
            return

        if op == "JMP":
            if len(tokens) >= 2:
                addr = find_instr_addr_by_label(tokens[1])
                if addr is not None:
                    self._program_counter = addr
            return

        if op in ("JE", "JNE", "JG", "JL"):
            # If preceded by CMP, use flags; otherwise use inline operands
            if self._flags.get("cmp_done") and len(tokens) == 2:
                # Form: JG label  (uses CMP flags)
                left  = self._flags["cmp_left"]
                right = self._flags["cmp_right"]
                target = tokens[1]
                self._flags["cmp_done"] = 0  # consume the flag
            elif len(tokens) >= 3:
                # Form: JG R1, R2, label  or  JG R1, label
                left = get_val(tokens[1])
                if len(tokens) >= 4:
                    right  = get_val(tokens[2])
                    target = tokens[3]
                else:
                    right  = 0
                    target = tokens[2]
            else:
                return

            addr = find_instr_addr_by_label(target)
            if addr is None:
                return
            should_jump = False
            if op == "JE":  should_jump = left == right
            if op == "JNE": should_jump = left != right
            if op == "JG":  should_jump = left > right
            if op == "JL":  should_jump = left < right
            if should_jump:
                self._program_counter = addr
            return

    # ── Helpers ───────────────────────────────────────────────────────────────

    def _snapshot(self) -> dict:
        return {
            "registers": dict(self._registers),
            "accumulator": self._accumulator,
            "program_counter": self._program_counter,
            "instruction_register": self._instruction_register,
            "status": self._status,
            "flags": dict(self._flags),
            "data_memory": copy.deepcopy(self._data_memory),
        }

    def _build_state(self) -> dict:
        """Return the full serialisable state sent to the frontend."""
        return {
            "registers": [{"name": k, "value": v} for k, v in self._registers.items()],
            "accumulator": self._accumulator,
            "program_counter": self._program_counter,
            "instruction_register": self._instruction_register,
            "start_address": self._start_address,
            "status": self._status,
            "can_go_back": len(self._history) > 0,
            "instruction_memory": list(self._instruction_memory.values()),
            "data_memory": list(self._data_memory.values()),
        }

    def get_state(self) -> dict:
        return self._build_state()

    def is_loaded(self) -> bool:
        return bool(self._instruction_memory)
