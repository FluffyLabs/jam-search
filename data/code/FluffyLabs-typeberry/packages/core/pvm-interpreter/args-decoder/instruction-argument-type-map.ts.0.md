---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/instruction-argument-type-map.ts#L1-L52
title: packages/core/pvm-interpreter/args-decoder/instruction-argument-type-map.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 4
content_sha: f0f97ec037f77ae6fb1d100567a80938b65a0554537eaa1b71c71a19425f24f3
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/instruction-argument-type-map.ts` (lines 1–52)

```typescript
import { HIGHEST_INSTRUCTION_NUMBER, Instruction } from "../instruction.js";
import { ArgumentType } from "./argument-type.js";

export const instructionArgumentTypeMap = (() => {
  const instructionArgumentTypeMap = new Array<ArgumentType>(HIGHEST_INSTRUCTION_NUMBER + 1);

  instructionArgumentTypeMap[Instruction.TRAP] = ArgumentType.NO_ARGUMENTS;
  instructionArgumentTypeMap[Instruction.FALLTHROUGH] = ArgumentType.NO_ARGUMENTS;

  instructionArgumentTypeMap[Instruction.ECALLI] = ArgumentType.ONE_IMMEDIATE;

  instructionArgumentTypeMap[Instruction.LOAD_IMM_64] = ArgumentType.ONE_REGISTER_ONE_EXTENDED_WIDTH_IMMEDIATE;

  instructionArgumentTypeMap[Instruction.STORE_IMM_U8] = ArgumentType.TWO_IMMEDIATES;
  instructionArgumentTypeMap[Instruction.STORE_IMM_U16] = ArgumentType.TWO_IMMEDIATES;
  instructionArgumentTypeMap[Instruction.STORE_IMM_U32] = ArgumentType.TWO_IMMEDIATES;
  instructionArgumentTypeMap[Instruction.STORE_IMM_U64] = ArgumentType.TWO_IMMEDIATES;

  instructionArgumentTypeMap[Instruction.JUMP] = ArgumentType.ONE_OFFSET;

  instructionArgumentTypeMap[Instruction.JUMP_IND] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.LOAD_IMM] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.LOAD_U8] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.LOAD_I8] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.LOAD_U16] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.LOAD_I16] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.LOAD_U32] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.LOAD_I32] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.LOAD_U64] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.STORE_U8] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.STORE_U16] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.STORE_U32] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE;
  instructionArgumentTypeMap[Instruction.STORE_U64] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE;

  instructionArgumentTypeMap[Instruction.STORE_IMM_IND_U8] = ArgumentType.ONE_REGISTER_TWO_IMMEDIATES;
  instructionArgumentTypeMap[Instruction.STORE_IMM_IND_U16] = ArgumentType.ONE_REGISTER_TWO_IMMEDIATES;
  instructionArgumentTypeMap[Instruction.STORE_IMM_IND_U32] = ArgumentType.ONE_REGISTER_TWO_IMMEDIATES;
  instructionArgumentTypeMap[Instruction.STORE_IMM_IND_U64] = ArgumentType.ONE_REGISTER_TWO_IMMEDIATES;

  instructionArgumentTypeMap[Instruction.LOAD_IMM_JUMP] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET;
  instructionArgumentTypeMap[Instruction.BRANCH_EQ_IMM] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET;
  instructionArgumentTypeMap[Instruction.BRANCH_NE_IMM] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET;
  instructionArgumentTypeMap[Instruction.BRANCH_LT_U_IMM] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET;
  instructionArgumentTypeMap[Instruction.BRANCH_LE_U_IMM] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET;
  instructionArgumentTypeMap[Instruction.BRANCH_GE_U_IMM] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET;
  instructionArgumentTypeMap[Instruction.BRANCH_GT_U_IMM] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET;
  instructionArgumentTypeMap[Instruction.BRANCH_LT_S_IMM] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET;
  instructionArgumentTypeMap[Instruction.BRANCH_LE_S_IMM] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET;
  instructionArgumentTypeMap[Instruction.BRANCH_GE_S_IMM] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET;
  instructionArgumentTypeMap[Instruction.BRANCH_GT_S_IMM] = ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET;

  instructionArgumentTypeMap[Instruction.MOVE_REG] = ArgumentType.TWO_REGISTERS;
```
