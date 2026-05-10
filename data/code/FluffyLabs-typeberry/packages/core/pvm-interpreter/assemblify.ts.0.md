---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/assemblify.ts#L1-L123
title: packages/core/pvm-interpreter/assemblify.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 2
content_sha: ae369e11d15ea3030c615637966b5ae0e2bad8857ec7095ea49e02f470bd912c
language: typescript
---
`packages/core/pvm-interpreter/assemblify.ts` (lines 1–123)

```typescript
import { type SmallGas, tryAsSmallGas } from "@typeberry/pvm-interface";
import { Instruction } from "./instruction.js";
import type { Mask } from "./program-decoder/mask.js";

type Byte = number;
type Gas = number;
type InstructionTuple = [Byte, Gas];

const instructionsWithoutArgs: InstructionTuple[] = [
  [Instruction.TRAP, 1],
  [Instruction.FALLTHROUGH, 1],
];

const instructionsWithOneImmediate: InstructionTuple[] = [[Instruction.ECALLI, 1]];

const instructionsWithOneRegisterAndOneExtendedWidthImmediate: InstructionTuple[] = [[Instruction.LOAD_IMM_64, 1]];

const instructionsWithTwoImmediates: InstructionTuple[] = [
  [Instruction.STORE_IMM_U8, 1],
  [Instruction.STORE_IMM_U16, 1],
  [Instruction.STORE_IMM_U32, 1],
  [Instruction.STORE_IMM_U64, 1],
];

const instructionsWithOneOffset: InstructionTuple[] = [[Instruction.JUMP, 1]];

const instructionsWithOneRegisterAndOneImmediate: InstructionTuple[] = [
  [Instruction.JUMP_IND, 1],
  [Instruction.LOAD_IMM, 1],
  [Instruction.LOAD_U8, 1],
  [Instruction.LOAD_I8, 1],
  [Instruction.LOAD_U16, 1],
  [Instruction.LOAD_I16, 1],
  [Instruction.LOAD_U32, 1],
  [Instruction.LOAD_I32, 1],
  [Instruction.LOAD_U64, 1],
  [Instruction.STORE_U8, 1],
  [Instruction.STORE_U16, 1],
  [Instruction.STORE_U32, 1],
  [Instruction.STORE_U64, 1],
];

const instructionsWithOneRegisterAndTwoImmediate: InstructionTuple[] = [
  [Instruction.STORE_IMM_IND_U8, 1],
  [Instruction.STORE_IMM_IND_U16, 1],
  [Instruction.STORE_IMM_IND_U32, 1],
  [Instruction.STORE_IMM_IND_U64, 1],
];

const instructionsWithOneRegisterOneImmediateAndOneOffset: InstructionTuple[] = [
  [Instruction.LOAD_IMM_JUMP, 1],
  [Instruction.BRANCH_EQ_IMM, 1],
  [Instruction.BRANCH_NE_IMM, 1],
  [Instruction.BRANCH_LT_U_IMM, 1],
  [Instruction.BRANCH_LE_U_IMM, 1],
  [Instruction.BRANCH_GE_U_IMM, 1],
  [Instruction.BRANCH_GT_U_IMM, 1],
  [Instruction.BRANCH_LT_S_IMM, 1],
  [Instruction.BRANCH_LE_S_IMM, 1],
  [Instruction.BRANCH_GE_S_IMM, 1],
  [Instruction.BRANCH_GT_S_IMM, 1],
];

const instructionsWithTwoRegisters: InstructionTuple[] = [
  [Instruction.MOVE_REG, 1],
  [Instruction.SBRK, 1],
  [Instruction.COUNT_SET_BITS_64, 1],
  [Instruction.COUNT_SET_BITS_32, 1],
  [Instruction.LEADING_ZERO_BITS_64, 1],
  [Instruction.LEADING_ZERO_BITS_32, 1],
  [Instruction.TRAILING_ZERO_BITS_64, 1],
  [Instruction.TRAILING_ZERO_BITS_32, 1],
  [Instruction.SIGN_EXTEND_8, 1],
  [Instruction.SIGN_EXTEND_16, 1],
  [Instruction.ZERO_EXTEND_16, 1],
  [Instruction.REVERSE_BYTES, 1],
];

const instructionsWithTwoRegistersAndOneImmediate: InstructionTuple[] = [
  [Instruction.STORE_IND_U8, 1],
  [Instruction.STORE_IND_U16, 1],
  [Instruction.STORE_IND_U32, 1],
  [Instruction.STORE_IND_U64, 1],
  [Instruction.LOAD_IND_U8, 1],
  [Instruction.LOAD_IND_I8, 1],
  [Instruction.LOAD_IND_U16, 1],
  [Instruction.LOAD_IND_I16, 1],
  [Instruction.LOAD_IND_U32, 1],
  [Instruction.LOAD_IND_I32, 1],
  [Instruction.LOAD_IND_U64, 1],
  [Instruction.ADD_IMM_32, 1],
  [Instruction.AND_IMM, 1],
  [Instruction.XOR_IMM, 1],
  [Instruction.OR_IMM, 1],
  [Instruction.MUL_IMM_32, 1],
  [Instruction.SET_LT_U_IMM, 1],
  [Instruction.SET_LT_S_IMM, 1],
  [Instruction.SHLO_L_IMM_32, 1],
  [Instruction.SHLO_R_IMM_32, 1],
  [Instruction.SHAR_R_IMM_32, 1],
  [Instruction.NEG_ADD_IMM_32, 1],
  [Instruction.SET_GT_U_IMM, 1],
  [Instruction.SET_GT_S_IMM, 1],
  [Instruction.SHLO_L_IMM_ALT_32, 1],
  [Instruction.SHLO_R_IMM_ALT_32, 1],
  [Instruction.SHAR_R_IMM_ALT_32, 1],
  [Instruction.CMOV_IZ_IMM, 1],
  [Instruction.CMOV_NZ_IMM, 1],
  [Instruction.ADD_IMM_64, 1],
  [Instruction.MUL_IMM_64, 1],
  [Instruction.SHLO_L_IMM_64, 1],
  [Instruction.SHLO_R_IMM_64, 1],
  [Instruction.SHAR_R_IMM_64, 1],
  [Instruction.NEG_ADD_IMM_64, 1],
  [Instruction.SHLO_L_IMM_ALT_64, 1],
  [Instruction.SHLO_R_IMM_ALT_64, 1],
  [Instruction.SHAR_R_IMM_ALT_64, 1],
  [Instruction.ROT_R_64_IMM, 1],
  [Instruction.ROT_R_64_IMM_ALT, 1],
  [Instruction.ROT_R_32_IMM, 1],
  [Instruction.ROT_R_32_IMM_ALT, 1],
];

```
