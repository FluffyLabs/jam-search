---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/hybrid-states.ts#L191-L270
title: packages/jam/database-fjall/hybrid-states.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 3781eb237e6c1d3cdd6be4c0e6a4b9518339f9f1b4f2b97f0876380d5c4adc07
language: typescript
---
`packages/jam/database-fjall/hybrid-states.ts` (lines 191–270)

```typescript
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

  diskSizeInBytes(): number | null {
    return this.session.sizeInBytes();
  }

  /** Apply a refcounting update and remove values that lost their last reference. */
  private applyRefs(update: ValueRefsUpdate): void {
    this.refsStore.apply(update);
    if (update.removeValues.length === 0) {
      return;
    }
    // Queued, not awaited: a failed removal only leaks a value. No explicit
    // persist - removals are flushed together with the next value write.
    this.pendingCleanup = this.pendingCleanup
      .then(() => Promise.all(update.removeValues.map((v) => this.values.remove(v.raw))))
      .catch((e) => {
        logger.error`Failed to remove unreferenced values: ${e}`;
      });
  }

  async close() {
    // Finish any queued value removals before tearing down (or releasing) the
    // session - they operate on the shared `values` partition.
    await this.pendingCleanup;
    // Instances backed by a shared session (fuzz reset reuse) keep the keyspace
    // open for the next reset. The session owner closes it once.
    if (this.ownsSession) {
      await this.session.close();
    }
  }

  /** Write new large values to fjall in a single batch, then flush. */
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
      const entries = values.map(([hash, val]) => ({ key: hash.raw, value: val.raw }));
      await this.values.insertBatch(entries);
      await this.session.persist();
    } catch (e) {
      logger.error`${e}`;
      return Result.error(StateUpdateError.Commit, () => `Failed to commit values: ${e}`);
    }
    return Result.ok(OK);
  }

  /** Read a value from fjall. */
  private readValue(key: ValueHash): Uint8Array {
    const val = toUint8Array(this.values.get(key.raw));
    if (val === null) {
      throw new Error(`Missing value at key: ${key}`);
    }
    return val;
  }
}
```
