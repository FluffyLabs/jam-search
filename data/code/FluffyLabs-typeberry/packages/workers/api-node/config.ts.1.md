---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/config.ts#L120-L135
title: packages/workers/api-node/config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 2
content_sha: c3aaa987ba14f6b693b278bc9974926cccf6e5c7a3f81e1e0719ef120838a1f2
language: typescript
---
`packages/workers/api-node/config.ts` (lines 120–135)

```typescript
    public readonly workerParams: T,
    public readonly blake2b: Blake2b,
  ) {
    this.blocks = InMemoryBlocks.new();
    this.states = InMemorySerializedStates.withHasher({ chainSpec, blake2b });
  }

  openDatabase(_options: { readonly: boolean } = { readonly: true }): RootDb<BlocksDb, SerializedStatesDb> {
    // opening/closing db doesn't do anything, we persist the state.
    return {
      getBlocksDb: () => this.blocks,
      getStatesDb: () => this.states,
      close: async () => {},
    };
  }
}
```
