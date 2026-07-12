---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/instruction-argument-type-map.ts#L90-L135
title: packages/core/pvm-interpreter/args-decoder/instruction-argument-type-map.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 2
chunk_total: 4
content_sha: d86b7df93ea1ba176e6bd7bc2be69f0c9943ebd37596af5b6fcabb38140893d8
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/instruction-argument-type-map.ts` (lines 90–135)

```typescript
  instructionArgumentTypeMap[Instruction.SHLO_R_IMM_64] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.SHAR_R_IMM_64] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.NEG_ADD_IMM_64] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.SET_GT_U_IMM] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.SET_GT_S_IMM] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.SHLO_L_IMM_ALT_32] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.SHLO_R_IMM_ALT_32] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.SHAR_R_IMM_ALT_32] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.SHLO_L_IMM_ALT_64] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.SHLO_R_IMM_ALT_64] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.SHAR_R_IMM_ALT_64] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.CMOV_IZ_IMM] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.CMOV_NZ_IMM] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.ROT_R_64_IMM] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.ROT_R_64_IMM_ALT] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.ROT_R_32_IMM] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.ROT_R_32_IMM_ALT] = ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE;

  instructionArgumentTypeMap[Instruction.BRANCH_EQ] = ArgumentType.TWO_REGISTERS_ONE_OFFSET;
  instructionArgumentTypeMap[Instruction.BRANCH_NE] = ArgumentType.TWO_REGISTERS_ONE_OFFSET;
  instructionArgumentTypeMap[Instruction.BRANCH_LT_U] = ArgumentType.TWO_REGISTERS_ONE_OFFSET;
  instructionArgumentTypeMap[Instruction.BRANCH_LT_S] = ArgumentType.TWO_REGISTERS_ONE_OFFSET;
  instructionArgumentTypeMap[Instruction.BRANCH_GE_U] = ArgumentType.TWO_REGISTERS_ONE_OFFSET;
  instructionArgumentTypeMap[Instruction.BRANCH_GE_S] = ArgumentType.TWO_REGISTERS_ONE_OFFSET;

  instructionArgumentTypeMap[Instruction.LOAD_IMM_JUMP_IND] = ArgumentType.TWO_REGISTERS_TWO_IMMEDIATES;

  instructionArgumentTypeMap[Instruction.ADD_32] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.ADD_64] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.SUB_32] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.SUB_64] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.AND] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.XOR] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.OR] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.MUL_32] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.MUL_64] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.MUL_UPPER_S_S] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.MUL_UPPER_U_U] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.MUL_UPPER_S_U] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.DIV_U_32] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.DIV_S_32] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.REM_U_32] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.REM_S_32] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.DIV_U_64] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.DIV_S_64] = ArgumentType.THREE_REGISTERS;
  instructionArgumentTypeMap[Instruction.REM_U_64] = ArgumentType.THREE_REGISTERS;
```
