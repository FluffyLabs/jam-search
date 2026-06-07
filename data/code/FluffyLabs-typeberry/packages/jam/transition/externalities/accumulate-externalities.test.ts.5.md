---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L580-L702
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 5
chunk_total: 26
content_sha: 73ed9041a46e2e7b160e8c01e338870fd6655700da97c1290602a4e1a4b1c753
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 580–702)

```typescript
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
                tryAsLookupHistorySlots([tryAsTimeSlot(0), y, z]),
              ),
            }),
            UpdatePreimage.updateOrAdd({
              lookupHistory: LookupHistoryItem.new(
                hash,
                tryAsU32(Number(length)),
                tryAsLookupHistorySlots([z, state.state.timeslot]),
              ),
            }),
          ],
        ],
      ]),
    );
  });

  it("should not forget reavailable preimage if too recent", () => {
    const state = partiallyUpdatedState();
    state.state.applyUpdate({
      timeslot: tryAsTimeSlot(100),
    });

    const hash = Bytes.fill(HASH_SIZE, 0x08).asOpaque();
    const length = tryAsU64(42);
    const y = tryAsTimeSlot(95); // too recent
    const z = tryAsTimeSlot(70);
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
        lookupHistory: LookupHistoryItem.new(
          hash,
          tryAsU32(Number(length)),
          tryAsLookupHistorySlots([tryAsTimeSlot(0), y, z]),
        ),
      }),
    );
    state.stateUpdate.services.preimages.set(serviceId, updates);

    const result = partialState.forgetPreimage(hash, length);
    deepEqual(
      result,
      Result.error(ForgetPreimageError.NotExpired, () => "Preimage not expired: y=95, timeslot=100, period=32"),
    );
  });

  it("should not forget unavailable preimage if too recent", () => {
    const state = partiallyUpdatedState();

    const hash = Bytes.fill(HASH_SIZE, 0x08).asOpaque();
    const length = tryAsU64(42);
    const serviceId = tryAsServiceId(0);

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: serviceId,
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(2),
    });
    const updates = state.stateUpdate.services.preimages.get(serviceId) ?? [];
    updates.push(
      UpdatePreimage.updateOrAdd({
        lookupHistory: LookupHistoryItem.new(
          hash,
          tryAsU32(Number(length)),
          tryAsLookupHistorySlots([tryAsTimeSlot(0), tryAsTimeSlot(1)]),
        ),
      }),
    );
    state.stateUpdate.services.preimages.set(serviceId, updates);

    const result = partialState.forgetPreimage(hash, length);
    deepEqual(
      result,
      Result.error(ForgetPreimageError.NotExpired, () => "Preimage not expired: y=1, timeslot=2, period=32"),
    );
  });
});

describe("PartialState.newService", () => {
  it("should create a new service and update balance + next service ID", () => {
    const state = partiallyUpdatedState();
    const maybeService = state.state.services.get(tryAsServiceId(0));
    if (maybeService === undefined) {
      throw new Error("Invalid service!");
    }
    const service = maybeService;

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

```
