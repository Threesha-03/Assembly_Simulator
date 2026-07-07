/**
 * AddressGenerator.js
 *
 * Pure, side-effect-free address allocation logic.
 * Instructions start at 0x1000; data memory follows immediately after,
 * with each variable offset by its type's byte size.
 */

export const INSTRUCTION_MEMORY_BASE = 0x1000

export const TYPE_BYTE_SIZE = {
  BYTE: 1,
  WORD: 2,
  DWORD: 4,
  QWORD: 8,
}

export function byteSizeForType(type) {
  return TYPE_BYTE_SIZE[type] ?? 1
}

export function formatAddress(address) {
  return `${address.toString(16).toUpperCase().padStart(4, '0')}H`
}

export function allocateInstructionMemory(lines, base = INSTRUCTION_MEMORY_BASE) {
  const cells = lines.map((line, index) => ({
    address: base + index,
    label: line.label ?? '',
    instruction: line.text,
  }))
  return { cells, nextFreeAddress: base + lines.length }
}

export function allocateDataMemory(variables, base) {
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
  const dataResult = allocateDataMemory(variables, instructionResult.nextFreeAddress)
  return {
    instructionMemory: instructionResult.cells,
    dataMemory: dataResult.cells,
    totalBytesUsed: dataResult.nextFreeAddress - INSTRUCTION_MEMORY_BASE,
  }
}
