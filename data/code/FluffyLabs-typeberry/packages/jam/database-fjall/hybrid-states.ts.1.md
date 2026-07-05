---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/hybrid-states.ts#L101-L196
title: packages/jam/database-fjall/hybrid-states.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 89ca4fbef92b5d5957873516cc6a1124873ee281c00ed4aea9edfe602e18ebf9
language: typescript
---
`packages/jam/database-fjall/hybrid-states.ts` (lines 101–196)

```typescript
    dbPath,
    ephemeral,
    cacheSizeBytes,
  }: {
    spec: ChainSpec;
    blake2b: Blake2b;
    dbPath: string;
    ephemeral?: boolean;
    cacheSizeBytes?: number;
  }): Promise<HybridSerializedStates> {
    const session = await FjallValuesSession.open(dbPath, { ephemeral, cacheSizeBytes });
    // This instance owns the session it just opened, so its `close()` closes it.
    return new HybridSerializedStates(spec, blake2b, session, true);
  }

  /**
   * Wrap an already-open `FjallValuesSession` and reuse its keyspace.
   *
   * The new instance starts with its own empty in-memory leaf sets but shares
   * the values partition on disk. Its `close()` does not close the session, the
   * session owner closes it once. The fuzz target uses this to keep one keyspace
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
  private readonly refsStore = new InMemoryValueRefsStore();
  private readonly refs = new ValueRefs(this.refsStore);
  // Queue of not-yet-committed value removals, awaited on close.
  private pendingCleanup: Promise<unknown> = Promise.resolve();

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
    this.applyRefs(this.refs.onInitial(values.map((v) => v[0])));
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
```
