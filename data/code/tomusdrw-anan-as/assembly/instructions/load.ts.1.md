---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/load.ts#L117-L151
title: assembly/instructions/load.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-29T16:20:56+02:00'
last_modified: '2026-05-29T16:20:56+02:00'
chunk_index: 1
chunk_total: 2
content_sha: e063c0f4b7a87ab1385b94e97b2e583406873722efa56cba8a6bde6031e44ba8
language: typescript
---
`assembly/instructions/load.ts` (lines 117–151)

```typescript
  if (!faultRes.isFault) {
    registers[Inst.reg(args.b)] = result;
  }
  return OutcomeData.okOrFault(r, faultRes);
};

// LOAD_IND_U32
export const load_ind_u32: InstructionRun = (r, args, registers, memory) => {
  const address = u32(portable.u64_add(registers[Inst.reg(args.a)], Inst.u32SignExtend(args.c)));
  const result = memory.getU32(faultRes, address);
  if (!faultRes.isFault) {
    registers[Inst.reg(args.b)] = result;
  }
  return OutcomeData.okOrFault(r, faultRes);
};

// LOAD_IND_I32
export const load_ind_i32: InstructionRun = (r, args, registers, memory) => {
  const address = u32(portable.u64_add(registers[Inst.reg(args.a)], Inst.u32SignExtend(args.c)));
  const result = memory.getI32(faultRes, address);
  if (!faultRes.isFault) {
    registers[Inst.reg(args.b)] = result;
  }
  return OutcomeData.okOrFault(r, faultRes);
};

// LOAD_IND_U64
export const load_ind_u64: InstructionRun = (r, args, registers, memory) => {
  const address = u32(portable.u64_add(registers[Inst.reg(args.a)], Inst.u32SignExtend(args.c)));
  const result = memory.getU64(faultRes, u32(address));
  if (!faultRes.isFault) {
    registers[Inst.reg(args.b)] = result;
  }
  return OutcomeData.okOrFault(r, faultRes);
};
```
