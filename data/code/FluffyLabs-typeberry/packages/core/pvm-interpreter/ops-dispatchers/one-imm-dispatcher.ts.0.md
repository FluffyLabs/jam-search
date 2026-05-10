---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/one-imm-dispatcher.ts#L1-L15
title: packages/core/pvm-interpreter/ops-dispatchers/one-imm-dispatcher.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: b1171152d821b378df7fcbee4c5c9d69530e92cc29a72e403bf4b78933c63df9
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/one-imm-dispatcher.ts` (lines 1–15)

```typescript
import type { OneImmediateArgs } from "../args-decoder/args-decoder.js";
import { Instruction } from "../instruction.js";
import type { HostCallOps } from "../ops/index.js";

export class OneImmDispatcher {
  constructor(private hostCallOps: HostCallOps) {}

  dispatch(instruction: Instruction, args: OneImmediateArgs) {
    switch (instruction) {
      case Instruction.ECALLI:
        this.hostCallOps.hostCall(args.immediateDecoder);
        break;
    }
  }
}
```
