---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate-output.ts#L1-L34
title: packages/jam/transition/accumulate/accumulate-output.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 6dc6d464794a1c881397bc46919fcc3700d70b2cd5572cbd402dbd47d7aa9bf0
language: typescript
---
`packages/jam/transition/accumulate/accumulate-output.ts` (lines 1–34)

```typescript
import { BytesBlob } from "@typeberry/bytes";
import type { SortedArray } from "@typeberry/collections";
import { KeccakHasher } from "@typeberry/hash/keccak.js";
import { binaryMerkleization } from "@typeberry/merkleization";
import { u32AsLeBytes } from "@typeberry/numbers";
import type { AccumulationOutput } from "@typeberry/state";
import { getKeccakTrieHasher } from "@typeberry/trie/hasher.js";
import type { AccumulateRoot } from "./accumulate-state.js";

type AccumulateRootInput = {
  accumulationOutputLog: SortedArray<AccumulationOutput>;
};

export class AccumulateOutput {
  async transition({ accumulationOutputLog }: AccumulateRootInput): Promise<AccumulateRoot> {
    const rootHash = await getRootHash(accumulationOutputLog);
    return rootHash;
  }
}

/**
 * Returns a new root hash
 *
 * https://graypaper.fluffylabs.dev/#/38c4e62/3c9d013c9d01?v=0.7.0
 */
async function getRootHash(yieldedRoots: SortedArray<AccumulationOutput>): Promise<AccumulateRoot> {
  const keccakHasher = await KeccakHasher.create();
  const trieHasher = getKeccakTrieHasher(keccakHasher);
  const values = yieldedRoots.array.map(({ serviceId, output }) => {
    return BytesBlob.blobFromParts([u32AsLeBytes(serviceId), output.raw]);
  });

  return binaryMerkleization(values, trieHasher);
}
```
