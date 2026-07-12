---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/two-imms-dispatcher.ts#L1-L24
title: packages/core/pvm-interpreter/ops-dispatchers/two-imms-dispatcher.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 9353fa69a8e330099a0379480db6fde8e3d6eb9deb4425c73a3170afefb5b286
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/two-imms-dispatcher.ts` (lines 1–24)

```typescript
import type { TwoImmediatesArgs } from "../args-decoder/args-decoder.js";
import { Instruction } from "../instruction.js";
import type { StoreOps } from "../ops/index.js";

export class TwoImmsDispatcher {
  constructor(private storeOps: StoreOps) {}

  dispatch(instruction: Instruction, args: TwoImmediatesArgs) {
    switch (instruction) {
      case Instruction.STORE_IMM_U8:
        this.storeOps.storeImmediateU8(args.firstImmediateDecoder.getUnsigned(), args.secondImmediateDecoder);
        break;
      case Instruction.STORE_IMM_U16:
        this.storeOps.storeImmediateU16(args.firstImmediateDecoder.getUnsigned(), args.secondImmediateDecoder);
        break;
      case Instruction.STORE_IMM_U32:
        this.storeOps.storeImmediateU32(args.firstImmediateDecoder.getUnsigned(), args.secondImmediateDecoder);
        break;
      case Instruction.STORE_IMM_U64:
        this.storeOps.storeImmediateU64(args.firstImmediateDecoder.getUnsigned(), args.secondImmediateDecoder);
        break;
    }
  }
}
```
