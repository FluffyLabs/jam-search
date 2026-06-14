---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L466-L585
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 4
chunk_total: 26
content_sha: c58a99763ca09ba893d132370e5c593613e888b662b00781a68af15f61e97ed1
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 466–585)

```typescript
      timeslot: tryAsTimeSlot(100),
    });

    const hash = Bytes.fill(HASH_SIZE, 0x05).asOpaque();
    const length = tryAsU64(42);
    const recentSlot = tryAsTimeSlot(90); // within expunge period
    const serviceId = tryAsServiceId(0);

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: serviceId,
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });
    const updates = state.stateUpdate.services.preimages.get(serviceId) ?? [];
    updates.push(
      UpdatePreimage.updateOrAdd({
        lookupHistory: LookupHistoryItem.new(hash, tryAsU32(Number(length)), tryAsLookupHistorySlots([recentSlot])),
      }),
    );
    state.stateUpdate.services.preimages.set(serviceId, updates);

    const result = partialState.forgetPreimage(hash, length);
    assert.deepStrictEqual(result, Result.ok(OK));
  });

  it("should update lookup history for available preimage", () => {
    const state = partiallyUpdatedState();
    state.state.applyUpdate({
      timeslot: tryAsTimeSlot(100),
    });

    const hash = Bytes.fill(HASH_SIZE, 0x06).asOpaque();
    const length = tryAsU64(42);
    const availableSlot = tryAsTimeSlot(80);
    const serviceId = tryAsServiceId(0);

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: serviceId,
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(100),
    });
    const updates = state.stateUpdate.services.preimages.get(serviceId) ?? [];
    updates.push(
      UpdatePreimage.updateOrAdd({
        lookupHistory: LookupHistoryItem.new(hash, tryAsU32(Number(length)), tryAsLookupHistorySlots([availableSlot])),
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
                tryAsLookupHistorySlots([availableSlot]),
              ),
            }),
            UpdatePreimage.updateOrAdd({
              lookupHistory: LookupHistoryItem.new(
                hash,
                tryAsU32(Number(length)),
                tryAsLookupHistorySlots([availableSlot, state.state.timeslot]),
              ),
            }),
          ],
        ],
      ]),
    );
  });

  it("should update history for reavailable preimage if old", () => {
    const state = partiallyUpdatedState();
    state.state.applyUpdate({
      timeslot: tryAsTimeSlot(100000),
    });

    const hash = Bytes.fill(HASH_SIZE, 0x07).asOpaque();
    const length = tryAsU64(42);
    const y = tryAsTimeSlot(0);
    const z = tryAsTimeSlot(70);
    const serviceId = tryAsServiceId(0);

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: serviceId,
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(100000),
    });
    const updates = state.stateUpdate.services.preimages.get(serviceId) ?? [];
    updates.push(
      UpdatePreimage.updateOrAdd({
        lookupHistory: LookupHistoryItem.new(
          hash,
          tryAsU32(Number(length)),
          tryAsLookupHistorySlots([tryAsTimeSlot(0), y, z]),
        ),
      }),
    );
    state.stateUpdate.services.preimages.set(serviceId, updates);

    const result = partialState.forgetPreimage(hash, length);
    assert.deepStrictEqual(result, Result.ok(OK));

    assert.deepStrictEqual(
```
