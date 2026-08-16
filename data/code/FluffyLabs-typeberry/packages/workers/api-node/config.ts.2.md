---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/config.ts#L244-L331
title: packages/workers/api-node/config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 2
chunk_total: 3
content_sha: f5a089966af97eb0c0fe829d7ec89ad19e4ec3abeb714808a2407b0f4334ead0
language: typescript
---
`packages/workers/api-node/config.ts` (lines 244–331)

```typescript
    // opening/closing db doesn't do anything, we persist the state.
    return {
      getBlocksDb: () => this.blocks,
      getStatesDb: () => this.states,
      close: async () => {},
    };
  }
}

/** Persistent values store backing the hybrid config. */
export type HybridBackend = "fjall";

/**
 * Hybrid worker config for the fuzz target: in-memory blocks and leaf sets,
 * but large values persisted to disk via fjall.
 *
 * fjall opens its keyspace asynchronously, that is why `new` here is async.
 *
 * Like `InMemWorkerConfig`, the blocks and leaf sets are shared across the
 * open/close/reopen dance that genesis init performs, so `openDatabase`
 * returns the same instances and a no-op close. The values store is opened once
 * here and closed by `HybridSerializedStates.close()` at importer teardown.
 *
 * In-process only: it holds shared mutable state (the in-memory leaf
 * dictionary) and so is not thread-transferable. The fuzz target runs the
 * importer in-process via `createImporter`, not in a spawned worker.
 */
export class HybridWorkerConfig<T = undefined> implements WorkerConfig<T, BlocksDb, SerializedStatesDb> {
  static async new<T>({
    nodeName,
    chainSpec,
    workerParams,
    blake2b,
    dbPath,
    ephemeral = false,
    compression = true,
    sharedFjallKeyspace,
  }: {
    nodeName: string;
    chainSpec: ChainSpec;
    workerParams: T;
    blake2b: Blake2b;
    dbPath: string;
    ephemeral?: boolean;
    compression?: boolean;
    /**
     * Reuse an already-open fjall keyspace instead of opening a fresh keyspace.
     * The fuzz target opens one per run and passes it on every reset, so only
     * the in-memory blocks/leaf sets are rebuilt per vector.
     */
    sharedFjallKeyspace?: FjallRoot;
  }): Promise<HybridWorkerConfig<T>> {
    // The values store is created once here and shared across reopen. When a
    // keyspace is given (fuzz reset reuse) we wrap it instead of opening a new one.
    const states =
      sharedFjallKeyspace !== undefined
        ? await FjallHybridSerializedStates.fromRoot(chainSpec, blake2b, sharedFjallKeyspace)
        : await FjallHybridSerializedStates.new({ spec: chainSpec, blake2b, dbPath, ephemeral });
    return new HybridWorkerConfig(nodeName, chainSpec, workerParams, blake2b, dbPath, ephemeral, compression, states);
  }

  private readonly blocks: InMemoryBlocks;

  private constructor(
    public readonly nodeName: string,
    public readonly chainSpec: ChainSpec,
    public readonly workerParams: T,
    public readonly blake2b: Blake2b,
    public readonly dbPath: string,
    public readonly ephemeral: boolean,
    public readonly compression: boolean,
    private readonly states: SerializedStatesDb,
  ) {
    this.blocks = InMemoryBlocks.new();
  }

  async openDatabase(
    _options: { readonly: boolean } = { readonly: true },
  ): Promise<RootDb<BlocksDb, SerializedStatesDb>> {
    return {
      getBlocksDb: () => this.blocks,
      getStatesDb: () => this.states,
      // Leaf sets and blocks live in memory; the values store is closed via
      // states.close() at importer teardown, so this is a no-op.
      close: async () => {},
    };
  }
}
```
