---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/finality.ts#L104-L150
title: packages/workers/importer/finality.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 17a82a651e07003ce5b8937fd1fdfc2481035b231ba3453cab79616b58264175
language: typescript
---
`packages/workers/importer/finality.ts` (lines 104–150)

```typescript
    const finalizedIdx = extendedChain.length - 1 - this.depth;
    const finalizedHash = extendedChain[finalizedIdx];
    // Everything up to (and including) that index becomes finalized now.
    const finalizedChain = extendedChain.slice(0, finalizedIdx + 1);

    // Collect prunable hashes and rebuild the unfinalized set.
    // The previously finalized block's state is no longer needed.
    const prunable: HeaderHash[] = [this.lastFinalizedHash];
    const newlyFinalized: HeaderHash[] = [];
    const newUnfinalized: Chain[] = [];

    for (const chain of this.unfinalized) {
      // Find the finalized block in this chain.
      const finIdx = chain.findIndex((h) => h.isEqualTo(finalizedHash));

      if (finIdx !== -1) {
        // Chain contains the finalized block — it's still alive.
        // Collect newly finalized blocks only once (forks share prefixes).
        if (newlyFinalized.length === 0) {
          for (let i = 0; i <= finIdx; i++) {
            newlyFinalized.push(chain[i]);
          }
        }
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

    return { finalizedHash, finalizedChain, newlyFinalizedHeaders: newlyFinalized, prunableStateHashes: prunable };
  }
}
```
