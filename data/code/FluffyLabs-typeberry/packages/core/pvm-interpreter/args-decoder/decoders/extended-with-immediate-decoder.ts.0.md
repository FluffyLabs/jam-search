---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/decoders/extended-with-immediate-decoder.ts#L1-L35
title: >-
  packages/core/pvm-interpreter/args-decoder/decoders/extended-with-immediate-decoder.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: f2c32b20c9c3f51e0a9fc5d803c8f90ed63987f59e98d1bef271d202c9610a81
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/decoders/extended-with-immediate-decoder.ts` (lines 1–35)

```typescript
const IMMEDIATE_SIZE = 8;

export class ExtendedWitdthImmediateDecoder {
  private unsignedImmediate: BigUint64Array;
  private bytes: Uint8Array;

  static new() {
    return new ExtendedWitdthImmediateDecoder();
  }

  private constructor() {
    const buffer = new ArrayBuffer(IMMEDIATE_SIZE);
    this.unsignedImmediate = new BigUint64Array(buffer);
    this.bytes = new Uint8Array(buffer);
  }

  setBytes(bytes: Uint8Array) {
    let i = 0;
    for (; i < bytes.length; i++) {
      this.bytes[i] = bytes[i];
    }

    for (; i < IMMEDIATE_SIZE; i++) {
      this.bytes[i] = 0;
    }
  }

  getValue() {
    return this.unsignedImmediate[0];
  }

  getBytesAsLittleEndian() {
    return this.bytes.subarray(0, IMMEDIATE_SIZE);
  }
}
```
