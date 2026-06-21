---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions.ts#L1-L116'
title: assembly/instructions.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-15T09:40:01+02:00'
last_modified: '2026-06-15T09:40:01+02:00'
chunk_index: 0
chunk_total: 4
content_sha: 3437eeb6ec7cbb8e5e5ca7f44a5f30988df4e698fb221e79220b6b8f65f54c11
language: typescript
---
`assembly/instructions.ts` (lines 1–116)

```typescript
import { Arguments } from "./arguments";
import { Gas } from "./gas";

export class Instruction {
  name: string = "";
  kind: Arguments = Arguments.Zero;
  gas: u32 = u32(0);
  isTerminating: boolean = false;
}

function instruction(name: string, kind: Arguments, gas: Gas, isTerminating: boolean = false): Instruction {
  const i = new Instruction();
  i.name = name;
  i.kind = kind;
  i.gas = u32(gas);
  i.isTerminating = isTerminating;
  return i;
}

export const MISSING_INSTRUCTION = instruction("INVALID", Arguments.Zero, 1, false);

export const SBRK = instruction("SBRK", Arguments.TwoReg, 1);

export const INSTRUCTIONS: StaticArray<Instruction> = StaticArray.fromArray<Instruction>([
  /* 000 */ instruction("TRAP", Arguments.Zero, 1, true),
  /* 001 */ instruction("FALLTHROUGH", Arguments.Zero, 1, true),
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,

  /* 010 */ instruction("ECALLI", Arguments.OneImm, 1),
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,

  /* 020 */ instruction("LOAD_IMM_64", Arguments.OneRegOneExtImm, 1),
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,

  /* 030 */ instruction("STORE_IMM_U8", Arguments.TwoImm, 1),
  /* 031 */ instruction("STORE_IMM_U16", Arguments.TwoImm, 1),
  /* 032 */ instruction("STORE_IMM_U32", Arguments.TwoImm, 1),
  /* 033 */ instruction("STORE_IMM_U64", Arguments.TwoImm, 1),
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,

  /* 040 */ instruction("JUMP", Arguments.OneOff, 1, true),
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,

  /* 050 */ instruction("JUMP_IND", Arguments.OneRegOneImm, 1, true),
  /* 051 */ instruction("LOAD_IMM", Arguments.OneRegOneImm, 1),
  /* 052 */ instruction("LOAD_U8", Arguments.OneRegOneImm, 1),
  /* 053 */ instruction("LOAD_I8", Arguments.OneRegOneImm, 1),
  /* 054 */ instruction("LOAD_U16", Arguments.OneRegOneImm, 1),
  /* 055 */ instruction("LOAD_I16", Arguments.OneRegOneImm, 1),
  /* 056 */ instruction("LOAD_U32", Arguments.OneRegOneImm, 1),
  /* 057 */ instruction("LOAD_I32", Arguments.OneRegOneImm, 1),
  /* 058 */ instruction("LOAD_U64", Arguments.OneRegOneImm, 1),
  /* 059 */ instruction("STORE_U8", Arguments.OneRegOneImm, 1),

  /* 060 */ instruction("STORE_U16", Arguments.OneRegOneImm, 1),
  /* 061 */ instruction("STORE_U32", Arguments.OneRegOneImm, 1),
  /* 062 */ instruction("STORE_U64", Arguments.OneRegOneImm, 1),
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,

  /* 070 */ instruction("STORE_IMM_IND_U8", Arguments.OneRegTwoImm, 1),
  /* 071 */ instruction("STORE_IMM_IND_U16", Arguments.OneRegTwoImm, 1),
  /* 072 */ instruction("STORE_IMM_IND_U32", Arguments.OneRegTwoImm, 1),
  /* 073 */ instruction("STORE_IMM_IND_U64", Arguments.OneRegTwoImm, 1),
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,
  MISSING_INSTRUCTION,

  /* 080 */ instruction("LOAD_IMM_JUMP", Arguments.OneRegOneImmOneOff, 1, true),
  /* 081 */ instruction("BRANCH_EQ_IMM", Arguments.OneRegOneImmOneOff, 1, true),
  /* 082 */ instruction("BRANCH_NE_IMM", Arguments.OneRegOneImmOneOff, 1, true),
  /* 083 */ instruction("BRANCH_LT_U_IMM", Arguments.OneRegOneImmOneOff, 1, true),
```
