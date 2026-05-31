---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/store.ts#L1-L108
title: assembly/instructions/store.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-29T16:20:56+02:00'
last_modified: '2026-05-29T16:20:56+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 236f1862bdd38a2ce36e0b736fb98f967f581be6ec42216acb9c19b88acd6cbe
language: typescript
---
`assembly/instructions/store.ts` (lines 1–108)

```typescript
import { MaybePageFault } from "../memory";
import { portable } from "../portable";
import { Registers } from "../registers";
import { InstructionRun, OutcomeData } from "./outcome";
import { Inst } from "./utils";

const faultRes = new MaybePageFault();

// Helper function to compute effective address from base register and signed 32-bit offset
function effectiveAddress(registers: Registers, baseReg: u32, offset: u32): u32 {
  return u32(portable.u64_add(registers[Inst.reg(u64(baseReg))], Inst.u32SignExtend(offset)));
}

// STORE_IMM_U8
export const store_imm_u8: InstructionRun = (r, args, _registers, memory) => {
  const address = args.a;
  memory.setU8(faultRes, address, <u8>(args.b & 0xff));
  return OutcomeData.okOrFault(r, faultRes);
};

// STORE_IMM_U16
export const store_imm_u16: InstructionRun = (r, args, _registers, memory) => {
  const address = args.a;
  memory.setU16(faultRes, address, <u16>(args.b & 0xff_ff));
  return OutcomeData.okOrFault(r, faultRes);
};

// STORE_IMM_U32
export const store_imm_u32: InstructionRun = (r, args, _registers, memory) => {
  const address = args.a;
  memory.setU32(faultRes, address, args.b);
  return OutcomeData.okOrFault(r, faultRes);
};

// STORE_IMM_U64
export const store_imm_u64: InstructionRun = (r, args, _registers, memory) => {
  const address = args.a;
  memory.setU64(faultRes, address, Inst.u32SignExtend(args.b));
  return OutcomeData.okOrFault(r, faultRes);
};

// STORE_U8
export const store_u8: InstructionRun = (r, args, registers, memory) => {
  memory.setU8(faultRes, args.b, <u8>(registers[Inst.reg(args.a)] & u64(0xff)));
  return OutcomeData.okOrFault(r, faultRes);
};

// STORE_U16
export const store_u16: InstructionRun = (r, args, registers, memory) => {
  memory.setU16(faultRes, args.b, <u16>(registers[Inst.reg(args.a)] & u64(0xff_ff)));
  return OutcomeData.okOrFault(r, faultRes);
};

// STORE_U32
export const store_u32: InstructionRun = (r, args, registers, memory) => {
  memory.setU32(faultRes, args.b, u32(registers[Inst.reg(args.a)]));
  return OutcomeData.okOrFault(r, faultRes);
};

// STORE_U64
export const store_u64: InstructionRun = (r, args, registers, memory) => {
  memory.setU64(faultRes, args.b, registers[Inst.reg(args.a)]);
  return OutcomeData.okOrFault(r, faultRes);
};

// STORE_IMM_IND_U8
export const store_imm_ind_u8: InstructionRun = (r, args, registers, memory) => {
  const address = effectiveAddress(registers, args.a, args.b);
  memory.setU8(faultRes, address, <u8>(args.c & 0xff));
  return OutcomeData.okOrFault(r, faultRes);
};

// STORE_IMM_IND_U16
export const store_imm_ind_u16: InstructionRun = (r, args, registers, memory) => {
  const address = effectiveAddress(registers, args.a, args.b);
  memory.setU16(faultRes, address, <u16>(args.c & 0xff_ff));
  return OutcomeData.okOrFault(r, faultRes);
};

// STORE_IMM_IND_U32
export const store_imm_ind_u32: InstructionRun = (r, args, registers, memory) => {
  const address = effectiveAddress(registers, args.a, args.b);
  memory.setU32(faultRes, address, args.c);
  return OutcomeData.okOrFault(r, faultRes);
};

// STORE_IMM_IND_U64
export const store_imm_ind_u64: InstructionRun = (r, args, registers, memory) => {
  const address = effectiveAddress(registers, args.a, args.b);
  memory.setU64(faultRes, address, Inst.u32SignExtend(args.c));
  return OutcomeData.okOrFault(r, faultRes);
};

// STORE_IND_U8
export const store_ind_u8: InstructionRun = (r, args, registers, memory) => {
  const address = effectiveAddress(registers, args.a, args.c);
  memory.setU8(faultRes, address, <u8>(registers[Inst.reg(args.b)] & u64(0xff)));
  return OutcomeData.okOrFault(r, faultRes);
};

// STORE_IND_U16
export const store_ind_u16: InstructionRun = (r, args, registers, memory) => {
  const address = effectiveAddress(registers, args.a, args.c);
  memory.setU16(faultRes, address, <u16>(registers[Inst.reg(args.b)] & u64(0xff_ff)));
  return OutcomeData.okOrFault(r, faultRes);
};

// STORE_IND_U32
```
