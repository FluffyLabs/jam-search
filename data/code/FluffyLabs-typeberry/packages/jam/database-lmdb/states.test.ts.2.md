---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-lmdb/states.test.ts#L221-L264
title: packages/jam/database-lmdb/states.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 2
chunk_total: 3
content_sha: eb4406822a5fd8e29249ec36b867243485489db01cc81e2c1e211f1955aac3e4
language: typescript
---
`packages/jam/database-lmdb/states.test.ts` (lines 221–264)

```typescript
  it("should update more complex entries", async () => {
    const root = LmdbRoot.new(tmpDir, {});
    const states = LmdbStates.new(spec, blake2b, root);

    try {
      const state = testState();
      const initialService = state.services.get(tryAsServiceId(0));
      if (initialService === undefined) {
        throw new Error("Expected service in test state!");
      }
      await states.insertInitialState(headerHash, StateEntries.serializeInMemory(spec, blake2b, state));
      const newState = states.getState(headerHash);
      assert.ok(newState !== null);
      const headerHash2: HeaderHash = Bytes.fill(HASH_SIZE, 2).asOpaque();

      // attempt to update all entries
      const stateUpdate = Object.assign({}, state);

      // when
      // in-memory state update
      const res1 = state.applyUpdate(stateUpdate);
      deepEqual(res1, Result.ok(OK));
      // on-disk state update
      const res2 = await states.updateAndSetState(headerHash2, newState, stateUpdate);
      deepEqual(res2, Result.ok(OK));

      const updatedState = states.getState(headerHash2);
      assert.ok(updatedState !== null);
      const updatedStateRoot = await states.getStateRoot(updatedState);

      deepEqual(
        InMemoryState.copyFrom(spec, updatedState, new Map([[initialService.serviceId, initialService.getEntries()]])),
        state,
      );
      assert.strictEqual(
        `${updatedStateRoot}`,
        `${StateEntries.serializeInMemory(spec, blake2b, state).getRootHash(blake2b)}`,
      );
    } finally {
      await states.close();
      await root.close();
    }
  });
});
```
