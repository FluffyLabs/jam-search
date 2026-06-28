---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/no-args-dispatcher.ts#L1-L18
title: packages/core/pvm-interpreter/ops-dispatchers/no-args-dispatcher.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 6b9e1b7fcfe657013c1355c5acf443ea6ffa86ce7e249cec73fb3b8ce853c048
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/no-args-dispatcher.ts` (lines 1–18)

```typescript
import { Instruction } from "../instruction.js";
import type { NoArgsOps } from "../ops/index.js";

export class NoArgsDispatcher {
  constructor(private noArgsOps: NoArgsOps) {}

  dispatch(instruction: Instruction) {
    switch (instruction) {
      case Instruction.TRAP:
        this.noArgsOps.trap();
        break;

      case Instruction.FALLTHROUGH:
        this.noArgsOps.fallthrough();
        break;
    }
  }
}
```
