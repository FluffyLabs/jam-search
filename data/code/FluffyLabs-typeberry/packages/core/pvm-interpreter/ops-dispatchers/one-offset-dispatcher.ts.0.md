---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/one-offset-dispatcher.ts#L1-L15
title: packages/core/pvm-interpreter/ops-dispatchers/one-offset-dispatcher.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: db4d8815c1d0202f6ca06725f5d13bb6f640866175b9b8eb19e394b4fac410eb
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/one-offset-dispatcher.ts` (lines 1–15)

```typescript
import type { OneOffsetArgs } from "../args-decoder/args-decoder.js";
import { Instruction } from "../instruction.js";
import type { BranchOps } from "../ops/index.js";

export class OneOffsetDispatcher {
  constructor(private branchOps: BranchOps) {}

  dispatch(instruction: Instruction, args: OneOffsetArgs) {
    switch (instruction) {
      case Instruction.JUMP:
        this.branchOps.jump(args.nextPc);
        break;
    }
  }
}
```
