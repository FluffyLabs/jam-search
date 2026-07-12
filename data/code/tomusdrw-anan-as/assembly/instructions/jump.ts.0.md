---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/jump.ts#L1-L25
title: assembly/instructions/jump.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-10T09:46:52Z'
last_modified: '2026-07-10T09:46:52Z'
chunk_index: 0
chunk_total: 1
content_sha: 3309982c9a64d89e74e981d8357376d171ea44f15a50ecaedb9fa8855d2a731e
language: typescript
---
`assembly/instructions/jump.ts` (lines 1–25)

```typescript
import { portable } from "../portable";
import { InstructionRun, OutcomeData } from "./outcome";
import { Inst } from "./utils";

// JUMP
export const jump: InstructionRun = (r, args) => OutcomeData.staticJump(r, args.a);

// JUMP_IND
export const jump_ind: InstructionRun = (r, args, registers) => {
  const address = u32(portable.u64_add(registers[Inst.reg(args.a)], Inst.u32SignExtend(args.b)));
  return OutcomeData.dJump(r, address);
};

// LOAD_IMM_JUMP
export const load_imm_jump: InstructionRun = (r, args, registers) => {
  registers[Inst.reg(args.a)] = Inst.u32SignExtend(args.b);
  return OutcomeData.staticJump(r, args.c);
};

// LOAD_IMM_JUMP_IND
export const load_imm_jump_ind: InstructionRun = (r, args, registers) => {
  const address = u32(portable.u64_add(registers[Inst.reg(args.a)], Inst.u32SignExtend(args.d)));
  registers[Inst.reg(args.b)] = Inst.u32SignExtend(args.c);
  return OutcomeData.dJump(r, address);
};
```
