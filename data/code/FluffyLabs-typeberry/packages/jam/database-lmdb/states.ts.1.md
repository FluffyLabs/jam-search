---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-lmdb/states.ts#L79-L168
title: packages/jam/database-lmdb/states.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 2
content_sha: b1fdaf71c3b5cd57fa78644bb59155728299fd0f8819b829e3a6d7dcaf0251fa
language: typescript
---
`packages/jam/database-lmdb/states.ts` (lines 79–168)

```typescript
    this.states = this.root.subDb("states");
    this.values = this.root.subDb("values");
  }

  async insertInitialState(
    headerHash: HeaderHash,
    serializedState: StateEntries,
  ): Promise<Result<OK, StateUpdateError>> {
    return await this.updateAndCommit(
      headerHash,
      SortedSet.fromArray<LeafNode>(leafComparator, []),
      Array.from(serializedState, (x) => [StateEntryUpdateAction.Insert, x[0], x[1]]),
    );
  }

  private async updateAndCommit(
    headerHash: HeaderHash,
    leafs: SortedSet<LeafNode>,
    data: Iterable<[StateEntryUpdateAction, StateKey | TruncatedHash, BytesBlob]>,
  ): Promise<Result<OK, StateUpdateError>> {
    const { values } = updateLeafs(leafs, this.blake2b, data);
    // TODO [ToDr] could be optimized to already have leaves written to one big chunk
    // (we could pre-allocate one buffer for all the leafs)
    const stateLeafs = BytesBlob.blobFromParts(leafs.array.map((x) => x.node.raw));
    // now we have the leaves and the values, so let's write it down to the DB.
    const statesWrite = this.states.put(headerHash.raw, stateLeafs.raw);
    const valuesWrite = this.values.transaction(() => {
      for (const [hash, val] of values) {
        this.values.put(hash.raw, val.raw);
      }
    });

    try {
      await Promise.all([valuesWrite, statesWrite]);
    } catch (e) {
      logger.error`${e}`;
      return Result.error(StateUpdateError.Commit, () => `Failed to commit state update: ${e}`);
    }
    return Result.ok(OK);
  }

  async updateAndSetState(
    headerHash: HeaderHash,
    state: SerializedState<LeafDb>,
    update: Partial<State & ServicesUpdate>,
  ): Promise<Result<OK, StateUpdateError>> {
    const updatedValues = serializeStateUpdate(this.spec, this.blake2b, update);
    // and finally we insert new values and store leaves in the DB.
    const res = await this.updateAndCommit(headerHash, state.backend.leafs, updatedValues);
    if (res.isOk) {
      // update the internal backend with new leaves.
      state.updateBackend(LeafDb.fromLeaves(state.backend.leafs, state.backend.db));
    }
    return res;
  }

  async getStateRoot(state: SerializedState<LeafDb>): Promise<StateRootHash> {
    return state.backend.getStateRoot(this.blake2b);
  }

  getState(root: HeaderHash): SerializedState<LeafDb> | null {
    const leafNodes = this.states.get(root.raw);
    // we don't have that particular state.
    if (leafNodes === undefined) {
      return null;
    }
    const values = this.values;
    const leafDbResult = LeafDb.fromLeavesBlob(BytesBlob.blobFrom(leafNodes), {
      get(key: ValueHash): Uint8Array {
        const val = values.get(key.raw);
        if (val === undefined) {
          throw new Error(`Missing required value: ${key} in the DB`);
        }
        return val;
      },
    });
    if (leafDbResult.isError) {
      throw new Error(`Inconsistent DB. Invalid leaf nodes for ${root}: ${resultToString(leafDbResult)}`);
    }
    return SerializedState.new(this.spec, this.blake2b, leafDbResult.ok);
  }

  markUnused(header: HeaderHash): void {
    this.states.removeSync(header.raw);
  }

  async close() {
    await Promise.all([this.states.close(), this.values.close()]);
  }
}
```
