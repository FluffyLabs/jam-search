---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L1252-L1349
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 11
chunk_total: 26
content_sha: 93f76d2ccbe98168181c29ec6d682743907c839078d319556dca6fe1bfb53275
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 1252–1349)

```typescript
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const coreIndex = tryAsCoreIndex(0);
    const assigners: ServiceId | null = null;
    const queue = FixedSizeArray.new(
      Array.from({ length: AUTHORIZATION_QUEUE_SIZE }, () => Bytes.fill(HASH_SIZE, 0xee).asOpaque()),
      AUTHORIZATION_QUEUE_SIZE,
    );

    // when
    const result = partialState.updateAuthorizationQueue(coreIndex, queue, assigners);

    // then
    deepEqual(
      result,
      Result.error(UpdatePrivilegesError.InvalidServiceId, () => "New auth manager is null for core 0"),
    );
    assert.deepStrictEqual(state.stateUpdate.authorizationQueues.get(coreIndex), undefined);
    // no partial privilegedServices write on error
    assert.strictEqual(state.stateUpdate.privilegedServices, null);
  });

  it("should return UnprivilegedService when current service is not privileged", () => {
    const state = partiallyUpdatedState();
    state.state.privilegedServices = PrivilegedServices.create({
      ...state.state.privilegedServices,
      assigners: asOpaqueType(FixedSizeArray.new([tryAsServiceId(1), tryAsServiceId(2)], tinyChainSpec.coresCount)),
    });
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const coreIndex = tryAsCoreIndex(0);
    const assigners = tryAsServiceId(0);
    const queue = FixedSizeArray.new(
      Array.from({ length: AUTHORIZATION_QUEUE_SIZE }, () => Bytes.fill(HASH_SIZE, 0xee).asOpaque()),
      AUTHORIZATION_QUEUE_SIZE,
    );

    // when
    const result = partialState.updateAuthorizationQueue(coreIndex, queue, assigners);

    // then
    deepEqual(
      result,
      Result.error(UpdatePrivilegesError.UnprivilegedService, () => "Service 0 not assigner for core 0 (expected: 1)"),
    );
    assert.deepStrictEqual(state.stateUpdate.authorizationQueues.get(coreIndex), undefined);
    // no partial privilegedServices write on error
    assert.strictEqual(state.stateUpdate.privilegedServices, null);
  });

  it("should return UnprivilegedService before InvalidServiceId if given auth manager is incorrect, but current servis is also unprivileged", () => {
    const state = partiallyUpdatedState();
    state.state.privilegedServices = PrivilegedServices.create({
      ...state.state.privilegedServices,
      assigners: asOpaqueType(FixedSizeArray.new([tryAsServiceId(1), tryAsServiceId(2)], tinyChainSpec.coresCount)),
    });
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const coreIndex = tryAsCoreIndex(0);
    const assigners: ServiceId | null = null;
    const queue = FixedSizeArray.new(
      Array.from({ length: AUTHORIZATION_QUEUE_SIZE }, () => Bytes.fill(HASH_SIZE, 0xee).asOpaque()),
      AUTHORIZATION_QUEUE_SIZE,
    );

    // when
    const result = partialState.updateAuthorizationQueue(coreIndex, queue, assigners);

    // then
    deepEqual(
      result,
      Result.error(UpdatePrivilegesError.UnprivilegedService, () => "Service 0 not assigner for core 0 (expected: 1)"),
    );
    assert.deepStrictEqual(state.stateUpdate.authorizationQueues.get(coreIndex), undefined);
    // no partial privilegedServices write on error
    assert.strictEqual(state.stateUpdate.privilegedServices, null);
  });

  it("should succeed on a self-transfer using CURRENT_SERVICE_ID", () => {
    const state = partiallyUpdatedState();
    // inject a service info for CURRENT_SERVICE_ID so it can act as the
    // current (and assigning) service on core 0
```
