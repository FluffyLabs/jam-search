---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/store-ops.ts#L87-L122
title: packages/core/pvm-interpreter/ops/store-ops.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 6da95688053f0cfb6b049e953eaef5de0a7e46c43e842ba9476c33cd932f91e4
language: typescript
---
`packages/core/pvm-interpreter/ops/store-ops.ts` (lines 87–122)

```typescript
    const address = addWithOverflowU32(this.regs.getLowerU32(registerIndex), firstImmediateDecoder.getUnsigned());
    this.store(address, secondImmediateDecoder.getBytesAsLittleEndian().subarray(0, 2));
  }

  storeImmediateIndU32(
    registerIndex: number,
    firstImmediateDecoder: ImmediateDecoder,
    secondImmediateDecoder: ImmediateDecoder,
  ) {
    const address = addWithOverflowU32(this.regs.getLowerU32(registerIndex), firstImmediateDecoder.getUnsigned());
    this.store(address, secondImmediateDecoder.getBytesAsLittleEndian().subarray(0, 4));
  }

  storeImmediateIndU64(
    registerIndex: number,
    firstImmediateDecoder: ImmediateDecoder,
    secondImmediateDecoder: ImmediateDecoder,
  ) {
    const address = addWithOverflowU32(this.regs.getLowerU32(registerIndex), firstImmediateDecoder.getUnsigned());
    this.store(address, secondImmediateDecoder.getExtendedBytesAsLittleEndian());
  }

  private store(address: number, bytes: Uint8Array) {
    const storeResult = this.memory.storeFrom(tryAsMemoryIndex(address), bytes);
    if (storeResult.isOk) {
      return;
    }

    if (storeResult.error.isAccessFault) {
      this.instructionResult.status = Result.FAULT_ACCESS;
    } else {
      this.instructionResult.status = Result.FAULT;
      this.instructionResult.exitParam = getStartPageIndex(tryAsMemoryIndex(storeResult.error.address));
    }
  }
}
```
