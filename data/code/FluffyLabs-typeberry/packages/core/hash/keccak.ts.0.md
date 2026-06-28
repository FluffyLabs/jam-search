---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/hash/keccak.ts#L1-L20
title: packages/core/hash/keccak.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 81c07caa9c4924cd86fc5ae6ad2f7e4fc41dfc036268786af468bdac52e41760
language: typescript
---
`packages/core/hash/keccak.ts` (lines 1–20)

```typescript
import { Bytes, type BytesBlob } from "@typeberry/bytes";
import { createKeccak, type IHasher } from "hash-wasm";
import { HASH_SIZE } from "./hash.js";

export class KeccakHasher {
  static async create(): Promise<KeccakHasher> {
    return new KeccakHasher(await createKeccak(256));
  }

  private constructor(public readonly hasher: IHasher) {}
}

export function hashBlobs(hasher: KeccakHasher, blobs: BytesBlob[]) {
  hasher.hasher.init();
  for (const blob of blobs) {
    hasher.hasher.update(blob.raw);
  }
  // NOTE we can't use an allocator here because the library does not allow that.
  return Bytes.fromBlob(hasher.hasher.digest("binary"), HASH_SIZE);
}
```
