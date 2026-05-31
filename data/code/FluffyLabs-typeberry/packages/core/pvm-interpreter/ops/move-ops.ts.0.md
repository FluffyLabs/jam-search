---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/move-ops.ts#L1-L38
title: packages/core/pvm-interpreter/ops/move-ops.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 6648647e565c34c2a636fea30e343a351ff2b9b084c3b6d6ce6c064346e77ed0
language: typescript
---
`packages/core/pvm-interpreter/ops/move-ops.ts` (lines 1–38)

```typescript
import type { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import type { Registers } from "../registers.js";

export class MoveOps {
  static new(regs: Registers) {
    return new MoveOps(regs);
  }

  private constructor(private regs: Registers) {}

  cmovIfZeroImmediate(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    if (this.regs.getU64(firstIndex) === 0n) {
      this.regs.setU64(resultIndex, immediate.getU64());
    }
  }

  cmovIfNotZeroImmediate(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    if (this.regs.getU64(firstIndex) !== 0n) {
      this.regs.setU64(resultIndex, immediate.getU64());
    }
  }

  cmovIfZero(firstIndex: number, secondIndex: number, resultIndex: number) {
    if (this.regs.getU64(secondIndex) === 0n) {
      this.regs.setU64(resultIndex, this.regs.getU64(firstIndex));
    }
  }

  cmovIfNotZero(firstIndex: number, secondIndex: number, resultIndex: number) {
    if (this.regs.getU64(secondIndex) !== 0n) {
      this.regs.setU64(resultIndex, this.regs.getU64(firstIndex));
    }
  }

  moveRegister(firstIndex: number, resultIndex: number) {
    this.regs.setU64(resultIndex, this.regs.getU64(firstIndex));
  }
}
```
