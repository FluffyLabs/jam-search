---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L1665-L1791
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 15
chunk_total: 26
content_sha: a344ff15e954363f1f3ef69f3172102399b977989c6d417daacaf570cc915e28
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 1665–1791)

```typescript
    const result = partialState.transfer(tryAsServiceId(4), amount, gas, memo);

    // then
    deepEqual(
      result,
      Result.error(TransferError.DestinationNotFound, () => "Destination service not found: 4"),
    );
  });

  it("should return GasTooLow error if gas is below destination's minimum", () => {
    const { state } = partiallyUpdatedStateWithSecondService();
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const destinationId = tryAsServiceId(1);
    const amount = tryAsU64(100n);
    const gas = tryAsServiceGas(999n); // too low
    const memo = Bytes.fill(TRANSFER_MEMO_BYTES, 0xcc);

    // when
    const result = partialState.transfer(destinationId, amount, gas, memo);

    // then
    deepEqual(
      result,
      Result.error(TransferError.GasTooLow, () => "Gas 999 below minimum 1000"),
    );
  });

  it("should return BalanceBelowThreshold error if balance would fall too low", () => {
    const { state } = partiallyUpdatedStateWithSecondService();
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const destinationId = tryAsServiceId(1);
    const amount = tryAsU64(9_999_999_999n); // dangerously high
    const gas = tryAsServiceGas(1_000n);
    const memo = Bytes.fill(TRANSFER_MEMO_BYTES, 0xdd);

    // when
    const result = partialState.transfer(destinationId, amount, gas, memo);

    // then
    deepEqual(
      result,
      Result.error(TransferError.BalanceBelowThreshold, () => "Balance 1 below threshold 412"),
    );
  });
});

describe("PartialState.yield", () => {
  it("should yield root", () => {
    const currentServiceId = tryAsServiceId(0);
    const state = partiallyUpdatedState();
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: currentServiceId,
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });
    const expectedYieldedRoot = Bytes.fill(HASH_SIZE, 0xef);
    // when
    partialState.yield(Bytes.fill(HASH_SIZE, 0xef));

    // then
    deepEqual(state.stateUpdate.yieldedRoot, expectedYieldedRoot);
  });
});

describe("PartialState.providePreimage", () => {
  const partiallyUpdatedStateWithSecondService = ({
    requested = false,
    available = false,
    self = false,
  }: {
    requested?: boolean;
    available?: boolean;
    self?: boolean;
  } = {}) => {
    const state = partiallyUpdatedState();
    const maybeService = state.state.services.get(tryAsServiceId(0));
    if (maybeService === undefined) {
      throw new Error("Invalid service!");
    }
    const service = maybeService;

    const preimageBlob = BytesBlob.blobFromNumbers([0xaa, 0xbb, 0xcc, 0xdd]);
    const preimage = PreimageItem.create({
      hash: blake2b.hashBytes(preimageBlob).asOpaque(),
      blob: preimageBlob,
    });

    const preimages = HashDictionary.fromEntries(available ? [[preimage.hash, preimage]] : []);
    const lookupHistory = HashDictionary.fromEntries(
      requested
        ? [
            [
              preimage.hash,
              [LookupHistoryItem.new(preimage.hash, tryAsU32(preimage.blob.length), tryAsLookupHistorySlots([]))],
            ],
          ]
        : [],
    );

    if (self) {
      // we need to replace the existing service
      state.state.services.set(
        service.serviceId,
        InMemoryService.new(service.serviceId, {
          ...service.data,
          preimages,
          lookupHistory,
        }),
```
