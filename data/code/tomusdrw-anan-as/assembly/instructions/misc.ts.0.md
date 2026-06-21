---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/misc.ts#L1-L28
title: assembly/instructions/misc.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-15T09:40:01+02:00'
last_modified: '2026-06-15T09:40:01+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 74ed4446c03090ec2cf78ea9f49b778a9bb546dbaf2b12a091294c5a8dcd9e02
language: typescript
---
`assembly/instructions/misc.ts` (lines 1–28)

```typescript
import { MaybePageFault } from "../memory";
import { InstructionRun, OutcomeData } from "./outcome";
import { Inst } from "./utils";

const faultRes = new MaybePageFault();

// INVALID
export const INVALID: InstructionRun = (r) => OutcomeData.panic(r);

// TRAP
export const trap: InstructionRun = (r) => OutcomeData.panic(r);

// FALLTHROUGH
export const fallthrough: InstructionRun = (r) => OutcomeData.ok(r);

// ECALLI
export const ecalli: InstructionRun = (r, args) => OutcomeData.hostCall(r, args.a);

// SBRK
export const sbrk: InstructionRun = (r, args, registers, memory) => {
  const res = memory.sbrk(faultRes, u32(registers[Inst.reg(args.a)]));
  // out of memory
  if (faultRes.isFault) {
    return OutcomeData.okOrFault(r, faultRes);
  }
  registers[Inst.reg(args.b)] = res;
  return OutcomeData.ok(r);
};
```
