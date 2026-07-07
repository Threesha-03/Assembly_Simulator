/**
 * memoryTypes.js — shared types for Memory components.
 */

export const DATA_TYPES = ['BYTE', 'WORD', 'DWORD', 'QWORD']
export const VIEW_MODES = ['decimal', 'hexadecimal', 'binary']
export const MEMORY_STATUSES = ['ready', 'executing', 'updating', 'completed']

export const MEMORY_WRITE_INSTRUCTIONS = ['STORE']

export const SUPPORTED_INSTRUCTIONS = [
  'LOAD',
  'STORE',
  'MOV',
  'ADD',
  'SUB',
  'MUL',
  'DIV',
  'INC',
  'DEC',
  'PUSH',
  'POP',
  'CALL',
  'RET',
  'JMP',
  'JE',
  'JNE',
  'JG',
  'JL',
  'NOP',
  'HLT',
]
