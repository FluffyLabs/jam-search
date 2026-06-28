---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/config.ts#L219-L250
title: packages/workers/api-node/config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 2
chunk_total: 3
content_sha: bd2bce7937f5efdf24aeaa1e3822fd6821f8d2d0d65a3e34d9c48ab1a3fc19fe
language: typescript
---
`packages/workers/api-node/config.ts` (lines 219–250)

```typescript
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

  openDatabase(_options: { readonly: boolean } = { readonly: true }): RootDb<BlocksDb, SerializedStatesDb> {
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
