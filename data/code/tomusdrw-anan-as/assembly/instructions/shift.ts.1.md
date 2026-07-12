---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/shift.ts#L105-L140
title: assembly/instructions/shift.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-10T09:46:52Z'
last_modified: '2026-07-10T09:46:52Z'
chunk_index: 1
chunk_total: 2
content_sha: 3e4cc0f38f1dde19cf1383f737f0d4cbbfea43d2e534f2f7bd8ab860b75765fd
language: typescript
---
`assembly/instructions/shift.ts` (lines 105–140)

```typescript
// SHLO_R_32
export const shlo_r_32: InstructionRun = (r, args, registers) => {
  const shift = u32(registers[Inst.reg(args.a)] % u64(MAX_SHIFT_32));
  const value = u32(registers[Inst.reg(args.b)]);
  registers[Inst.reg(args.c)] = Inst.u32SignExtend(value >>> shift);
  return OutcomeData.ok(r);
};

// SHAR_R_32
export const shar_r_32: InstructionRun = (r, args, registers) => {
  const shift = u32(registers[Inst.reg(args.a)] % u64(MAX_SHIFT_32));
  const regValue = Inst.u32SignExtend(u32(registers[Inst.reg(args.b)]));
  registers[Inst.reg(args.c)] = Inst.u32SignExtend(u32(i64(regValue) >> i64(shift)));
  return OutcomeData.ok(r);
};

// SHLO_L
export const shlo_l: InstructionRun = (r, args, registers) => {
  const shift = u32(registers[Inst.reg(args.a)] % u64(MAX_SHIFT_64));
  registers[Inst.reg(args.c)] = u64(registers[Inst.reg(args.b)] << u64(shift));
  return OutcomeData.ok(r);
};

// SHLO_R
export const shlo_r: InstructionRun = (r, args, registers) => {
  const shift = u32(registers[Inst.reg(args.a)] % u64(MAX_SHIFT_64));
  registers[Inst.reg(args.c)] = registers[Inst.reg(args.b)] >> u64(shift);
  return OutcomeData.ok(r);
};

// SHAR_R
export const shar_r: InstructionRun = (r, args, registers) => {
  const shift = u32(registers[Inst.reg(args.a)] % u64(MAX_SHIFT_64));
  registers[Inst.reg(args.c)] = u64(i64(registers[Inst.reg(args.b)]) >> i64(shift));
  return OutcomeData.ok(r);
};
```
