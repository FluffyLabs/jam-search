---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-ext-imm-dispatcher.ts#L1-L15
title: >-
  packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-ext-imm-dispatcher.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 77462d7d537d8d2d60b91ab77b380903a3c9f6ae55a303537ffb962dee5b56a4
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-ext-imm-dispatcher.ts` (lines 1–15)

```typescript
import type { OneRegisterOneExtendedWidthImmediateArgs } from "../args-decoder/args-decoder.js";
import { Instruction } from "../instruction.js";
import type { LoadOps } from "../ops/index.js";

export class OneRegOneExtImmDispatcher {
  constructor(private loadOps: LoadOps) {}

  dispatch(instruction: Instruction, args: OneRegisterOneExtendedWidthImmediateArgs) {
    switch (instruction) {
      case Instruction.LOAD_IMM_64:
        this.loadOps.loadImmediateU64(args.registerIndex, args.immediateDecoder);
        break;
    }
  }
}
```
