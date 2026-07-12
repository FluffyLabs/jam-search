---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/hybrid-states.ts#L103-L194
title: packages/jam/database-fjall/hybrid-states.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 1e1e9aa9dd315e03121c11520536b368fe8fd7306a13cdb52858a0242e90d19f
language: typescript
---
`packages/jam/database-fjall/hybrid-states.ts` (lines 103–194)

```typescript
 * are never collected. An instance backed by a shared keyspace (fuzz reset
 * reuse) only ever prunes values it inserted itself, since its refcounts start
 * empty - values left behind by earlier resets stay untouched.
 */
export class HybridSerializedStates implements StatesDb<SerializedState<LeafDb>>, InitStatesDb<StateEntries> {
  static async new({
    spec,
    blake2b,
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

  /** Create a db over an already-open keyspace owned by the caller. */
  static async fromRoot(spec: ChainSpec, blake2b: Blake2b, root: FjallRoot): Promise<HybridSerializedStates> {
    const session = await FjallValuesSession.fromRoot(root);
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
```
