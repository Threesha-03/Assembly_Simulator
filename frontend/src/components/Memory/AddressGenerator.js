/**
 * AddressGenerator.js
 *
 * Pure, side-effect-free address allocation logic.
 * Data memory starts at 1000 (decimal); each variable is offset by its type's byte size.
 * Instruction memory starts at 4000 (decimal); each instruction occupies 8 bytes.
 */

export const DATA_MEMORY_BASE = 1000
export const INSTRUCTION_MEMORY_BASE = 4000
export const INSTRUCTION_BYTE_SIZE = 8

export const TYPE_BYTE_SIZE = {
  BYTE: 1,
  WORD: 4,
  DWORD: 4,
  QWORD: 8,
}

export function byteSizeForType(type) {
  return TYPE_BYTE_SIZE[type] ?? 1
}

/**
 * Formats an address as a plain decimal string.
 */
export function formatAddress(address) {
  return String(address)
}

export function allocateInstructionMemory(lines, base = INSTRUCTION_MEMORY_BASE) {
  const cells = lines.map((line, index) => ({
    address: base + index * INSTRUCTION_BYTE_SIZE,
    label: line.label ?? '',
    instruction: line.text,
  }))
  return { cells, nextFreeAddress: base + lines.length * INSTRUCTION_BYTE_SIZE }
}

export function allocateDataMemory(variables, base = DATA_MEMORY_BASE) {
  let cursor = base
  const cells = variables.map((variable) => {
    const cell = {
      address: cursor,
      label: variable.name,
      type: variable.type,
      value: variable.initialValue,
    }
    cursor += byteSizeForType(variable.type)
    return cell
  })
  return { cells, nextFreeAddress: cursor }
}

export function allocateProgramMemory(instructionLines, variables) {
  const instructionResult = allocateInstructionMemory(instructionLines)
  const dataResult = allocateDataMemory(variables)
  return {
    instructionMemory: instructionResult.cells,
    dataMemory: dataResult.cells,
    totalBytesUsed:
      (dataResult.nextFreeAddress - DATA_MEMORY_BASE) +
      (instructionResult.nextFreeAddress - INSTRUCTION_MEMORY_BASE),
  }
}
