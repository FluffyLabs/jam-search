---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/config.ts#L216-L237
title: packages/workers/api-node/config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 2
chunk_total: 3
content_sha: abdd7e164f48e24a959e2a07ba1744974609edd2379da6460deacf99296b3ca4
language: typescript
---
`packages/workers/api-node/config.ts` (lines 216–237)

```typescript
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
