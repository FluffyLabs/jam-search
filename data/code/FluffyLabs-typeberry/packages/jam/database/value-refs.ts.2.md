---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database/value-refs.ts#L194-L280
title: packages/jam/database/value-refs.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 2
chunk_total: 3
content_sha: bbf0d3a41cf2bc58c112480a78f266600759244c19fc539f2ee9ef7d512bd2a0
language: typescript
---
`packages/jam/database/value-refs.ts` (lines 194–280)

```typescript
    this.finalized.set(v, this.getFinalized(v) + 1);
  }

  decFinalized(v: ValueHash): void {
    this.finalized.set(v, Math.max(0, this.getFinalized(v) - 1));
    this.removalCandidates.set(v, v);
  }

  incPending(v: ValueHash): void {
    this.pending.set(v, this.getPending(v) + 1);
  }

  decPending(v: ValueHash): void {
    this.pending.set(v, Math.max(0, this.getPending(v) - 1));
    this.removalCandidates.set(v, v);
  }

  build(): ValueRefsUpdate {
    const removeValues: ValueHash[] = [];
    for (const v of this.removalCandidates.values()) {
      if (this.getFinalized(v) === 0 && this.getPending(v) === 0) {
        removeValues.push(v);
      }
    }
    return {
      finalizedCounts: Array.from(this.finalized),
      pendingCounts: Array.from(this.pending),
      setDeltas: Array.from(this.setDeltas),
      removeDeltas: Array.from(this.removedDeltas.keys()),
      removeValues,
    };
  }

  private getFinalized(v: ValueHash): number {
    return this.finalized.get(v) ?? this.reader.getFinalizedCount(v);
  }

  private getPending(v: ValueHash): number {
    return this.pending.get(v) ?? this.reader.getPendingCount(v);
  }
}

/**
 * In-memory refcounting store, reusable by the in-memory and hybrid states DBs
 * (the hybrids cannot resume from disk anyway, so persisting counts buys nothing).
 *
 * NOTE: `apply` does not touch the values DB - the caller owns it and must
 * handle `update.removeValues` itself.
 */
export class InMemoryValueRefsStore implements ValueRefsReader {
  private readonly finalized: HashDictionary<ValueHash, number> = HashDictionary.new();
  private readonly pending: HashDictionary<ValueHash, number> = HashDictionary.new();
  private readonly deltas: HashDictionary<HeaderHash, ValueDelta> = HashDictionary.new();

  getFinalizedCount(hash: ValueHash): number {
    return this.finalized.get(hash) ?? 0;
  }

  getPendingCount(hash: ValueHash): number {
    return this.pending.get(hash) ?? 0;
  }

  getDelta(header: HeaderHash): ValueDelta | undefined {
    return this.deltas.get(header);
  }

  apply(update: ValueRefsUpdate): void {
    applyCounts(this.finalized, update.finalizedCounts);
    applyCounts(this.pending, update.pendingCounts);
    for (const [header, delta] of update.setDeltas) {
      this.deltas.set(header, delta);
    }
    for (const header of update.removeDeltas) {
      this.deltas.delete(header);
    }
  }
}

function applyCounts(store: HashDictionary<ValueHash, number>, counts: [ValueHash, number][]): void {
  for (const [hash, count] of counts) {
    if (count === 0) {
      store.delete(hash);
    } else {
      store.set(hash, count);
    }
  }
}
```
