---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/set.ts#L1-L42
title: assembly/instructions/set.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-24T09:46:09+02:00'
last_modified: '2026-04-24T09:46:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: d44dbe144070d4d43a4af2593e6482932af3bd990239ee291d6250a50b461a7e
language: typescript
---
`assembly/instructions/set.ts` (lines 1–42)

```typescript
import { InstructionRun, OutcomeData } from "./outcome";
import { Inst } from "./utils";

// SET_LT_U_IMM
export const set_lt_u_imm: InstructionRun = (r, args, registers) => {
  const cond = registers[Inst.reg(args.a)] < u64(Inst.u32SignExtend(args.c));
  registers[Inst.reg(args.b)] = cond ? u64(1) : u64(0);
  return OutcomeData.ok(r);
};

// SET_LT_S_IMM
export const set_lt_s_imm: InstructionRun = (r, args, registers) => {
  const cond = i64(registers[Inst.reg(args.a)]) < i64(Inst.u32SignExtend(args.c));
  registers[Inst.reg(args.b)] = cond ? u64(1) : u64(0);
  return OutcomeData.ok(r);
};

// SET_GT_U_IMM
export const set_gt_u_imm: InstructionRun = (r, args, registers) => {
  const cond = registers[Inst.reg(args.a)] > u64(Inst.u32SignExtend(args.c));
  registers[Inst.reg(args.b)] = cond ? u64(1) : u64(0);
  return OutcomeData.ok(r);
};

// SET_GT_S_IMM
export const set_gt_s_imm: InstructionRun = (r, args, registers) => {
  const cond = i64(registers[Inst.reg(args.a)]) > i64(Inst.u32SignExtend(args.c));
  registers[Inst.reg(args.b)] = cond ? u64(1) : u64(0);
  return OutcomeData.ok(r);
};

// SET_LT_U
export const set_lt_u: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.c)] = registers[Inst.reg(args.b)] < registers[Inst.reg(args.a)] ? u64(1) : u64(0);
  return OutcomeData.ok(r);
};

// SET_LT_S
export const set_lt_s: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.c)] = i64(registers[Inst.reg(args.b)]) < i64(registers[Inst.reg(args.a)]) ? u64(1) : u64(0);
  return OutcomeData.ok(r);
};
```
