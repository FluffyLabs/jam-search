---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-imm-dispatcher.ts#L1-L58
title: packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-imm-dispatcher.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 63c8041741d1c3f9f327964b836d4e369b2319a1ba09b4d8284fd4322669dda2
language: typescript
---
`packages/core/pvm-interpreter/ops-dispatchers/one-reg-one-imm-dispatcher.ts` (lines 1–58)

```typescript
import type { OneRegisterOneImmediateArgs } from "../args-decoder/args-decoder.js";
import { Instruction } from "../instruction.js";
import type { DynamicJumpOps } from "../ops/dynamic-jump-ops.js";
import type { LoadOps, StoreOps } from "../ops/index.js";

export class OneRegOneImmDispatcher {
  constructor(
    private loadOps: LoadOps,
    private storeOps: StoreOps,
    private dynamicJumpOps: DynamicJumpOps,
  ) {}

  dispatch(instruction: Instruction, args: OneRegisterOneImmediateArgs) {
    switch (instruction) {
      case Instruction.LOAD_IMM:
        this.loadOps.loadImmediate(args.registerIndex, args.immediateDecoder);
        break;
      case Instruction.STORE_U8:
        this.storeOps.storeU8(args.immediateDecoder.getUnsigned(), args.registerIndex);
        break;
      case Instruction.STORE_U16:
        this.storeOps.storeU16(args.immediateDecoder.getUnsigned(), args.registerIndex);
        break;
      case Instruction.STORE_U32:
        this.storeOps.storeU32(args.immediateDecoder.getUnsigned(), args.registerIndex);
        break;
      case Instruction.STORE_U64:
        this.storeOps.storeU64(args.immediateDecoder.getUnsigned(), args.registerIndex);
        break;
      case Instruction.LOAD_U8:
        this.loadOps.loadU8(args.immediateDecoder.getUnsigned(), args.registerIndex);
        break;
      case Instruction.LOAD_U16:
        this.loadOps.loadU16(args.immediateDecoder.getUnsigned(), args.registerIndex);
        break;
      case Instruction.LOAD_U32:
        this.loadOps.loadU32(args.immediateDecoder.getUnsigned(), args.registerIndex);
        break;
      case Instruction.LOAD_U64:
        this.loadOps.loadU64(args.immediateDecoder.getUnsigned(), args.registerIndex);
        break;
      case Instruction.LOAD_I8:
        this.loadOps.loadI8(args.immediateDecoder.getUnsigned(), args.registerIndex);
        break;
      case Instruction.LOAD_I16:
        this.loadOps.loadI16(args.immediateDecoder.getUnsigned(), args.registerIndex);
        break;
      case Instruction.LOAD_I32:
        this.loadOps.loadI32(args.immediateDecoder.getUnsigned(), args.registerIndex);
        break;
      case Instruction.JUMP_IND: {
        const address = this.dynamicJumpOps.caluclateJumpAddress(args.immediateDecoder, args.registerIndex);
        this.dynamicJumpOps.jumpInd(address);
        break;
      }
    }
  }
}
```
