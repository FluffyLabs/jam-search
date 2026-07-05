---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/one-reg-two-imms-dispatcher.ts#L1-L24
title: packages/core/pvm-interpreter/ops-dispatchers/one-reg-two-imms-dispatcher.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 663d3e694876a745d29657e22f395f4560b52bf8d056d164a2f177728ea8b180
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/one-reg-two-imms-dispatcher.ts` (lines 1–24)

```typescript
import type { OneRegisterTwoImmediatesArgs } from "../args-decoder/args-decoder.js";
import { Instruction } from "../instruction.js";
import type { StoreOps } from "../ops/index.js";

export class OneRegTwoImmsDispatcher {
  constructor(private storeOps: StoreOps) {}

  dispatch(instruction: Instruction, args: OneRegisterTwoImmediatesArgs) {
    switch (instruction) {
      case Instruction.STORE_IMM_IND_U8:
        this.storeOps.storeImmediateIndU8(args.registerIndex, args.firstImmediateDecoder, args.secondImmediateDecoder);
        break;
      case Instruction.STORE_IMM_IND_U16:
        this.storeOps.storeImmediateIndU16(args.registerIndex, args.firstImmediateDecoder, args.secondImmediateDecoder);
        break;
      case Instruction.STORE_IMM_IND_U32:
        this.storeOps.storeImmediateIndU32(args.registerIndex, args.firstImmediateDecoder, args.secondImmediateDecoder);
        break;
      case Instruction.STORE_IMM_IND_U64:
        this.storeOps.storeImmediateIndU64(args.registerIndex, args.firstImmediateDecoder, args.secondImmediateDecoder);
        break;
    }
  }
}
```
