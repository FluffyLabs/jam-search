---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/states.ts#L90-L138
title: packages/jam/database-fjall/states.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 5ffef5cfd0b5ad7e2412818f6a3f07d456f64a4a48fe200e834d1b4ea72da2de
language: typescript
---
`packages/jam/database-fjall/states.ts` (lines 90–138)

```typescript
      .catch((e) => logger.warn`Failed to prune state ${headerHash}: ${e}`);
  }

  diskSizeInBytes(): number | null {
    return this.root.sizeInBytes();
  }

  async close() {}

  private async updateAndCommit(
    headerHash: HeaderHash,
    leafs: SortedSet<LeafNode>,
    data: Iterable<[StateEntryUpdateAction, StateKey | TruncatedHash, BytesBlob]>,
  ): Promise<Result<OK, StateUpdateError>> {
    const { values } = updateLeafs(leafs, this.blake2b, data);
    const stateLeafs = BytesBlob.blobFromParts(leafs.array.map((x) => x.node.raw));

    try {
      // Preserve dependency order: values first, then leaves that may reference them.
      if (values.length > 0) {
        await writable(this.values, this.root).insertBatch(
          values.map(([hash, val]) => ({ key: hash.raw, value: val.raw })),
        );
      }
      await writable(this.states, this.root).insert(headerHash.raw, stateLeafs.raw);
      await this.root.persist();
    } catch (e) {
      logger.error`${e}`;
      return Result.error(StateUpdateError.Commit, () => `Failed to commit state update: ${e}`);
    }

    return Result.ok(OK);
  }

  private readValue(key: ValueHash): Uint8Array {
    const val = toUint8Array(this.values.get(key.raw));
    if (val === null) {
      throw new Error(`Missing required value: ${key} in the DB`);
    }
    return val;
  }
}

function writable(partition: FjallPartition, root: FjallRoot): Partition {
  if (root.readOnly) {
    throw new Error("Cannot write through a read-only fjall partition.");
  }
  return partition as Partition;
}
```
