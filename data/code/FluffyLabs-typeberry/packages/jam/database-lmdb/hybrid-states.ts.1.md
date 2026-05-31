---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-lmdb/hybrid-states.ts#L106-L151
title: packages/jam/database-lmdb/hybrid-states.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 6cca575b0b9136ec2ce42cbd592a2abb7b273ee92e22b185ee505318367f06c7
language: typescript
---
`packages/jam/database-lmdb/hybrid-states.ts` (lines 106–151)

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
