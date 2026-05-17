---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L236-L351
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 2
chunk_total: 26
content_sha: 8f7e761e55c44f892354268d64055c53f0ca013cf7fa8d28111ef51513c9ca12
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 236–351)

```typescript
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });
    const preimageHash = Bytes.fill(HASH_SIZE, 0xa).asOpaque();

    const status = partialState.requestPreimage(preimageHash, tryAsU64(5));
    assert.deepStrictEqual(status, Result.ok(OK));

    const status2 = partialState.requestPreimage(preimageHash, tryAsU64(5));
    deepEqual(
      status2,
      Result.error(
        RequestPreimageError.AlreadyRequested,
        () => "Preimage already requested: hash=0x0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a",
      ),
    );
  });

  it("should fail if preimage is already available", () => {
    const state = partiallyUpdatedState();
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });
    const preimageHash = Bytes.parseBytes(
      "0xc16326432b5b3213dfd1609495e13c6b276cb474d679645337e5c2c09f19b53c",
      HASH_SIZE,
    ).asOpaque();

    const status = partialState.requestPreimage(preimageHash, tryAsU64(35));
    deepEqual(
      status,
      Result.error(
        RequestPreimageError.AlreadyAvailable,
        () => "Preimage already available: hash=0xc16326432b5b3213dfd1609495e13c6b276cb474d679645337e5c2c09f19b53c",
      ),
    );
  });

  it("should fail if balance is insufficient", () => {
    const state = partiallyUpdatedState();
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });
    const preimageHash = Bytes.fill(HASH_SIZE, 0xa).asOpaque();

    const status = partialState.requestPreimage(preimageHash, tryAsU64(2n ** 34n - 1n));
    deepEqual(
      status,
      Result.error(
        RequestPreimageError.InsufficientFunds,
        () => "Service balance (10000000000) below threshold (17179869696)",
      ),
    );
  });
});

describe("PartialState.forgetPreimage", () => {
  it("should error if preimage does not exist", () => {
    const state = partiallyUpdatedState();
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });
    const hash = Bytes.fill(HASH_SIZE, 0x01).asOpaque();

    const result = partialState.forgetPreimage(hash, tryAsU64(42));
    deepEqual(
      result,
      Result.error(
        ForgetPreimageError.NotFound,
        () => "Preimage not found: hash=0x0101010101010101010101010101010101010101010101010101010101010101, length=42",
      ),
    );
  });

  it("should error if preimage is already forgotten", () => {
    const state = partiallyUpdatedState();
    const serviceId = tryAsServiceId(0);
    const hash = Bytes.parseBytes(
      "0xc16326432b5b3213dfd1609495e13c6b276cb474d679645337e5c2c09f19b53c",
      HASH_SIZE,
    ).asOpaque();
    const length = tryAsU64(35);

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
          tryAsLookupHistorySlots([tryAsTimeSlot(0), tryAsTimeSlot(1)]),
        ),
      }),
    );
```
