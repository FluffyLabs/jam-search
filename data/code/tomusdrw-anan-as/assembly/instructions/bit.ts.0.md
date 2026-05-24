---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/bit.ts#L1-L63
title: assembly/instructions/bit.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-20T20:20:54Z'
last_modified: '2026-05-20T20:20:54Z'
chunk_index: 0
chunk_total: 1
content_sha: d23ccae6ec9dae39653dba41346e5194128630a8f82795844bd637a8a55d8570
language: typescript
---
`assembly/instructions/bit.ts` (lines 1–63)

```typescript
import { portable } from "../portable";
import { InstructionRun, OutcomeData } from "./outcome";
import { Inst } from "./utils";

// COUNT_SET_BITS_64
export const count_set_bits_64: InstructionRun = (r, args, regs) => {
  regs[Inst.reg(args.b)] = portable.popcnt_u64(regs[Inst.reg(args.a)]);
  return OutcomeData.ok(r);
};

// COUNT_SET_BITS_32
export const count_set_bits_32: InstructionRun = (r, args, regs) => {
  regs[Inst.reg(args.b)] = u64(portable.popcnt_u32(u32(regs[Inst.reg(args.a)])));
  return OutcomeData.ok(r);
};

// LEADING_ZERO_BITS_64
export const leading_zero_bits_64: InstructionRun = (r, args, regs) => {
  regs[Inst.reg(args.b)] = portable.clz_u64(regs[Inst.reg(args.a)]);
  return OutcomeData.ok(r);
};

// LEADING_ZERO_BITS_32
export const leading_zero_bits_32: InstructionRun = (r, args, regs) => {
  regs[Inst.reg(args.b)] = u64(portable.clz_u32(u32(regs[Inst.reg(args.a)])));
  return OutcomeData.ok(r);
};

// TRAILING_ZERO_BITS_64
export const trailing_zero_bits_64: InstructionRun = (r, args, regs) => {
  regs[Inst.reg(args.b)] = portable.ctz_u64(regs[Inst.reg(args.a)]);
  return OutcomeData.ok(r);
};

// TRAILING_ZERO_BITS_32
export const trailing_zero_bits_32: InstructionRun = (r, args, regs) => {
  regs[Inst.reg(args.b)] = u64(portable.ctz_u32(u32(regs[Inst.reg(args.a)])));
  return OutcomeData.ok(r);
};

// SIGN_EXTEND_8
export const sign_extend_8: InstructionRun = (r, args, regs) => {
  regs[Inst.reg(args.b)] = Inst.u8SignExtend(u8(regs[Inst.reg(args.a)]));
  return OutcomeData.ok(r);
};

// SIGN_EXTEND_16
export const sign_extend_16: InstructionRun = (r, args, regs) => {
  regs[Inst.reg(args.b)] = Inst.u16SignExtend(u16(regs[Inst.reg(args.a)]));
  return OutcomeData.ok(r);
};

// ZERO_EXTEND_16
export const zero_extend_16: InstructionRun = (r, args, regs) => {
  regs[Inst.reg(args.b)] = u64(u16(regs[Inst.reg(args.a)]));
  return OutcomeData.ok(r);
};

// REVERSE_BYTES
export const reverse_bytes: InstructionRun = (r, args, regs) => {
  regs[Inst.reg(args.b)] = portable.bswap_u64(regs[Inst.reg(args.a)]);
  return OutcomeData.ok(r);
};
```
