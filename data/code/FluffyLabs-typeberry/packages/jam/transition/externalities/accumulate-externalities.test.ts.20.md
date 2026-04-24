---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L2287-L2400
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 20
chunk_total: 26
content_sha: 8ce5ee0a77dd96f2b05632868cefa30022e725c2f581b325550758f377a7e504
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 2287–2400)

```typescript
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(50),
    });

    // when
    const correctEjectResult = partialState.eject(destinationId, tombstone); // correct eject
    assert.strictEqual(correctEjectResult.isOk, true);
    assert.deepStrictEqual(state.stateUpdate.services.removed, [destinationId]);

    const incorrectResult = partialState.eject(destinationId, tombstone); // incorrect eject

    // then
    deepEqual(
      incorrectResult,
      Result.error(EjectError.InvalidService, () => "Service missing"),
    );
  });

  it("should return InvalidService if destination service codeHash does not match expected pattern", () => {
    const state = partiallyUpdatedState();
    const destinationId = setupEjectableService(state.state, {
      codeHash: Bytes.fill(HASH_SIZE, 0x99).asOpaque(), // wrong codeHash
    });

    const tombstone = Bytes.fill(HASH_SIZE, 0xec).asOpaque();
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
      Result.error(EjectError.InvalidService, () => "Invalid code hash"),
    );
    assert.deepStrictEqual(state.stateUpdate.services.removed, []);
  });

  it("should return InvalidPreimage if storageUtilisationCount is not equal to required value", () => {
    const state = partiallyUpdatedState();
    const destinationId = setupEjectableService(state.state, {
      storageUtilisationCount: tryAsU32(2 + 1), // off by 1
    });

    const tombstone = Bytes.fill(HASH_SIZE, 0xeb).asOpaque();
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
      Result.error(EjectError.InvalidPreimage, () => "Too many storage items"),
    );
    assert.deepStrictEqual(state.stateUpdate.services.removed, []);
  });

  it("should return InvalidPreimage if the tombstone preimage is missing", () => {
    const state = partiallyUpdatedState();
    const tombstone = Bytes.fill(HASH_SIZE, 0xea).asOpaque();

    // destination service has valid codeHash and config, but no preimage or lookup history
    const destinationId = setupEjectableService(state.state);

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
      Result.error(EjectError.InvalidPreimage, () => "Previous code available: wrong status: null"),
    );
    assert.deepStrictEqual(state.stateUpdate.services.removed, []);
  });

  it("should return InvalidPreimage if tombstone preimage exists but has wrong status", () => {
    const state = partiallyUpdatedState();
    const tombstone = Bytes.fill(HASH_SIZE, 0xe9).asOpaque<PreimageHash>();
    const length = tryAsU32(100);

    const destinationId = setupEjectableService(state.state, {
      tombstone: {
        hash: tombstone,
        length,
        // available
```
