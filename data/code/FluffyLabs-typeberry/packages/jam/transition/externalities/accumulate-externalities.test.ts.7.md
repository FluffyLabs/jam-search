---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L803-L927
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 7
chunk_total: 26
content_sha: a87aea55d45dceb73a76b652d6d8c955fbd11197a3b3718f5f09cf9e280ba1d9
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 803–927)

```typescript
    const thresholdForNew = ServiceAccountInfo.calculateThresholdBalance(items, bytes, gratisStorage);
    const expectedBalance = tryAsU64(service.data.info.balance - thresholdForNew);

    // when
    const result = partialState.newService(
      codeHash,
      codeLengthU64,
      accumulateMinGas,
      onTransferMinGas,
      gratisStorage,
      wantedServiceId,
    );

    // then
    const expectedServiceId = tryAsServiceId(42);

    assert.deepStrictEqual(result, Result.ok(expectedServiceId));

    // Verify service updates
    assert.deepStrictEqual(
      state.stateUpdate.services.updated,
      new Map([
        [
          tryAsServiceId(0),
          UpdateService.update({
            serviceInfo: ServiceAccountInfo.create({
              ...service.data.info,
              balance: expectedBalance,
            }),
          }),
        ],
        [
          expectedServiceId,
          UpdateService.create({
            serviceInfo: ServiceAccountInfo.create({
              codeHash,
              balance: thresholdForNew,
              accumulateMinGas,
              onTransferMinGas,
              storageUtilisationBytes: bytes,
              gratisStorage: gratisStorage,
              storageUtilisationCount: items,
              created: tryAsTimeSlot(16),
              lastAccumulation: tryAsTimeSlot(0),
              parentService: service.serviceId,
            }),
            lookupHistory: LookupHistoryItem.new(codeHash, codeLength, tryAsLookupHistorySlots([])),
          }),
        ],
      ]),
    );
    assert.deepStrictEqual(state.stateUpdate.services.created, [expectedServiceId]);

    // Verify next service ID is not bumped
    assert.deepStrictEqual(partialState.getNextNewServiceId(), tryAsServiceId(10));
  });

  it("should return an error if there are insufficient funds", () => {
    const state = partiallyUpdatedState();
    const maybeService = state.state.services.get(tryAsServiceId(0));
    if (maybeService === undefined) {
      throw new Error("Invalid service!");
    }
    const service = maybeService;

    const updatedService = InMemoryService.new(service.serviceId, {
      ...service.data,
      info: ServiceAccountInfo.create({
        ...service.data.info,
        // lower the balance a bit
        balance: tryAsU64(2 ** 24),
      }),
    });
    state.state.services.set(tryAsServiceId(0), updatedService);

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const codeHash = Bytes.fill(HASH_SIZE, 0x12).asOpaque();
    // artificially large to exceed balance
    const codeLength = tryAsU64(2 ** 32 + 1);
    const accumulateMinGas = tryAsServiceGas(10n);
    const onTransferMinGas = tryAsServiceGas(20n);
    const gratisStorage = tryAsU64(1024);

    // when
    const result = partialState.newService(
      codeHash,
      codeLength,
      accumulateMinGas,
      onTransferMinGas,
      gratisStorage,
      tryAsU64(0n),
    );

    // then
    deepEqual(
      result,
      Result.error(
        NewServiceError.InsufficientFunds,
        () => "Insufficient funds: balance=16777216, required=4294966474, overflow=false",
      ),
    );

    // Verify no side effects
    assert.deepStrictEqual(state.stateUpdate.services.updated, new Map());
  });

  it("should return an error if service is unprivileged to set gratis storage", () => {
    const state = partiallyUpdatedState();
    // setting different service than our privileged manager
    state.stateUpdate.privilegedServices = {
      ...state.state.privilegedServices,
      manager: tryAsServiceId(1),
    };
    const maybeService = state.state.services.get(tryAsServiceId(0));
    if (maybeService === undefined) {
      throw new Error("Invalid service!");
    }
```
