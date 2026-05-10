---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/two-regs-two-imms-dispatcher.ts#L1-L21
title: packages/core/pvm-interpreter/ops-dispatchers/two-regs-two-imms-dispatcher.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 46a8fc932f75e28f33044023c9116a5b2f79347aaed4b00c7ad28613ba003108
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/two-regs-two-imms-dispatcher.ts` (lines 1–21)

```typescript
import type { TwoRegistersTwoImmediatesArgs } from "../args-decoder/args-decoder.js";
import { Instruction } from "../instruction.js";
import type { DynamicJumpOps, LoadOps } from "../ops/index.js";

export class TwoRegsTwoImmsDispatcher {
  constructor(
    private loadOps: LoadOps,
    private dynamicJumpOps: DynamicJumpOps,
  ) {}

  dispatch(instruction: Instruction, args: TwoRegistersTwoImmediatesArgs) {
    switch (instruction) {
      case Instruction.LOAD_IMM_JUMP_IND: {
        const address = this.dynamicJumpOps.caluclateJumpAddress(args.secondImmediateDecoder, args.secondRegisterIndex);
        this.loadOps.loadImmediate(args.firstRegisterIndex, args.firstImmediateDecoder);
        this.dynamicJumpOps.jumpInd(address);
        break;
      }
    }
  }
}
```
