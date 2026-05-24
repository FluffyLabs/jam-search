---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L695-L809
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 6
chunk_total: 26
content_sha: fe6ff95fe5d9a6d8634e49f61e2fa6b2dc3a22e6d8e2a000c0b7fe5d0bc39a1f
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 695–809)

```typescript
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const codeHash = Bytes.fill(HASH_SIZE, 0x11).asOpaque();
    const codeLength = tryAsU32(100);
    const codeLengthU64 = tryAsU64(codeLength);
    const accumulateMinGas = tryAsServiceGas(10n);
    const onTransferMinGas = tryAsServiceGas(20n);
    const gratisStorage = tryAsU64(50);

    const items = tryAsU32(2); // 2 * 1 + 0
    const bytes = tryAsU64(81 + codeLength);
    const thresholdForNew = ServiceAccountInfo.calculateThresholdBalance(items, bytes, gratisStorage);
    const expectedBalance = tryAsU64(service.data.info.balance - thresholdForNew);

    // when
    const result = partialState.newService(
      codeHash,
      codeLengthU64,
      accumulateMinGas,
      onTransferMinGas,
      gratisStorage,
      tryAsU64(2 ** 17),
    );

    // then
    const expectedServiceId = tryAsServiceId(10);

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

    // Verify next service ID bumped
    assert.deepStrictEqual(partialState.getNextNewServiceId(), tryAsServiceId(4294901556));
  });

  it("should create a new service with given id and update balance + not changed next service ID", () => {
    const state = partiallyUpdatedState();
    const serviceId = 0;
    // setting registrar privileges for our service
    state.stateUpdate.privilegedServices = {
      ...state.state.privilegedServices,
      registrar: tryAsServiceId(serviceId),
    };
    const maybeService = state.state.services.get(tryAsServiceId(serviceId));
    if (maybeService === undefined) {
      throw new Error("Invalid service!");
    }
    const service = maybeService;

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(serviceId),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const codeHash = Bytes.fill(HASH_SIZE, 0x11).asOpaque();
    const codeLength = tryAsU32(100);
    const codeLengthU64 = tryAsU64(codeLength);
    const accumulateMinGas = tryAsServiceGas(10n);
    const onTransferMinGas = tryAsServiceGas(20n);
    const gratisStorage = tryAsU64(50);
    // selecting service id
    const wantedServiceId = tryAsU64(42);

    const items = tryAsU32(2); // 2 * 1 + 0
    const bytes = tryAsU64(81 + codeLength);
    const thresholdForNew = ServiceAccountInfo.calculateThresholdBalance(items, bytes, gratisStorage);
    const expectedBalance = tryAsU64(service.data.info.balance - thresholdForNew);

    // when
    const result = partialState.newService(
      codeHash,
      codeLengthU64,
```
