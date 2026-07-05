---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-lmdb/hybrid-states.ts#L105-L206
title: packages/jam/database-lmdb/hybrid-states.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: d3b53bc47284dfaa1d1f48c69c01586ed20371a14c206a8e1a2ef9f07ef333ba
language: typescript
---
`packages/jam/database-lmdb/hybrid-states.ts` (lines 105–206)

```typescript
    // Clone the leaf set before mutating: the previous state keeps using its own.
    const newLeafs = SortedSet.fromSortedArray(leafComparator, state.backend.leafs.array);
    const { values, removed, leafs } = updateLeafs(newLeafs, this.blake2b, updatedValues);
    const res = await this.writeValues(values);
    if (res.isError) {
      // Leave the caller's state untouched: its new leaves would reference
      // values that never reached disk.
      return res;
    }
    // Re-create the lookup with the shared values accessor only once the new
    // values are durably written.
    state.updateBackend(LeafDb.fromLeaves(leafs, this.valuesDb));
    this.inMemStates.set(header, leafs);
    this.applyRefs(this.refs.onImport(header, { inserted: values.map((v) => v[0]), removed }));
    return Result.ok(OK);
  }

  async getStateRoot(state: SerializedState<LeafDb>): Promise<StateRootHash> {
    return state.backend.getStateRoot(this.blake2b);
  }

  getState(header: HeaderHash): SerializedState<LeafDb> | null {
    const leafs = this.inMemStates.get(header);
    if (leafs === undefined) {
      return null;
    }
    const leafDb = LeafDb.fromLeaves(leafs, this.valuesDb);
    return SerializedState.new(this.spec, this.blake2b, leafDb);
  }

  commitFinalized(headers: HeaderHash[]): void {
    this.applyRefs(this.refs.commitFinalized(headers));
  }

  markUnused(header: HeaderHash): void {
    // Release the speculative references first (a no-op for finalized states,
    // whose deltas were already consumed by `commitFinalized`).
    this.applyRefs(this.refs.releaseUnfinalized(header));
    this.inMemStates.delete(header);
  }

  /** Apply a refcounting update and remove values that lost their last reference. */
  private applyRefs(update: ValueRefsUpdate): void {
    this.refsStore.apply(update);
    if (update.removeValues.length === 0) {
      return;
    }
    // Queued, not awaited: a failed removal only leaks a value.
    this.pendingCleanup = this.pendingCleanup
      .then(() =>
        this.lmdbValues.transaction(() => {
          for (const v of update.removeValues) {
            this.lmdbValues.remove(v.raw);
          }
        }),
      )
      .catch((e) => {
        logger.error`Failed to remove unreferenced values: ${e}`;
      });
  }

  diskSizeInBytes(): number | null {
    return this.root.sizeInBytes();
  }

  async close() {
    await this.pendingCleanup;
    await this.lmdbValues.close();
    await this.root.close();
  }

  /** Write new large values to LMDB in one transaction. */
  private async writeValues(values: [ValueHash, BytesBlob][]): Promise<Result<OK, StateUpdateError>> {
    if (values.length === 0) {
      return Result.ok(OK);
    }
    try {
      // Flush queued removals first: a pending cleanup might be about to delete
      // a content hash we are re-inserting now. Writing behind it keeps the
      // re-inserted value on disk (removals are only queued at refcount 0, so
      // none can be queued for a value still referenced).
      await this.pendingCleanup;
      await this.lmdbValues.transaction(() => {
        for (const [hash, val] of values) {
          this.lmdbValues.put(hash.raw, val.raw);
        }
      });
    } catch (e) {
      return Result.error(StateUpdateError.Commit, () => `Failed to commit values: ${e}`);
    }
    return Result.ok(OK);
  }

  /** Read a value from LMDB. */
  private readValue(key: ValueHash): Uint8Array {
    const val = this.lmdbValues.get(key.raw);
    if (val === undefined) {
      throw new Error(`Missing value at key: ${key}`);
    }
    return val;
  }
}
```
