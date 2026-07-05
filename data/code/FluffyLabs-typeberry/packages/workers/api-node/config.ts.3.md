---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/config.ts#L347-L409
title: packages/workers/api-node/config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 3
chunk_total: 4
content_sha: fae552cdeea44660e1384663129fca735efe332457e63af712e9c7d1975bb56a
language: typescript
---
`packages/workers/api-node/config.ts` (lines 347–409)

```typescript
    chainSpec,
    workerParams,
    blake2b,
    dbPath,
    ephemeral = false,
    compression = true,
    backend = "lmdb",
    sharedFjallSession,
  }: {
    nodeName: string;
    chainSpec: ChainSpec;
    workerParams: T;
    blake2b: Blake2b;
    dbPath: string;
    ephemeral?: boolean;
    compression?: boolean;
    backend?: HybridBackend;
    /**
     * Reuse an already-open fjall values session instead of opening a fresh
     * keyspace. The fuzz target opens one per run and passes it on every reset,
     * so only the in-memory blocks/leaf sets are rebuilt per vector. Ignored
     * unless `backend === "fjall"`.
     */
    sharedFjallSession?: FjallValuesSession;
  }): Promise<HybridWorkerConfig<T>> {
    // The values store is created once here and shared across reopen. When a
    // session is given (fuzz reset reuse) we wrap it instead of opening a new one.
    const states =
      backend === "fjall"
        ? sharedFjallSession !== undefined
          ? FjallHybridSerializedStates.fromSession(chainSpec, blake2b, sharedFjallSession)
          : await FjallHybridSerializedStates.new({ spec: chainSpec, blake2b, dbPath, ephemeral })
        : LmdbHybridSerializedStates.new({ spec: chainSpec, blake2b, dbPath, ephemeral, compression, readOnly: false });
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
