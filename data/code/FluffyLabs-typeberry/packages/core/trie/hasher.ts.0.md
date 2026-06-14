---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/trie/hasher.ts#L1-L21
title: packages/core/trie/hasher.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 8dec7085154d406a8bc5f9d8ae0b4775f2e4dffde77c0aca9e3b21f9b4d9a67d
language: typescript
---
`packages/core/trie/hasher.ts` (lines 1–21)

```typescript
import { BytesBlob } from "@typeberry/bytes";
import type { Blake2b } from "@typeberry/hash";
import { hashBlobs, type KeccakHasher } from "@typeberry/hash/keccak.js";
import type { TrieNodeHash } from "./nodes.js";
import type { TrieHasher } from "./nodesDb.js";

export function getBlake2bTrieHasher(hasher: Blake2b): TrieHasher {
  return {
    hashConcat(n: Uint8Array, rest: Uint8Array[] = []): TrieNodeHash {
      return hasher.hashBlobs([n, ...rest]);
    },
  };
}

export function getKeccakTrieHasher(hasher: KeccakHasher): TrieHasher {
  return {
    hashConcat(n: Uint8Array, rest: Uint8Array[] = []): TrieNodeHash {
      return hashBlobs(hasher, [n, ...rest].map(BytesBlob.blobFrom)).asOpaque();
    },
  };
}
```
