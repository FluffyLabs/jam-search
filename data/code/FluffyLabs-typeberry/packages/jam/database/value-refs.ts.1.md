---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database/value-refs.ts#L86-L200
title: packages/jam/database/value-refs.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 9cb996b38a30ed32559f5cd507d011fe11e9ab472e0bddb9891c2ed9439f790c
language: typescript
---
`packages/jam/database/value-refs.ts` (lines 86–200)

```typescript
export class ValueRefs {
  constructor(private readonly reader: ValueRefsReader) {}

  /** Record values referenced by the genesis / initial finalized state. */
  onInitial(inserted: ValueHash[]): ValueRefsUpdate {
    const update = new UpdateBuilder(this.reader);
    for (const v of inserted) {
      update.incFinalized(v);
    }
    return update.build();
  }

  /**
   * Record a freshly imported, not-yet-finalized block.
   *
   * Importing the same header twice is a no-op, otherwise the second import
   * would double-count `pending` references and pin the values forever.
   */
  onImport(header: HeaderHash, delta: ValueDelta): ValueRefsUpdate {
    const update = new UpdateBuilder(this.reader);
    if (update.getDelta(header) !== undefined) {
      return update.build();
    }
    update.setDelta(header, delta);
    for (const v of delta.inserted) {
      update.incPending(v);
    }
    return update.build();
  }

  /**
   * Apply the value deltas of newly finalized blocks, in finalized (ancestor-first) order.
   *
   * Moves each inserted value from `pending` to `finalized`, drops `finalized`
   * references for removed values, and collects anything that becomes unreferenced.
   */
  commitFinalized(headers: HeaderHash[]): ValueRefsUpdate {
    const update = new UpdateBuilder(this.reader);
    for (const header of headers) {
      const delta = update.getDelta(header);
      if (delta === undefined) {
        // already committed, or not tracked (e.g. genesis)
        continue;
      }
      for (const v of delta.inserted) {
        update.incFinalized(v);
        update.decPending(v);
      }
      for (const v of delta.removed) {
        update.decFinalized(v);
      }
      update.removeDelta(header);
    }
    return update.build();
  }

  /**
   * Release the speculative references of a state being discarded.
   *
   * For a header that was still unfinalized (a dead fork) the returned update
   * releases its inserted values, which may become collectable. For an already
   * finalized state the update is empty (check with `isEmptyUpdate`): its delta
   * was consumed on finality and its values are accounted for in `finalized`.
   */
  releaseUnfinalized(header: HeaderHash): ValueRefsUpdate {
    const update = new UpdateBuilder(this.reader);
    const delta = update.getDelta(header);
    if (delta === undefined) {
      return update.build();
    }
    for (const v of delta.inserted) {
      update.decPending(v);
    }
    update.removeDelta(header);
    return update.build();
  }
}

/**
 * Accumulates mutations of a single operation as an overlay over the reader,
 * so that later steps observe earlier ones (e.g. several blocks finalized at once).
 */
class UpdateBuilder {
  private readonly finalized: HashDictionary<ValueHash, number> = HashDictionary.new();
  private readonly pending: HashDictionary<ValueHash, number> = HashDictionary.new();
  private readonly setDeltas: HashDictionary<HeaderHash, ValueDelta> = HashDictionary.new();
  private readonly removedDeltas: HashDictionary<HeaderHash, HeaderHash> = HashDictionary.new();
  /** Values that lost a reference and may need removal - verified against final counts in `build`. */
  private readonly removalCandidates: HashDictionary<ValueHash, ValueHash> = HashDictionary.new();

  constructor(private readonly reader: ValueRefsReader) {}

  getDelta(header: HeaderHash): ValueDelta | undefined {
    if (this.removedDeltas.has(header)) {
      return undefined;
    }
    return this.setDeltas.get(header) ?? this.reader.getDelta(header);
  }

  setDelta(header: HeaderHash, delta: ValueDelta): void {
    this.setDeltas.set(header, delta);
  }

  removeDelta(header: HeaderHash): void {
    this.removedDeltas.set(header, header);
  }

  incFinalized(v: ValueHash): void {
    this.finalized.set(v, this.getFinalized(v) + 1);
  }

  decFinalized(v: ValueHash): void {
    this.finalized.set(v, Math.max(0, this.getFinalized(v) - 1));
    this.removalCandidates.set(v, v);
  }
```
