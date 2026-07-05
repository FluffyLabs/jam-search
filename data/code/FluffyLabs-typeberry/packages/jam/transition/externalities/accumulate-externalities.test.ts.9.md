---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L1036-L1156
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 9
chunk_total: 26
content_sha: fd661116886933b2862c5c8034fe3eb3dbd306f1d2a3b512068c6e4a5d7aec9f
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 1036–1156)

```typescript
      throw new Error("Invalid service!");
    }

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const codeHash = Bytes.fill(HASH_SIZE, 0x12).asOpaque();
    const codeLength = tryAsU64(1024);
    const accumulateMinGas = tryAsServiceGas(10n);
    const onTransferMinGas = tryAsServiceGas(20n);
    const gratisStorage = tryAsU64(1024);
    // selecting service id
    const serviceId = tryAsU64(42);

    // when
    const result = partialState.newService(
      codeHash,
      codeLength,
      accumulateMinGas,
      onTransferMinGas,
      gratisStorage,
      serviceId,
    );

    // then
    assert.deepStrictEqual(result, Result.ok(10));
    assert.deepStrictEqual(partialState.getNextNewServiceId(), tryAsServiceId(4294901556));
  });
});

describe("PartialState.updateValidatorsData", () => {
  it("should update validators data", () => {
    const state = partiallyUpdatedState();
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    // when
    const result = partialState.updateValidatorsData(
      asKnownSize([
        ValidatorData.create({
          bandersnatch: Bytes.fill(BANDERSNATCH_KEY_BYTES, 0x1).asOpaque(),
          ed25519: Bytes.fill(ED25519_KEY_BYTES, 0x2).asOpaque(),
          bls: Bytes.fill(BLS_KEY_BYTES, 0x3).asOpaque(),
          metadata: Bytes.fill(VALIDATOR_META_BYTES, 0x4).asOpaque(),
        }),
      ]),
    );

    // then
    assert.deepStrictEqual(result, Result.ok(OK));
    assert.deepStrictEqual(state.stateUpdate.validatorsData?.length, 1);
  });

  it("should return error and not update validator set when service is unprivileged", () => {
    const state = partiallyUpdatedState();
    state.state.privilegedServices = PrivilegedServices.create({
      ...state.state.privilegedServices,
      delegator: tryAsServiceId(1),
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
    const result = partialState.updateValidatorsData(
      asKnownSize([
        ValidatorData.create({
          bandersnatch: Bytes.fill(BANDERSNATCH_KEY_BYTES, 0x1).asOpaque(),
          ed25519: Bytes.fill(ED25519_KEY_BYTES, 0x2).asOpaque(),
          bls: Bytes.fill(BLS_KEY_BYTES, 0x3).asOpaque(),
          metadata: Bytes.fill(VALIDATOR_META_BYTES, 0x4).asOpaque(),
        }),
      ]),
    );

    // then
    deepEqual(
      result,
      Result.error(UnprivilegedError, () => "Service 0 is not delegator (expected: 1)"),
    );
    assert.deepStrictEqual(state.stateUpdate.validatorsData, null);
  });
});

describe("PartialState.checkpoint", () => {
  it("should checkpoint the updates", () => {
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
    // put something into updated state
    const status = partialState.requestPreimage(preimageHash, tryAsU64(5));
    assert.deepStrictEqual(status, Result.ok(OK));

    // when
    partialState.checkpoint();

    // then
```
