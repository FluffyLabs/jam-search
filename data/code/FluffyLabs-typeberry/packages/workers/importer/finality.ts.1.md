---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/finality.ts#L106-L137
title: packages/workers/importer/finality.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 2
content_sha: 32db7a42141d0ffba02b4464c65e57c1d5093055d0c9ae7511864b3ab3d0dc8d
language: typescript
---
`packages/workers/importer/finality.ts` (lines 106–137)

```typescript
    const newUnfinalized: Chain[] = [];

    for (const chain of this.unfinalized) {
      // Find the finalized block in this chain.
      const finIdx = chain.findIndex((h) => h.isEqualTo(finalizedHash));

      if (finIdx !== -1) {
        // Chain contains the finalized block — it's still alive.
        // Prune states for blocks before the finalized block.
        for (let i = 0; i < finIdx; i++) {
          prunable.push(chain[i]);
        }
        // Keep blocks after the finalized block.
        const remaining = chain.slice(finIdx + 1);
        if (remaining.length > 0) {
          newUnfinalized.push(remaining);
        }
      } else {
        // Dead fork — branches from a block that is no longer finalized.
        // Prune all its states.
        for (const h of chain) {
          prunable.push(h);
        }
      }
    }

    this.lastFinalizedHash = finalizedHash;
    this.unfinalized = newUnfinalized;

    return { finalizedHash, prunableStateHashes: prunable };
  }
}
```
