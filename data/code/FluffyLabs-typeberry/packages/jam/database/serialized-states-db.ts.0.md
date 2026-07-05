---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database/serialized-states-db.ts#L1-L95
title: packages/jam/database/serialized-states-db.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 2
content_sha: c0f87f3c8ce17c907490d233277def89f5d105afd7e952160ae41a50cc696b2c
language: typescript
---
`packages/jam/database/serialized-states-db.ts` (lines 1–95)

```typescript
import type { HeaderHash, StateRootHash } from "@typeberry/block";
import type { BytesBlob } from "@typeberry/bytes";
import { HashDictionary, SortedSet } from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import { Blake2b } from "@typeberry/hash";
import type { State } from "@typeberry/state/state.js";
import type { ServicesUpdate } from "@typeberry/state/state-update.js";
import {
  SerializedState,
  type StateEntries,
  StateEntryUpdateAction,
  serializeStateUpdate,
} from "@typeberry/state-merkleization";
import { type LeafNode, leafComparator, type ValueHash } from "@typeberry/trie";
import { OK, Result } from "@typeberry/utils";
import { LeafDb } from "./leaf-db.js";
import { updateLeafs } from "./leaf-db-update.js";
import type { InitStatesDb, StatesDb, StateUpdateError } from "./states.js";
import { InMemoryValueRefsStore, ValueRefs, type ValueRefsUpdate } from "./value-refs.js";

/** Abstract serialized-states db. */
export type SerializedStatesDb = StatesDb<SerializedState<LeafDb>> & InitStatesDb<StateEntries>;

/** In-memory serialized-states db. */
export class InMemorySerializedStates implements StatesDb<SerializedState<LeafDb>>, InitStatesDb<StateEntries> {
  private readonly db: HashDictionary<HeaderHash, SortedSet<LeafNode>> = HashDictionary.new();
  private readonly valuesDb: HashDictionary<ValueHash, BytesBlob> = HashDictionary.new();
  private readonly refsStore = new InMemoryValueRefsStore();
  private readonly refs = new ValueRefs(this.refsStore);

  static async new({ chainSpec }: { chainSpec: ChainSpec }) {
    const blake2b = await Blake2b.createHasher();
    return new InMemorySerializedStates(chainSpec, blake2b);
  }

  static withHasher({ chainSpec, blake2b }: { chainSpec: ChainSpec; blake2b: Blake2b }) {
    return new InMemorySerializedStates(chainSpec, blake2b);
  }

  private constructor(
    private readonly spec: ChainSpec,
    private readonly blake2b: Blake2b,
  ) {}

  async insertInitialState(headerHash: HeaderHash, entries: StateEntries): Promise<Result<OK, StateUpdateError>> {
    // convert state entries into leafdb
    const { values, leafs } = updateLeafs(
      SortedSet.fromArray(leafComparator, []),
      this.blake2b,
      Array.from(entries, (x) => [StateEntryUpdateAction.Insert, x[0], x[1]]),
    );

    // insert values to the db.
    for (const val of values) {
      this.valuesDb.set(val[0], val[1]);
    }

    this.db.set(headerHash, leafs);
    this.applyRefs(this.refs.onInitial(values.map((v) => v[0])));
    return Result.ok(OK);
  }

  async getStateRoot(state: SerializedState<LeafDb>): Promise<StateRootHash> {
    return state.backend.getStateRoot(this.blake2b);
  }

  async updateAndSetState(
    header: HeaderHash,
    state: SerializedState<LeafDb>,
    update: Partial<State & ServicesUpdate>,
  ): Promise<Result<OK, StateUpdateError>> {
    const blake2b = this.blake2b;
    const updatedValues = serializeStateUpdate(this.spec, blake2b, update);
    // make sure to clone the leafs before writing, since the collection is re-used.
    const newLeafs = SortedSet.fromSortedArray(leafComparator, state.backend.leafs.array);
    const { values, removed, leafs } = updateLeafs(newLeafs, blake2b, updatedValues);
    // make sure to reset the cache and re-create leafsdb lookup
    state.updateBackend(LeafDb.fromLeaves(leafs, state.backend.db));

    // insert values to the db
    // valuesdb can be shared between all states because it's just
    // <valuehash> -> <value> mapping and existence is managed by value
    // refcounting, driven by the per-block deltas recorded below.
    for (const val of values) {
      this.valuesDb.set(val[0], val[1]);
    }

    // store new set of leaves
    this.db.set(header, leafs);
    this.applyRefs(this.refs.onImport(header, { inserted: values.map((v) => v[0]), removed }));

    return Result.ok(OK);
  }

  getState(header: HeaderHash): SerializedState<LeafDb> | null {
```
