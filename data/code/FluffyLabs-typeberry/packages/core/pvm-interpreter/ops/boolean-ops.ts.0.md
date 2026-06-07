---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/boolean-ops.ts#L1-L34
title: packages/core/pvm-interpreter/ops/boolean-ops.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: cc0bf6359aa0a2157b8b7365919994cf9cef568c974502a4538e6a1e4592d690
language: typescript
---
`packages/core/pvm-interpreter/ops/boolean-ops.ts` (lines 1–34)

```typescript
import type { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import type { Registers } from "../registers.js";

export class BooleanOps {
  static new(regs: Registers) {
    return new BooleanOps(regs);
  }

  private constructor(private regs: Registers) {}

  setLessThanSignedImmediate(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU64(resultIndex, this.regs.getI64(firstIndex) < immediate.getI64() ? 1n : 0n);
  }

  setLessThanUnsignedImmediate(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU64(resultIndex, this.regs.getU64(firstIndex) < immediate.getU64() ? 1n : 0n);
  }

  setLessThanSigned(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setU64(resultIndex, this.regs.getI64(firstIndex) < this.regs.getI64(secondIndex) ? 1n : 0n);
  }

  setLessThanUnsigned(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setU64(resultIndex, this.regs.getU64(firstIndex) < this.regs.getU64(secondIndex) ? 1n : 0n);
  }

  setGreaterThanSignedImmediate(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU64(resultIndex, this.regs.getI64(firstIndex) > immediate.getI64() ? 1n : 0n);
  }

  setGreaterThanUnsignedImmediate(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU64(resultIndex, this.regs.getU64(firstIndex) > immediate.getU64() ? 1n : 0n);
  }
}
```
