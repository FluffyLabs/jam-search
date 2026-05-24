---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/rot.ts#L1-L70
title: assembly/instructions/rot.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-20T20:20:54Z'
last_modified: '2026-05-20T20:20:54Z'
chunk_index: 0
chunk_total: 1
content_sha: abe1b77ba24846e1d21cbd87058673e576f223b1066c3f070145d2343c483afb
language: typescript
---
`assembly/instructions/rot.ts` (lines 1–70)

```typescript
import { portable } from "../portable";
import { InstructionRun, OutcomeData } from "./outcome";
import { Inst } from "./utils";

// ROT_R_64_IMM
export const rot_r_64_imm: InstructionRun = (r, args, regs) => {
  regs[Inst.reg(args.b)] = math.rot_r(regs[Inst.reg(args.a)], Inst.u32SignExtend(args.c));
  return OutcomeData.ok(r);
};

// ROT_R_64_IMM_ALT
export const rot_r_64_imm_alt: InstructionRun = (r, args, regs) => {
  regs[Inst.reg(args.b)] = math.rot_r(Inst.u32SignExtend(args.c), regs[Inst.reg(args.a)]);
  return OutcomeData.ok(r);
};

// ROT_R_32_IMM
export const rot_r_32_imm: InstructionRun = (r, args, regs) => {
  regs[Inst.reg(args.b)] = Inst.u32SignExtend(math.rot_r_32(u32(regs[Inst.reg(args.a)]), u32(args.c)));
  return OutcomeData.ok(r);
};

// ROT_R_32_IMM_ALT
export const rot_r_32_imm_alt: InstructionRun = (r, args, regs) => {
  regs[Inst.reg(args.b)] = Inst.u32SignExtend(math.rot_r_32(u32(args.c), u32(regs[Inst.reg(args.a)])));
  return OutcomeData.ok(r);
};

// ROT_L_64
export const rot_l_64: InstructionRun = (r, args, regs) => {
  regs[Inst.reg(args.c)] = math.rot_l(regs[Inst.reg(args.b)], regs[Inst.reg(args.a)]);
  return OutcomeData.ok(r);
};

// ROT_L_32
export const rot_l_32: InstructionRun = (r, args, regs) => {
  regs[Inst.reg(args.c)] = Inst.u32SignExtend(math.rot_l_32(u32(regs[Inst.reg(args.b)]), u32(regs[Inst.reg(args.a)])));
  return OutcomeData.ok(r);
};

// ROT_R_64
export const rot_r_64: InstructionRun = (r, args, regs) => {
  regs[Inst.reg(args.c)] = math.rot_r(regs[Inst.reg(args.b)], regs[Inst.reg(args.a)]);
  return OutcomeData.ok(r);
};

// ROT_R_32
export const rot_r_32: InstructionRun = (r, args, regs) => {
  regs[Inst.reg(args.c)] = Inst.u32SignExtend(math.rot_r_32(u32(regs[Inst.reg(args.b)]), u32(regs[Inst.reg(args.a)])));
  return OutcomeData.ok(r);
};

export namespace math {
  // @inline
  export function rot_r(v: u64, shift: u64): u64 {
    return portable.rotr_u64(v, shift);
  }
  // @inline
  export function rot_r_32(v: u32, shift: u32): u32 {
    return portable.rotr_u32(v, shift);
  }
  // @inline
  export function rot_l(v: u64, shift: u64): u64 {
    return portable.rotl_u64(v, shift);
  }
  // @inline
  export function rot_l_32(v: u32, shift: u32): u32 {
    return portable.rotl_u32(v, shift);
  }
}
```
