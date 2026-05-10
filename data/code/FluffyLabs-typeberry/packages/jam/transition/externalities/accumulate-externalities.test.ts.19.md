---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L2172-L2292
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 19
chunk_total: 26
content_sha: 6b658ca9401212fa957fa1fec8654f27660803233d9a509473ae1554a16a22ec
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 2172–2292)

```typescript
    if (baseService === undefined) {
      throw new Error("Missing required service!");
    }
    const codeHash =
      overrides.codeHash ??
      (() => {
        const expected = Bytes.zero(HASH_SIZE).asOpaque<CodeHash>();
        writeServiceIdAsLeBytes(tryAsServiceId(0), expected.raw);
        return expected;
      })();

    const storageUtilisationCount = overrides.storageUtilisationCount ?? tryAsU32(2);

    const storageUtilisationBytes =
      overrides.storageUtilisationBytes ?? tryAsU64(81 + (overrides.tombstone?.length ?? 0));

    let preimages = HashDictionary.new<PreimageHash, PreimageItem>();
    let lookupHistory = HashDictionary.new<PreimageHash, LookupHistoryItem[]>();
    if (overrides.tombstone !== undefined) {
      const { hash, length, slots } = overrides.tombstone;
      const item = LookupHistoryItem.new(hash, length, slots);
      lookupHistory = HashDictionary.fromEntries([[hash, [item]]]);
      if (item.slots.length === 1 || item.slots.length === 2) {
        preimages = HashDictionary.fromEntries([
          [
            hash,
            PreimageItem.create({
              hash,
              blob: BytesBlob.blobFrom(new Uint8Array(length)),
            }),
          ],
        ]);
      }
    }

    const destinationService = InMemoryService.new(destinationId, {
      info: ServiceAccountInfo.create({
        ...baseService.data.info,
        codeHash,
        storageUtilisationCount,
        storageUtilisationBytes,
      }),
      preimages,
      lookupHistory,
      storage: new Map(),
    });

    stateUpdate.services.set(destinationId, destinationService);
    return destinationId;
  }
  it("should return InvalidService if destination is null", () => {
    const state = partiallyUpdatedState();
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const tombstone = Bytes.fill(HASH_SIZE, 0xef).asOpaque();

    // when
    const result = partialState.eject(null, tombstone);

    // then
    deepEqual(
      result,
      Result.error(EjectError.InvalidService, () => "Service missing"),
    );
    assert.deepStrictEqual(state.stateUpdate.services.removed, []);
  });

  it("should return InvalidService if destination service does not exist", () => {
    const state = partiallyUpdatedState();
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const nonExistentServiceId = tryAsServiceId(99); // not present in stateUpdate
    const tombstone = Bytes.fill(HASH_SIZE, 0xee).asOpaque();

    // when
    const result = partialState.eject(nonExistentServiceId, tombstone);

    // then
    deepEqual(
      result,
      Result.error(EjectError.InvalidService, () => "Service missing"),
    );
    assert.deepStrictEqual(state.stateUpdate.services.removed, []);
  });

  it("should return InvalidService if destination service is already ejected", () => {
    const state = partiallyUpdatedState();
    state.state.applyUpdate({
      timeslot: tryAsTimeSlot(1_000_000),
    });
    const tombstone = Bytes.fill(HASH_SIZE, 0xe8).asOpaque();
    const length = tryAsU32(100);

    const destinationId = setupEjectableService(state.state, {
      tombstone: {
        hash: tombstone,
        length,
        slots: tryAsLookupHistorySlots([0, 1].map((x) => tryAsTimeSlot(x))),
      },
    });

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
```
