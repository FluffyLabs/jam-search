---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/mov.ts#L1-L40
title: assembly/instructions/mov.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-22T10:07:05+01:00'
last_modified: '2026-04-22T10:07:05+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 13b3a5d47d0150c131f2050dac80cca7845e6ddea956dfcfe1da044efb5bd7ab
language: typescript
---
`assembly/instructions/mov.ts` (lines 1–40)

```typescript
import { InstructionRun, OutcomeData } from "./outcome";
import { Inst } from "./utils";

// MOVE_REG
export const move_reg: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.b)] = registers[Inst.reg(args.a)];
  return OutcomeData.ok(r);
};

// CMOV_IZ_IMM
export const cmov_iz_imm: InstructionRun = (r, args, registers) => {
  if (registers[Inst.reg(args.a)] === u64(0)) {
    registers[Inst.reg(args.b)] = Inst.u32SignExtend(args.c);
  }
  return OutcomeData.ok(r);
};

// CMOV_NZ_IMM
export const cmov_nz_imm: InstructionRun = (r, args, registers) => {
  if (registers[Inst.reg(args.a)] !== u64(0)) {
    registers[Inst.reg(args.b)] = Inst.u32SignExtend(args.c);
  }
  return OutcomeData.ok(r);
};

// CMOV_IZ
export const cmov_iz: InstructionRun = (r, args, registers) => {
  if (registers[Inst.reg(args.a)] === u64(0)) {
    registers[Inst.reg(args.c)] = registers[Inst.reg(args.b)];
  }
  return OutcomeData.ok(r);
};

// CMOV_NZ
export const cmov_nz: InstructionRun = (r, args, registers) => {
  if (registers[Inst.reg(args.a)] !== u64(0)) {
    registers[Inst.reg(args.c)] = registers[Inst.reg(args.b)];
  }
  return OutcomeData.ok(r);
};
```
