---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L921-L1043
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 8
chunk_total: 26
content_sha: a7446576d661fd21c924f6050849d43e92e44d410d6272d4741a91880e001cf6
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 921–1043)

```typescript
      ...state.state.privilegedServices,
      manager: tryAsServiceId(1),
    };
    const maybeService = state.state.services.get(tryAsServiceId(0));
    if (maybeService === undefined) {
      throw new Error("Invalid service!");
    }
    const service = maybeService;

    const updatedService = InMemoryService.new(service.serviceId, {
      ...service.data,
      info: ServiceAccountInfo.create({
        ...service.data.info,
        balance: tryAsU64(2 ** 32),
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
    const codeLength = tryAsU64(1024);
    const accumulateMinGas = tryAsServiceGas(10n);
    const onTransferMinGas = tryAsServiceGas(20n);
    // setting gratisStorage
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
      Result.error(NewServiceError.UnprivilegedService, () => "Service 0 not privileged to set gratis storage"),
    );

    // Verify no side effects
    assert.deepStrictEqual(state.stateUpdate.services.updated, new Map());
  });

  it("should return an error if attempting to create new service with selected id that already exists", () => {
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

    const partialState = AccumulateExternalities.forService({
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

    // when
    const result = partialState.newService(
      codeHash,
      codeLengthU64,
      accumulateMinGas,
      onTransferMinGas,
      gratisStorage,
      tryAsU64(serviceId),
    );

    // then
    deepEqual(
      result,
      Result.error(NewServiceError.RegistrarServiceIdAlreadyTaken, () => "Service ID 0 already taken"),
    );

    // Verify no side effects
    assert.deepStrictEqual(state.stateUpdate.services.updated, new Map());

    // Verify next service ID is not bumped
    assert.deepStrictEqual(partialState.getNextNewServiceId(), tryAsServiceId(10));
  });

  it("should create a new service with random id if service is unprivileged to select new service id + next service id", () => {
    const state = partiallyUpdatedState();
    // setting different service than our privileged registrar
    state.stateUpdate.privilegedServices = {
      ...state.state.privilegedServices,
      registrar: tryAsServiceId(1),
    };
    const maybeService = state.state.services.get(tryAsServiceId(0));
    if (maybeService === undefined) {
      throw new Error("Invalid service!");
    }

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
```
