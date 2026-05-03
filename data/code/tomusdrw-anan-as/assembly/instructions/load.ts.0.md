---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/load.ts#L1-L124
title: assembly/instructions/load.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-27T09:49:56+01:00'
last_modified: '2026-04-27T09:49:56+01:00'
chunk_index: 0
chunk_total: 2
content_sha: 4c804a350aeb00b70f424219c539e77016078b32f099d7d3fab0f9e38d8744a2
language: typescript
---
`assembly/instructions/load.ts` (lines 1–124)

```typescript
import { MaybePageFault } from "../memory";
import { portable } from "../portable";
import { InstructionRun, OutcomeData } from "./outcome";
import { Inst } from "./utils";

const faultRes: MaybePageFault = new MaybePageFault();

// LOAD_IMM_64
export const load_imm_64: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.a)] = portable.u64_add(u64(args.b), u64(args.c) << u64(32));
  return OutcomeData.ok(r);
};

// LOAD_IMM
export const load_imm: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.a)] = Inst.u32SignExtend(args.b);
  return OutcomeData.ok(r);
};

// LOAD_U8
export const load_u8: InstructionRun = (r, args, registers, memory) => {
  const result = memory.getU8(faultRes, args.b);
  if (!faultRes.isFault) {
    registers[Inst.reg(args.a)] = result;
  }
  return OutcomeData.okOrFault(r, faultRes);
};

// LOAD_I8
export const load_i8: InstructionRun = (r, args, registers, memory) => {
  const result = memory.getI8(faultRes, args.b);
  if (!faultRes.isFault) {
    registers[Inst.reg(args.a)] = result;
  }
  return OutcomeData.okOrFault(r, faultRes);
};

// LOAD_U16
export const load_u16: InstructionRun = (r, args, registers, memory) => {
  const result = memory.getU16(faultRes, args.b);
  if (!faultRes.isFault) {
    registers[Inst.reg(args.a)] = result;
  }
  return OutcomeData.okOrFault(r, faultRes);
};

// LOAD_I16
export const load_i16: InstructionRun = (r, args, registers, memory) => {
  const result = memory.getI16(faultRes, args.b);
  if (!faultRes.isFault) {
    registers[Inst.reg(args.a)] = result;
  }
  return OutcomeData.okOrFault(r, faultRes);
};

// LOAD_U32
export const load_u32: InstructionRun = (r, args, registers, memory) => {
  const result = memory.getU32(faultRes, args.b);
  if (!faultRes.isFault) {
    registers[Inst.reg(args.a)] = result;
  }
  return OutcomeData.okOrFault(r, faultRes);
};

// LOAD_I32
export const load_i32: InstructionRun = (r, args, registers, memory) => {
  const result = memory.getI32(faultRes, args.b);
  if (!faultRes.isFault) {
    registers[Inst.reg(args.a)] = result;
  }
  return OutcomeData.okOrFault(r, faultRes);
};

// LOAD_U64
export const load_u64: InstructionRun = (r, args, registers, memory) => {
  const result = memory.getU64(faultRes, args.b);
  if (!faultRes.isFault) {
    registers[Inst.reg(args.a)] = result;
  }
  return OutcomeData.okOrFault(r, faultRes);
};

// LOAD_IND_U8
export const load_ind_u8: InstructionRun = (r, args, registers, memory) => {
  const address = u32(portable.u64_add(registers[Inst.reg(args.a)], Inst.u32SignExtend(args.c)));
  const result = memory.getU8(faultRes, address);
  if (!faultRes.isFault) {
    registers[Inst.reg(args.b)] = result;
  }
  return OutcomeData.okOrFault(r, faultRes);
};

// LOAD_IND_I8
export const load_ind_i8: InstructionRun = (r, args, registers, memory) => {
  const address = u32(portable.u64_add(registers[Inst.reg(args.a)], Inst.u32SignExtend(args.c)));
  const result = memory.getI8(faultRes, address);
  if (!faultRes.isFault) {
    registers[Inst.reg(args.b)] = result;
  }
  return OutcomeData.okOrFault(r, faultRes);
};

// LOAD_IND_U16
export const load_ind_u16: InstructionRun = (r, args, registers, memory) => {
  const address = u32(portable.u64_add(registers[Inst.reg(args.a)], Inst.u32SignExtend(args.c)));
  const result = memory.getU16(faultRes, address);
  if (!faultRes.isFault) {
    registers[Inst.reg(args.b)] = result;
  }
  return OutcomeData.okOrFault(r, faultRes);
};

// LOAD_IND_I16
export const load_ind_i16: InstructionRun = (r, args, registers, memory) => {
  const address = u32(portable.u64_add(registers[Inst.reg(args.a)], Inst.u32SignExtend(args.c)));
  const result = memory.getI16(faultRes, address);
  if (!faultRes.isFault) {
    registers[Inst.reg(args.b)] = result;
  }
  return OutcomeData.okOrFault(r, faultRes);
};

// LOAD_IND_U32
export const load_ind_u32: InstructionRun = (r, args, registers, memory) => {
```
