---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/hybrid-states.ts#L1-L110
title: packages/jam/database-fjall/hybrid-states.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 3976bb97d9d10755c9f42bca7f1607c5fe9e066c20f8b1d0baf9f5496f43d3cc
language: typescript
---
`packages/jam/database-fjall/hybrid-states.ts` (lines 1–110)

```typescript
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
import { FjallRoot, type FjallRootOptions, type Partition, toUint8Array } from "./root.js";

const logger = Logger.new(import.meta.filename, "db");

/**
 * One open fjall keyspace together with its content-addressed `values`
 * partition.
 *
 * Opening the keyspace is the slow part, so the fuzz target opens one session
 * per run and reuses it for every reset (see `HybridSerializedStates.fromSession`).
 * The values partition is immutable - the key is the hash of the value - so it
 * is fine that values pile up across resets, the unreferenced ones just sit
 * there unused.
 */
export class FjallValuesSession {
  private constructor(
    private readonly root: FjallRoot,
    /** Shared content-addressed values partition, reused across resets. */
    readonly values: Partition,
  ) {}

  /** Open (or create) the keyspace at `dbPath` and its `values` partition. */
  static async open(dbPath: string, options: FjallRootOptions = {}): Promise<FjallValuesSession> {
    if (options.readOnly === true) {
      throw new Error("FjallValuesSession requires a writable keyspace.");
    }
    const root = await FjallRoot.open(dbPath, options);
    try {
      const values = await root.writablePartition("values");
      return new FjallValuesSession(root, values);
    } catch (e) {
      await root.close();
      throw e;
    }
  }

  /** Flush the journal to disk (a no-op for ephemeral keyspaces). */
  async persist(): Promise<void> {
    await this.root.persist();
  }

  /** Size of the keyspace directory on disk, in bytes. */
  sizeInBytes(): number | null {
    return this.root.sizeInBytes();
  }

  /** Release the keyspace handle (skips the sync-all fsync when ephemeral). */
  async close(): Promise<void> {
    await this.root.close();
  }
}

/**
 * Hybrid serialized-states db (fjall variant).
 *
 * States (leafs) are kept in memory, only the large values go to fjall on disk.
 * Reads hit fjall directly, which keeps its own bounded block cache. Meant for
 * long fuzzing, used together with pruning so the heap stays bounded.
 *
 * Construction is async, and value writes are flushed explicitly, because fjall
 * has no transaction primitive.
 *
 * Values that no longer belong to any surviving state are removed from fjall,
 * decided by in-memory refcounting (`ValueRefs`) driven by the importer's
 * finality signal. Counts are not persisted: this db cannot resume from disk
 * anyway (the leaf sets live in memory), so values left over by a previous run
 * are never collected. An instance backed by a shared session (fuzz reset
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
```
