---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-lmdb/hybrid-states.ts#L108-L157
title: packages/jam/database-lmdb/hybrid-states.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 2
content_sha: eedc8993a2fcb6d242ab082b602a388464c9cd7e4e18a368c926277a6de65017
language: typescript
---
`packages/jam/database-lmdb/hybrid-states.ts` (lines 108–157)

```typescript
  getState(header: HeaderHash): SerializedState<LeafDb> | null {
    const leafs = this.inMemStates.get(header);
    if (leafs === undefined) {
      return null;
    }
    const leafDb = LeafDb.fromLeaves(leafs, this.valuesDb);
    return SerializedState.new(this.spec, this.blake2b, leafDb);
  }

  markUnused(header: HeaderHash): void {
    // We only remove the state from memory - values are not pruned at all,
    // but since they are stored on disk we should be safe.
    this.inMemStates.delete(header);
  }

  diskSizeInBytes(): number | null {
    return this.root.sizeInBytes();
  }

  async close() {
    await this.lmdbValues.close();
    await this.root.close();
  }

  /** Write new large values to LMDB in one transaction. */
  private async writeValues(values: [ValueHash, BytesBlob][]): Promise<Result<OK, StateUpdateError>> {
    if (values.length === 0) {
      return Result.ok(OK);
    }
    try {
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
