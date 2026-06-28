---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/hybrid-states.ts#L1-L108
title: packages/jam/database-fjall/hybrid-states.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 3
content_sha: 27506e2aa880c6e6af2ec3109a886a971d8300c16604f988a4062c54dfe38765
language: typescript
---
`packages/jam/database-fjall/hybrid-states.ts` (lines 1–108)

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
    const root = await FjallRoot.open(dbPath, options);
    const values = await root.partition("values");
    return new FjallValuesSession(root, values);
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
    const session = await FjallValuesSession.open(dbPath, { ephemeral, cacheSizeBytes });
    // This instance owns the session it just opened, so its `close()` closes it.
    return new HybridSerializedStates(spec, blake2b, session, true);
  }

  /**
```
