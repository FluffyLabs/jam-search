---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L344-L471
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 3
chunk_total: 26
content_sha: 33bae4ec3e287f7f8ab0c35823917ab685ba3fb74232ec3e773bc2b2d7d9384f
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 344–471)

```typescript
      UpdatePreimage.updateOrAdd({
        lookupHistory: LookupHistoryItem.new(
          hash,
          tryAsU32(Number(length)),
          tryAsLookupHistorySlots([tryAsTimeSlot(0), tryAsTimeSlot(1)]),
        ),
      }),
    );
    state.stateUpdate.services.preimages.set(serviceId, updates);

    const result1 = partialState.forgetPreimage(hash, length);
    assert.deepStrictEqual(result1, Result.ok(OK));

    state.state.applyUpdate(state.stateUpdate.services);

    const result2 = partialState.forgetPreimage(hash, length);
    deepEqual(
      result2,
      Result.error(
        ForgetPreimageError.NotFound,
        () => "Preimage not found: hash=0xc16326432b5b3213dfd1609495e13c6b276cb474d679645337e5c2c09f19b53c, length=35",
      ),
    );
  });

  it("should forget a requested preimage", () => {
    const state = partiallyUpdatedState();
    const serviceId = tryAsServiceId(0);
    const hash = Bytes.fill(HASH_SIZE, 0x03).asOpaque();
    const length = tryAsU64(42);

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: serviceId,
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });
    partialState.requestPreimage(hash, length);

    const result = partialState.forgetPreimage(hash, length);
    assert.deepStrictEqual(result, Result.ok(OK));

    assert.deepStrictEqual(
      state.stateUpdate.services.preimages,
      new Map([
        [
          serviceId,
          [
            UpdatePreimage.updateOrAdd({
              lookupHistory: LookupHistoryItem.new(hash, tryAsU32(Number(length)), tryAsLookupHistorySlots([])),
            }),
            UpdatePreimage.remove({
              hash,
              length: tryAsU32(Number(length)),
            }),
          ],
        ],
      ]),
    );
  });

  it("should forget an unavailable preimage if it is old enough", () => {
    const state = partiallyUpdatedState();
    state.state.applyUpdate({
      timeslot: tryAsTimeSlot(100000),
    });

    const hash = Bytes.fill(HASH_SIZE, 0x04).asOpaque();
    const length = tryAsU64(42);
    const oldSlot = tryAsTimeSlot(0); // very old
    const serviceId = tryAsServiceId(0);

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: serviceId,
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(50),
    });
    const updates = state.stateUpdate.services.preimages.get(serviceId) ?? [];
    updates.push(
      UpdatePreimage.updateOrAdd({
        lookupHistory: LookupHistoryItem.new(
          hash,
          tryAsU32(Number(length)),
          tryAsLookupHistorySlots([oldSlot, oldSlot]),
        ),
      }),
    );
    state.stateUpdate.services.preimages.set(serviceId, updates);
    const result = partialState.forgetPreimage(hash, length);
    assert.deepStrictEqual(result, Result.ok(OK));

    assert.deepStrictEqual(
      state.stateUpdate.services.preimages,
      new Map([
        [
          serviceId,
          [
            UpdatePreimage.updateOrAdd({
              lookupHistory: LookupHistoryItem.new(
                hash,
                tryAsU32(Number(length)),
                tryAsLookupHistorySlots([oldSlot, oldSlot]),
              ),
            }),
            UpdatePreimage.remove({
              hash,
              length: tryAsU32(Number(length)),
            }),
          ],
        ],
      ]),
    );
  });

  it("should not forget an unavailable preimage if it is recent", () => {
    const state = partiallyUpdatedState();
    state.state.applyUpdate({
      timeslot: tryAsTimeSlot(100),
    });

    const hash = Bytes.fill(HASH_SIZE, 0x05).asOpaque();
    const length = tryAsU64(42);
    const recentSlot = tryAsTimeSlot(90); // within expunge period
```
