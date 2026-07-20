import unittest

from app.models.variable import TYPE_BYTE_SIZE
from app.schemas.data_schema import VariableCreate


class DataTypeCompatibilityTests(unittest.TestCase):
    def test_frontend_data_types_are_supported(self):
        self.assertEqual(TYPE_BYTE_SIZE["int"], 4)
        self.assertEqual(TYPE_BYTE_SIZE["float"], 4)
        self.assertEqual(TYPE_BYTE_SIZE["double"], 8)
        self.assertEqual(TYPE_BYTE_SIZE["boolean"], 1)

    def test_variable_create_accepts_frontend_data_types(self):
        for value in ["int", "float", "double", "boolean"]:
            with self.subTest(value=value):
                variable = VariableCreate(name="x", type=value)
                self.assertEqual(variable.type, value)


if __name__ == "__main__":
    unittest.main()
