"""
alu.py — Arithmetic Logic Unit for basic arithmetic operations.
"""


class ALU:
    """Performs arithmetic and logical operations."""

    @staticmethod
    def add(a: int, b: int) -> int:
        return a + b

    @staticmethod
    def sub(a: int, b: int) -> int:
        return a - b

    @staticmethod
    def mul(a: int, b: int) -> int:
        return a * b

    @staticmethod
    def div(a: int, b: int) -> int:
        if b == 0:
            raise ZeroDivisionError("Division by zero in ALU")
        return a // b

    @staticmethod
    def inc(a: int) -> int:
        return a + 1

    @staticmethod
    def dec(a: int) -> int:
        return a - 1
