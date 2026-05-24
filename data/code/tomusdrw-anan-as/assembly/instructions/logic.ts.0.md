---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/logic.ts#L1-L56
title: assembly/instructions/logic.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-20T20:20:54Z'
last_modified: '2026-05-20T20:20:54Z'
chunk_index: 0
chunk_total: 1
content_sha: 7993b84900cdff6c070d90e9e990310ed01a65a3479d34098bb24245ff9b8683
language: typescript
---
`assembly/instructions/logic.ts` (lines 1–56)

```typescript
import { InstructionRun, OutcomeData } from "./outcome";
import { Inst } from "./utils";

// AND_IMM
export const and_imm: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.b)] = registers[Inst.reg(args.a)] & Inst.u32SignExtend(args.c);
  return OutcomeData.ok(r);
};

// XOR_IMM
export const xor_imm: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.b)] = registers[Inst.reg(args.a)] ^ Inst.u32SignExtend(args.c);
  return OutcomeData.ok(r);
};

// OR_IMM
export const or_imm: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.b)] = registers[Inst.reg(args.a)] | Inst.u32SignExtend(args.c);
  return OutcomeData.ok(r);
};

// AND
export const and: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.c)] = registers[Inst.reg(args.b)] & registers[Inst.reg(args.a)];
  return OutcomeData.ok(r);
};

// XOR
export const xor: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.c)] = registers[Inst.reg(args.b)] ^ registers[Inst.reg(args.a)];
  return OutcomeData.ok(r);
};

// OR
export const or: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.c)] = registers[Inst.reg(args.b)] | registers[Inst.reg(args.a)];
  return OutcomeData.ok(r);
};

// AND_INV
export const and_inv: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.c)] = registers[Inst.reg(args.b)] & ~registers[Inst.reg(args.a)];
  return OutcomeData.ok(r);
};

// OR_INV
export const or_inv: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.c)] = u64(registers[Inst.reg(args.b)] | ~registers[Inst.reg(args.a)]);
  return OutcomeData.ok(r);
};

// XNOR
export const xnor: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.c)] = u64(~(registers[Inst.reg(args.b)] ^ registers[Inst.reg(args.a)]));
  return OutcomeData.ok(r);
};
```
