---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/states.test.ts#L100-L188
title: packages/jam/database-fjall/states.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 78339dfee3791153d224b8bb21b3f75de44db3a4f5c6a7116c3b1f5d189a8bfa
language: typescript
---
`packages/jam/database-fjall/states.test.ts` (lines 100–188)

```typescript
        tryAsLookupHistorySlots([]),
      );
      const stateUpdate = {
        timeslot: tryAsTimeSlot(15),
        privilegedServices: PrivilegedServices.create({
          manager: tryAsServiceId(1),
          assigners: tryAsPerCore(new Array(spec.coresCount).fill(tryAsServiceId(2)), spec),
          delegator: tryAsServiceId(3),
          registrar: tryAsServiceId(4),
          autoAccumulateServices: new Map(),
        }),
        updated: new Map([
          [
            tryAsServiceId(1),
            UpdateService.create({
              serviceInfo: ServiceAccountInfo.create({
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

      deepEqual(state.applyUpdate(stateUpdate), Result.ok(OK));
      deepEqual(await states.updateAndSetState(headerHash2, newState, stateUpdate), Result.ok(OK));

      const updatedState = states.getState(headerHash2);
      assert.ok(updatedState !== null);
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
        `${await states.getStateRoot(updatedState)}`,
        `${StateEntries.serializeInMemory(spec, blake2b, state).getRootHash(blake2b)}`,
      );
    } finally {
      await states.close();
      await root.close();
    }
  });

  it("imports a more complex state", async () => {
    const root = await FjallRoot.open(tmpDir, { ephemeral: true });
    const states = await FjallStates.open(spec, blake2b, root);
    try {
      const initialState = testState();
      const initialService = initialState.services.get(tryAsServiceId(0));
      assert.ok(initialService !== undefined);

      const serialized = StateEntries.serializeInMemory(spec, blake2b, initialState);
      deepEqual(await states.insertInitialState(headerHash, serialized), Result.ok(OK));

      const newState = states.getState(headerHash);
      assert.ok(newState !== null);
      assert.strictEqual(`${await states.getStateRoot(newState)}`, `${serialized.getRootHash(blake2b)}`);
      deepEqual(
        InMemoryState.copyFrom(spec, newState, new Map([[initialService.serviceId, initialService.getEntries()]])),
        initialState,
      );
    } finally {
      await states.close();
      await root.close();
    }
  });
});
```
