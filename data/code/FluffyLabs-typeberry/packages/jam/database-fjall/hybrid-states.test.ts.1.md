---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/hybrid-states.test.ts#L95-L126
title: packages/jam/database-fjall/hybrid-states.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: b238ddf5650d6720392f0663496726d198416f95a93e53218d5f3e5a59d0f54f
language: typescript
---
`packages/jam/database-fjall/hybrid-states.test.ts` (lines 95–126)

```typescript
      // Second "reset": a fresh states sharing the same session. Its in-memory
      // leaf set is independent (empty until it inserts)...
      const second = HybridSerializedStates.fromSession(spec, blake2b, session);
      assert.strictEqual(second.getState(headerHash), null);

      // ...but the on-disk values store is the same one, still open and usable
      // (a closed keyspace would throw here).
      await second.insertInitialState(headerHash, entries);
      const state = second.getState(headerHash);
      assert.ok(state !== null);
      assert.strictEqual(`${state.backend.get(key)}`, `${big}`);
      await second.close();
    } finally {
      await session.close();
    }
  });

  it("drops the leaf set on markUnused while values stay on disk", async () => {
    const states = await HybridSerializedStates.new({ spec, blake2b, dbPath });
    try {
      const empty = InMemoryState.empty(spec);
      const serialized = StateEntries.serializeInMemory(spec, blake2b, empty);
      await states.insertInitialState(headerHash, serialized);
      assert.ok(states.getState(headerHash) !== null);

      states.markUnused(headerHash);
      assert.strictEqual(states.getState(headerHash), null);
    } finally {
      await states.close();
    }
  });
});
```
