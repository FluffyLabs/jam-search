---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L2393-L2524
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 21
chunk_total: 26
content_sha: 7a457e90302243289c16d5874ae29d2d59f5b2d7dcb720640f83edbe293f9bd2
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 2393–2524)

```typescript
    const tombstone = Bytes.fill(HASH_SIZE, 0xe9).asOpaque<PreimageHash>();
    const length = tryAsU32(100);

    const destinationId = setupEjectableService(state.state, {
      tombstone: {
        hash: tombstone,
        length,
        // available
        slots: tryAsLookupHistorySlots([1].map((x) => tryAsTimeSlot(x))),
      },
    });

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    // when
    const result = partialState.eject(destinationId, tombstone);

    // then
    deepEqual(
      result,
      Result.error(EjectError.InvalidPreimage, () => "Previous code available: wrong status: Available"),
    );
    assert.deepStrictEqual(state.stateUpdate.services.removed, []);
  });

  it("should return InvalidPreimage if tombstone preimage exists but is not expired", () => {
    const state = partiallyUpdatedState();
    const tombstone = Bytes.fill(HASH_SIZE, 0xe9).asOpaque<PreimageHash>();
    const length = tryAsU32(13);

    const destinationId = setupEjectableService(state.state, {
      tombstone: {
        hash: tombstone,
        length,
        // unavailable
        slots: tryAsLookupHistorySlots([1, 11].map((x) => tryAsTimeSlot(x))),
      },
    });

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(17),
    });

    // when
    const result = partialState.eject(destinationId, tombstone);

    // then
    deepEqual(
      result,
      Result.error(EjectError.InvalidPreimage, () => "Previous code available: not expired"),
    );
    assert.deepStrictEqual(state.stateUpdate.services.removed, []);
  });

  it("should return InvalidService if summing balances would overflow", () => {
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
      currentTimeslot: tryAsTimeSlot(50),
    });

    // set the balance to overflow
    const currentService = state.state.services.get(tryAsServiceId(0));
    if (currentService === undefined) {
      throw new Error("missing required service!");
    }

    state.updateServiceInfo(
      tryAsServiceId(0),
      ServiceAccountInfo.create({
        ...currentService.data.info,
        balance: tryAsU64(2n ** 64n - 1n),
      }),
    );

    // when
    const result = partialState.eject(destinationId, tombstone);

    // then
    deepEqual(
      result,
      Result.error(EjectError.InvalidService, () => "Balance overflow"),
    );
    assert.deepStrictEqual(state.stateUpdate.services.removed, []);
  });

  it("should return OK", () => {
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

```
