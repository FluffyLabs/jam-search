---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L1544-L1673
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 14
chunk_total: 26
content_sha: 2ceaaa973a9d411f47899fdc99092eff4eb2cedb90a9f0190cec952525b995cf
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 1544–1673)

```typescript
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const manager = tryAsServiceId(1);
    const assigners = tryAsPerCore(new Array(tinyChainSpec.coresCount).fill(tryAsServiceId(2)), tinyChainSpec);
    const delegator = tryAsServiceId(3);
    const registrar: ServiceId | null = null;
    const autoAccumulate = new Map([
      [tryAsServiceId(4), tryAsServiceGas(10n)],
      [tryAsServiceId(5), tryAsServiceGas(20n)],
    ]);

    // when
    const result = partialState.updatePrivilegedServices(manager, assigners, delegator, registrar, autoAccumulate);

    // then
    deepEqual(
      result,
      Result.error(UpdatePrivilegesError.InvalidServiceId, () => INVALID_SERVICE_ID_ERROR),
    );
    assert.deepStrictEqual(state.stateUpdate.privilegedServices, null);
  });
});

describe("PartialState.transfer", () => {
  const partiallyUpdatedStateWithSecondService = () => {
    const state = partiallyUpdatedState();
    const maybeService = state.state.services.get(tryAsServiceId(0));
    if (maybeService === undefined) {
      throw new Error("Invalid service!");
    }
    const service = maybeService;

    state.state.services.set(
      tryAsServiceId(1),
      InMemoryService.new(tryAsServiceId(1), {
        info: ServiceAccountInfo.create({
          ...service.data.info,
          onTransferMinGas: tryAsServiceGas(1000),
        }),
        preimages: HashDictionary.new(),
        lookupHistory: HashDictionary.new(),
        storage: new Map(),
      }),
    );
    return {
      state,
      service,
    };
  };

  it("should perform a successful transfer", () => {
    const { state, service } = partiallyUpdatedStateWithSecondService();
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const destinationId = tryAsServiceId(1);
    const amount = tryAsU64(500n);
    const gas = tryAsServiceGas(1_000n);
    const memo = Bytes.fill(TRANSFER_MEMO_BYTES, 0xaa);

    const newBalance = service.data.info.balance - amount;

    // when
    const result = partialState.transfer(destinationId, amount, gas, memo);

    // then
    assert.deepStrictEqual(result, Result.ok(OK));
    assert.deepStrictEqual(state.stateUpdate.transfers, [
      PendingTransfer.create({
        source: tryAsServiceId(0),
        destination: destinationId,
        amount,
        memo,
        gas,
      }),
    ]);
    assert.deepStrictEqual(
      state.stateUpdate.services.updated,
      new Map([
        [
          tryAsServiceId(0),
          UpdateService.update({
            serviceInfo: ServiceAccountInfo.create({
              ...service.data.info,
              balance: tryAsU64(newBalance),
            }),
          }),
        ],
      ]),
    );
  });

  it("should return DestinationNotFound error if destination doesnt exist", () => {
    const { state } = partiallyUpdatedStateWithSecondService();
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const amount = tryAsU64(100n);
    const gas = tryAsServiceGas(1_000n);
    const memo = Bytes.fill(TRANSFER_MEMO_BYTES, 0xbb);

    // when
    const result = partialState.transfer(tryAsServiceId(4), amount, gas, memo);

    // then
    deepEqual(
      result,
      Result.error(TransferError.DestinationNotFound, () => "Destination service not found: 4"),
    );
  });

```
