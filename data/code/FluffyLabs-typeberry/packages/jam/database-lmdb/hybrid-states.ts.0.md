---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-lmdb/hybrid-states.ts#L1-L107
title: packages/jam/database-lmdb/hybrid-states.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 6aac85854c2839586a3649c1486031762de3197b4b288002e9927b6238275311
language: typescript
---
`packages/jam/database-lmdb/hybrid-states.ts` (lines 1–107)

```typescript
// packages/jam/database-lmdb/hybrid-states.ts
import type { HeaderHash, StateRootHash } from "@typeberry/block";
import type { BytesBlob } from "@typeberry/bytes";
import { HashDictionary, SortedSet } from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import {
  type InitStatesDb,
  InMemoryValueRefsStore,
  LeafDb,
  type StatesDb,
  StateUpdateError,
  updateLeafs,
  ValueRefs,
  type ValueRefsUpdate,
  type ValuesDb,
} from "@typeberry/database";
import type { Blake2b } from "@typeberry/hash";
import { Logger } from "@typeberry/logger";
import type { ServicesUpdate, State } from "@typeberry/state";
import {
  SerializedState,
  type StateEntries,
  StateEntryUpdateAction,
  serializeStateUpdate,
} from "@typeberry/state-merkleization";
import { type LeafNode, leafComparator, type ValueHash } from "@typeberry/trie";
import { OK, Result } from "@typeberry/utils";
import { LmdbRoot, type SubDb } from "./root.js";

const logger = Logger.new(import.meta.filename, "db");

/**
 * Hybrid serialized-states db.
 *
 * States (leafs) are kept in-memory, but large values are persisted to lmdb.
 * Reads go straight to lmdb, which keeps its own page cache.
 * NOTE: this DB is designed for long fuzzing and to be used with pruning to
 * keep the heap usage bounded.
 *
 * Values that no longer belong to any surviving state are removed from lmdb,
 * decided by in-memory refcounting (`ValueRefs`) driven by the importer's
 * finality signal. Counts are not persisted: this db cannot resume from disk
 * anyway (the leaf sets live in memory), so values left over by a previous
 * run are never collected.
 */
export class HybridSerializedStates implements StatesDb<SerializedState<LeafDb>>, InitStatesDb<StateEntries> {
  private readonly inMemStates: HashDictionary<HeaderHash, SortedSet<LeafNode>> = HashDictionary.new();
  private readonly lmdbValues: SubDb;
  // A single shared values accessor reused by every `LeafDb` we hand out.
  private readonly valuesDb: ValuesDb;
  private readonly refsStore = new InMemoryValueRefsStore();
  private readonly refs = new ValueRefs(this.refsStore);
  // Queue of not-yet-committed value removals, awaited on close.
  private pendingCleanup: Promise<unknown> = Promise.resolve();

  static new({
    spec,
    blake2b,
    dbPath,
    readOnly,
    ephemeral,
    compression,
  }: {
    spec: ChainSpec;
    blake2b: Blake2b;
    dbPath: string;
    readOnly?: boolean;
    ephemeral?: boolean;
    compression?: boolean;
  }) {
    const root = LmdbRoot.new(dbPath, { readOnly, ephemeral, compression });
    return new HybridSerializedStates(spec, blake2b, root);
  }

  private constructor(
    private readonly spec: ChainSpec,
    private readonly blake2b: Blake2b,
    private readonly root: LmdbRoot,
  ) {
    this.lmdbValues = this.root.subDb("values");
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
```
