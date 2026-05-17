---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/hash/blake2b.ts#L1-L44
title: packages/core/hash/blake2b.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: ce2854442589d07860d859295b0d0aee97ddc98d89c2d5e95345f04d5c2ff11d
language: typescript
---
`packages/core/hash/blake2b.ts` (lines 1–44)

```typescript
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { createBLAKE2b, type IHasher } from "hash-wasm";

import { type Blake2bHash, HASH_SIZE } from "./hash.js";

const zero = Bytes.zero(HASH_SIZE);

export class Blake2b {
  static async createHasher() {
    return new Blake2b(await createBLAKE2b(HASH_SIZE * 8));
  }

  private constructor(private readonly hasher: IHasher) {}

  /**
   * Hash given collection of blobs.
   *
   * If empty array is given a zero-hash is returned.
   */
  hashBlobs<H extends Blake2bHash>(r: (BytesBlob | Uint8Array)[]): H {
    if (r.length === 0) {
      return zero.asOpaque();
    }

    const hasher = this.hasher.init();
    for (const v of r) {
      hasher.update(v instanceof BytesBlob ? v.raw : v);
    }
    return Bytes.fromBlob(hasher.digest("binary"), HASH_SIZE).asOpaque();
  }

  /** Hash given blob of bytes. */
  hashBytes(blob: BytesBlob | Uint8Array): Blake2bHash {
    const hasher = this.hasher.init();
    const bytes = blob instanceof BytesBlob ? blob.raw : blob;
    hasher.update(bytes);
    return Bytes.fromBlob(hasher.digest("binary"), HASH_SIZE).asOpaque();
  }

  /** Convert given string into bytes and hash it. */
  hashString(str: string) {
    return this.hashBytes(BytesBlob.blobFromString(str));
  }
}
```
