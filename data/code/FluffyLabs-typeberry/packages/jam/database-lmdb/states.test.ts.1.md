---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-lmdb/states.test.ts#L109-L226
title: packages/jam/database-lmdb/states.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 3
content_sha: 6fbcf19e3fe0b6778f811e9477ccb9eac2bbaf03702bdee2cf507378be7ee18d
language: typescript
---
`packages/jam/database-lmdb/states.test.ts` (lines 109–226)

```typescript
                codeHash: Bytes.zero(HASH_SIZE).asOpaque(),
                balance: tryAsU64(1_000_000),
                accumulateMinGas: tryAsServiceGas(10_000),
                onTransferMinGas: tryAsServiceGas(5_000),
                storageUtilisationBytes: tryAsU64(1_000),
                gratisStorage: tryAsU64(0),
                storageUtilisationCount: tryAsU32(1),
                created: tryAsTimeSlot(0),
                lastAccumulation: tryAsTimeSlot(0),
                parentService: tryAsServiceId(0),
              }),
              lookupHistory,
            }),
          ],
        ]),
      };

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
        InMemoryState.copyFrom(
          spec,
          updatedState,
          new Map([
            [
              tryAsServiceId(1),
              {
                storageKeys: [],
                preimages: [],
                lookupHistory: [{ hash: lookupHistory.hash, length: lookupHistory.length }],
              },
            ],
          ]),
        ),
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

  it("sorted set should be actual to trie", () => {
    const data: [OpaqueHash, BytesBlob][] = [
      [Bytes.fill(HASH_SIZE, 5), BytesBlob.blobFromString("five")],
      [Bytes.fill(HASH_SIZE, 1), BytesBlob.blobFromString("one")],
      [Bytes.fill(HASH_SIZE, 3), BytesBlob.blobFromString("three")],
      [Bytes.fill(HASH_SIZE, 4), BytesBlob.blobFromString("four")],
      [Bytes.fill(HASH_SIZE, 2), BytesBlob.blobFromString("two")],
    ];

    const trie = InMemoryTrie.empty(blake2bTrieHasher);
    for (const [key, val] of data) {
      trie.set(key.asOpaque(), val);
    }

    const set = SortedSet.fromArray(
      leafComparator,
      data.map(([key, value]) => {
        return InMemoryTrie.constructLeaf(blake2bTrieHasher, key.asOpaque(), value);
      }),
    );

    deepEqual(Array.from(set), Array.from(SortedSet.fromArray(leafComparator, Array.from(trie.nodes.leaves()))));
  });

  it("should import more complex state", async () => {
    const root = LmdbRoot.new(tmpDir, {});
    const states = LmdbStates.new(spec, blake2b, root);

    try {
      const initialState = testState();
      const initialService = initialState.services.get(tryAsServiceId(0));
      if (initialService === undefined) {
        throw new Error("Expected service in test state!");
      }

      const serialized = StateEntries.serializeInMemory(spec, blake2b, initialState);
      const initialRoot = serialized.getRootHash(blake2b);

      // when
      const res = await states.insertInitialState(headerHash, serialized);
      deepEqual(res, Result.ok(OK));
      const newState = states.getState(headerHash);
      assert.ok(newState !== null);
      const newRoot = await states.getStateRoot(newState);

      assert.deepStrictEqual(`${newRoot}`, `${initialRoot}`);
      deepEqual(
        InMemoryState.copyFrom(spec, newState, new Map([[initialService.serviceId, initialService.getEntries()]])),
        initialState,
      );
    } finally {
      await states.close();
      await root.close();
    }
  });

  it("should update more complex entries", async () => {
    const root = LmdbRoot.new(tmpDir, {});
    const states = LmdbStates.new(spec, blake2b, root);

    try {
      const state = testState();
```
