---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/hybrid-states.ts#L103-L208
title: packages/jam/database-fjall/hybrid-states.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 3
content_sha: d5d401b30b816ccf3e7b187783757cfa5ac7884cc10a484bf4ca83c533be6df9
language: typescript
---
`packages/jam/database-fjall/hybrid-states.ts` (lines 103–208)

```typescript
   * across resets and only rebuild the in-memory state for each vector.
   */
  static fromSession(spec: ChainSpec, blake2b: Blake2b, session: FjallValuesSession): HybridSerializedStates {
    return new HybridSerializedStates(spec, blake2b, session, false);
  }

  private readonly inMemStates: HashDictionary<HeaderHash, SortedSet<LeafNode>> = HashDictionary.new();
  // A single shared values accessor reused by every `LeafDb` we hand out.
  private readonly valuesDb: ValuesDb;
  /** Shared content-addressed values partition (owned by `session`). */
  private readonly values: Partition;

  private constructor(
    private readonly spec: ChainSpec,
    private readonly blake2b: Blake2b,
    private readonly session: FjallValuesSession,
    /** Whether `close()` should close the underlying session. */
    private readonly ownsSession: boolean,
  ) {
    this.values = session.values;
    this.valuesDb = { get: (key: ValueHash) => this.readValue(key) };
  }

  async insertInitialState(headerHash: HeaderHash, entries: StateEntries): Promise<Result<OK, StateUpdateError>> {
    const { values, leafs } = updateLeafs(
      SortedSet.fromArray(leafComparator, []),
      this.blake2b,
      Array.from(entries, (x) => [StateEntryUpdateAction.Insert, x[0], x[1]]),
    );
    const res = await this.writeValues(values);
    if (res.isError) {
      return res;
    }
    this.inMemStates.set(headerHash, leafs);
    return Result.ok(OK);
  }

  async updateAndSetState(
    header: HeaderHash,
    state: SerializedState<LeafDb>,
    update: Partial<State & ServicesUpdate>,
  ): Promise<Result<OK, StateUpdateError>> {
    const updatedValues = serializeStateUpdate(this.spec, this.blake2b, update);
    // Clone the leaf set before mutating: the previous state keeps using its own.
    const newLeafs = SortedSet.fromSortedArray(leafComparator, state.backend.leafs.array);
    const { values, leafs } = updateLeafs(newLeafs, this.blake2b, updatedValues);
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

  markUnused(header: HeaderHash): void {
    // We only remove the state from memory - values are not pruned at all,
    // but since they are stored on disk we should be safe.
    this.inMemStates.delete(header);
  }

  diskSizeInBytes(): number | null {
    return this.session.sizeInBytes();
  }

  async close() {
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
      const entries = values.map(([hash, val]) => ({ key: hash.raw, value: val.raw }));
      await this.values.insertBatch(entries);
      await this.session.persist();
    } catch (e) {
      logger.error`${e}`;
      return Result.error(StateUpdateError.Commit, () => `Failed to commit values: ${e}`);
    }
    return Result.ok(OK);
  }

```
