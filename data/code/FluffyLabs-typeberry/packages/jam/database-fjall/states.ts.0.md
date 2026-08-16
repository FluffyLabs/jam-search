---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/states.ts#L1-L102
title: packages/jam/database-fjall/states.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 7ffde31462adcdeba3d0a1697eda94de8e15780e3b9e0557c68e4888e57681cc
language: typescript
---
`packages/jam/database-fjall/states.ts` (lines 1–102)

```typescript
import type { HeaderHash, StateRootHash } from "@typeberry/block";
import { BytesBlob } from "@typeberry/bytes";
import { SortedSet } from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import {
  type InitStatesDb,
  LeafDb,
  type StatesDb,
  StateUpdateError,
  updateLeafs,
  type ValuesDb,
} from "@typeberry/database";
import type { Blake2b, TruncatedHash } from "@typeberry/hash";
import { Logger } from "@typeberry/logger";
import type { ServicesUpdate, State } from "@typeberry/state";
import type { StateEntries, StateKey } from "@typeberry/state-merkleization";
import { SerializedState, StateEntryUpdateAction, serializeStateUpdate } from "@typeberry/state-merkleization";
import { type LeafNode, leafComparator, type ValueHash } from "@typeberry/trie";
import { OK, Result, resultToString } from "@typeberry/utils";
import { type FjallPartition, type FjallRoot, type Partition, toUint8Array } from "./root.js";

const logger = Logger.new(import.meta.filename, "db");

/** fjall-backed full on-disk serialized state storage. */
export class FjallStates implements StatesDb<SerializedState<LeafDb>>, InitStatesDb<StateEntries> {
  static async open(spec: ChainSpec, blake2b: Blake2b, root: FjallRoot): Promise<FjallStates> {
    const [states, values] = await Promise.all([root.partition("states"), root.partition("values")]);
    return new FjallStates(spec, blake2b, root, states, values);
  }

  private readonly valuesDb: ValuesDb;
  private pendingPrune: Promise<unknown> = Promise.resolve();

  private constructor(
    private readonly spec: ChainSpec,
    private readonly blake2b: Blake2b,
    private readonly root: FjallRoot,
    private readonly states: FjallPartition,
    private readonly values: FjallPartition,
  ) {
    this.valuesDb = { get: (key: ValueHash) => this.readValue(key) };
  }

  async insertInitialState(headerHash: HeaderHash, entries: StateEntries): Promise<Result<OK, StateUpdateError>> {
    return await this.updateAndCommit(
      headerHash,
      SortedSet.fromArray<LeafNode>(leafComparator, []),
      Array.from(entries, (x) => [StateEntryUpdateAction.Insert, x[0], x[1]]),
    );
  }

  async updateAndSetState(
    headerHash: HeaderHash,
    state: SerializedState<LeafDb>,
    update: Partial<State & ServicesUpdate>,
  ): Promise<Result<OK, StateUpdateError>> {
    const updatedValues = serializeStateUpdate(this.spec, this.blake2b, update);
    const newLeafs = SortedSet.fromSortedArray(leafComparator, state.backend.leafs.array);
    const res = await this.updateAndCommit(headerHash, newLeafs, updatedValues);
    if (res.isOk) {
      state.updateBackend(LeafDb.fromLeaves(newLeafs, this.valuesDb));
    }
    return res;
  }

  async getStateRoot(state: SerializedState<LeafDb>): Promise<StateRootHash> {
    return state.backend.getStateRoot(this.blake2b);
  }

  getState(headerHash: HeaderHash): SerializedState<LeafDb> | null {
    const leafNodes = toUint8Array(this.states.get(headerHash.raw));
    if (leafNodes === null) {
      return null;
    }

    const leafDbResult = LeafDb.fromLeavesBlob(BytesBlob.blobFrom(leafNodes), this.valuesDb);
    if (leafDbResult.isError) {
      throw new Error(`Inconsistent DB. Invalid leaf nodes for ${headerHash}: ${resultToString(leafDbResult)}`);
    }
    return SerializedState.new(this.spec, this.blake2b, leafDbResult.ok);
  }

  commitFinalized(_headers: HeaderHash[]): void {
    // Values are never pruned here. This db survives restarts, so refcounting
    // would need counts persisted (and crash-consistent) alongside the values.
  }

  markUnused(headerHash: HeaderHash): void {
    this.pendingPrune = this.pendingPrune
      .then(() => writable(this.states, this.root).remove(headerHash.raw))
      .catch((e) => logger.warn`Failed to prune state ${headerHash}: ${e}`);
  }

  diskSizeInBytes(): number | null {
    return this.root.sizeInBytes();
  }

  async close() {
    await this.pendingPrune;
  }

  private async updateAndCommit(
```
