---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/math.ts#L1-L116
title: assembly/instructions/math.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-24T09:46:09+02:00'
last_modified: '2026-04-24T09:46:09+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 0382c1b82e7a2b24a356162305ea672920c625e22509c9c9a2f32ea2f7d81667
language: typescript
---
`assembly/instructions/math.ts` (lines 1–116)

```typescript
import { portable } from "../portable";
import { InstructionRun, OutcomeData } from "./outcome";
import { Inst, mulUpperSigned, mulUpperSignedUnsigned, mulUpperUnsigned } from "./utils";

// ADD_IMM_32
export const add_imm_32: InstructionRun = (r, args, registers) => {
  const a = registers[Inst.reg(args.a)];
  const c = Inst.u32SignExtend(args.c);
  registers[Inst.reg(args.b)] = Inst.u32SignExtend(u32(portable.u64_add(a, c)));
  return OutcomeData.ok(r);
};

// MUL_IMM_32
export const mul_imm_32: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.b)] = Inst.u32SignExtend(u32(portable.u64_mul(registers[Inst.reg(args.a)], u64(args.c))));
  return OutcomeData.ok(r);
};

// NEG_ADD_IMM_32
export const neg_add_imm_32: InstructionRun = (r, args, registers) => {
  const sum = portable.u64_sub(u64(args.c) | u64(0x1_0000_0000), registers[Inst.reg(args.a)]);
  registers[Inst.reg(args.b)] = Inst.u32SignExtend(u32(sum));
  return OutcomeData.ok(r);
};

// ADD_IMM
export const add_imm: InstructionRun = (r, args, registers) => {
  const sum: u64 = portable.u64_add(registers[Inst.reg(args.a)], Inst.u32SignExtend(args.c));
  registers[Inst.reg(args.b)] = sum;
  return OutcomeData.ok(r);
};

// MUL_IMM
export const mul_imm: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.b)] = portable.u64_mul(registers[Inst.reg(args.a)], Inst.u32SignExtend(args.c));
  return OutcomeData.ok(r);
};

// NEG_ADD_IMM
export const neg_add_imm: InstructionRun = (r, args, registers) => {
  const sum = portable.u64_sub(Inst.u32SignExtend(args.c), registers[Inst.reg(args.a)]);
  registers[Inst.reg(args.b)] = sum;
  return OutcomeData.ok(r);
};

// ADD_32
export const add_32: InstructionRun = (r, args, registers) => {
  const a = u32(registers[Inst.reg(args.a)]);
  const b = u32(registers[Inst.reg(args.b)]);
  registers[Inst.reg(args.c)] = Inst.u32SignExtend(a + b);
  return OutcomeData.ok(r);
};

// SUB_32
export const sub_32: InstructionRun = (r, args, registers) => {
  const a = registers[Inst.reg(args.b)];
  const b = u64(0x1_0000_0000 - u32(registers[Inst.reg(args.a)]));
  registers[Inst.reg(args.c)] = Inst.u32SignExtend(u32(portable.u64_add(a, b)));
  return OutcomeData.ok(r);
};

// MUL_32
export const mul_32: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.c)] = Inst.u32SignExtend(
    u32(portable.u64_mul(registers[Inst.reg(args.a)], registers[Inst.reg(args.b)])),
  );
  return OutcomeData.ok(r);
};

// DIV_U_32
export const div_u_32: InstructionRun = (r, args, registers) => {
  const a = u32(registers[Inst.reg(args.a)]);
  if (a === 0) {
    registers[Inst.reg(args.c)] = u64.MAX_VALUE;
  } else {
    const b = u32(registers[Inst.reg(args.b)]);
    registers[Inst.reg(args.c)] = Inst.u32SignExtend(b / a);
  }
  return OutcomeData.ok(r);
};

// DIV_S_32
export const div_s_32: InstructionRun = (r, args, registers) => {
  const b = i64(Inst.u32SignExtend(u32(registers[Inst.reg(args.b)])));
  const a = i64(Inst.u32SignExtend(u32(registers[Inst.reg(args.a)])));
  if (a === i64(0)) {
    registers[Inst.reg(args.c)] = u64.MAX_VALUE;
  } else if (a === i64(-1) && b === i64(i32.MIN_VALUE)) {
    registers[Inst.reg(args.c)] = u64(b);
  } else {
    registers[Inst.reg(args.c)] = u64(b / a);
  }
  return OutcomeData.ok(r);
};

// REM_U_32
export const rem_u_32: InstructionRun = (r, args, registers) => {
  const a = u32(registers[Inst.reg(args.a)]);
  const b = u32(registers[Inst.reg(args.b)]);
  if (a === 0) {
    registers[Inst.reg(args.c)] = Inst.u32SignExtend(b);
  } else {
    registers[Inst.reg(args.c)] = Inst.u32SignExtend(b % a);
  }
  return OutcomeData.ok(r);
};

// REM_S_32
export const rem_s_32: InstructionRun = (r, args, registers) => {
  const b = i32(registers[Inst.reg(args.b)]);
  const a = i32(registers[Inst.reg(args.a)]);
  if (a === 0) {
    registers[Inst.reg(args.c)] = u64(i64(b));
  } else if (a === -1 && b === i32.MIN_VALUE) {
    registers[Inst.reg(args.c)] = u64(0);
  } else {
```
