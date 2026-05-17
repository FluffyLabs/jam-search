---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/instruction-argument-type-map.ts#L49-L91
title: packages/core/pvm-interpreter/args-decoder/instruction-argument-type-map.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 4
content_sha: 70d24c08112f0b4eac6c9858c1e2b29e6bb56a0e3c4f43dcdfd7f99e1ffafb79
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/instruction-argument-type-map.ts` (lines 49–91)

```typescript
  instructionArgumentTypeMap[Instruction.BRANCH_GE_S_IMM] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET;
  instructionArgumentTypeMap[Instruction.BRANCH_GT_S_IMM] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET;

  instructionArgumentTypeMap[Instruction.MOVE_REG] = ArgumentType.TWO_REGISTERS;
  instructionArgumentTypeMap[Instruction.SBRK] = ArgumentType.TWO_REGISTERS;
  instructionArgumentTypeMap[Instruction.COUNT_SET_BITS_64] = ArgumentType.TWO_REGISTERS;
  instructionArgumentTypeMap[Instruction.COUNT_SET_BITS_32] = ArgumentType.TWO_REGISTERS;
  instructionArgumentTypeMap[Instruction.LEADING_ZERO_BITS_64] = ArgumentType.TWO_REGISTERS;
  instructionArgumentTypeMap[Instruction.LEADING_ZERO_BITS_32] = ArgumentType.TWO_REGISTERS;
  instructionArgumentTypeMap[Instruction.TRAILING_ZERO_BITS_64] = ArgumentType.TWO_REGISTERS;
  instructionArgumentTypeMap[Instruction.TRAILING_ZERO_BITS_32] = ArgumentType.TWO_REGISTERS;
  instructionArgumentTypeMap[Instruction.SIGN_EXTEND_8] = ArgumentType.TWO_REGISTERS;
  instructionArgumentTypeMap[Instruction.SIGN_EXTEND_16] = ArgumentType.TWO_REGISTERS;
  instructionArgumentTypeMap[Instruction.ZERO_EXTEND_16] = ArgumentType.TWO_REGISTERS;
  instructionArgumentTypeMap[Instruction.REVERSE_BYTES] = ArgumentType.TWO_REGISTERS;

  instructionArgumentTypeMap[Instruction.STORE_IND_U8] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.STORE_IND_U16] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.STORE_IND_U32] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.STORE_IND_U64] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.LOAD_IND_U8] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.LOAD_IND_I8] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.LOAD_IND_U16] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.LOAD_IND_I16] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.LOAD_IND_U32] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.LOAD_IND_I32] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.LOAD_IND_U64] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.ADD_IMM_32] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.ADD_IMM_64] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.AND_IMM] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.XOR_IMM] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.OR_IMM] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.MUL_IMM_32] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.MUL_IMM_64] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.SET_LT_U_IMM] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.SET_LT_S_IMM] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.SHLO_L_IMM_32] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.SHLO_R_IMM_32] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.SHAR_R_IMM_32] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.NEG_ADD_IMM_32] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.SHLO_L_IMM_64] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.SHLO_R_IMM_64] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.SHAR_R_IMM_64] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
```
