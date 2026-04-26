---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/store.ts#L103-L120
title: assembly/instructions/store.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-24T09:46:09+02:00'
last_modified: '2026-04-24T09:46:09+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 0b9a2de1d3ceecd1b1a13b90d92f5c58b3e94d1a3a2bbdfb5d164bdc16348de0
language: typescript
---
`assembly/instructions/store.ts` (lines 103–120)

```typescript
  const address = effectiveAddress(registers, args.a, args.c);
  memory.setU16(faultRes, address, <u16>(registers[Inst.reg(args.b)] & u64(0xff_ff)));
  return OutcomeData.okOrFault(r, faultRes);
};

// STORE_IND_U32
export const store_ind_u32: InstructionRun = (r, args, registers, memory) => {
  const address = effectiveAddress(registers, args.a, args.c);
  memory.setU32(faultRes, address, u32(registers[Inst.reg(args.b)]));
  return OutcomeData.okOrFault(r, faultRes);
};

// STORE_IND_U64
export const store_ind_u64: InstructionRun = (r, args, registers, memory) => {
  const address = effectiveAddress(registers, args.a, args.c);
  memory.setU64(faultRes, address, registers[Inst.reg(args.b)]);
  return OutcomeData.okOrFault(r, faultRes);
};
```
