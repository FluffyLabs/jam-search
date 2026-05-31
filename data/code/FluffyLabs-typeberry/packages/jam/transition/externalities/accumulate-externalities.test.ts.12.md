---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L1346-L1439
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 12
chunk_total: 26
content_sha: 47e66c232ca63ca268bcfb461ee0d1b2c56c7523c221ef1f9bb886aa54edff61
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 1346–1439)

```typescript
  it("should succeed on a self-transfer using CURRENT_SERVICE_ID", () => {
    const state = partiallyUpdatedState();
    // inject a service info for CURRENT_SERVICE_ID so it can act as the
    // current (and assigning) service on core 0
    const baseService = state.state.services.get(tryAsServiceId(0));
    if (baseService === undefined) {
      throw new Error("Invalid service!");
    }
    state.state.services.set(
      CURRENT_SERVICE_ID,
      InMemoryService.new(CURRENT_SERVICE_ID, {
        info: baseService.data.info,
        preimages: HashDictionary.new(),
        lookupHistory: HashDictionary.new(),
        storage: new Map(),
      }),
    );
    state.state.privilegedServices = PrivilegedServices.create({
      ...state.state.privilegedServices,
      assigners: asOpaqueType(FixedSizeArray.new([CURRENT_SERVICE_ID, tryAsServiceId(0)], tinyChainSpec.coresCount)),
    });
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: CURRENT_SERVICE_ID,
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const coreIndex = tryAsCoreIndex(0);
    const queue = FixedSizeArray.new(
      Array.from({ length: AUTHORIZATION_QUEUE_SIZE }, () => Bytes.fill(HASH_SIZE, 0xee).asOpaque()),
      AUTHORIZATION_QUEUE_SIZE,
    );

    // when
    const result = partialState.updateAuthorizationQueue(coreIndex, queue, CURRENT_SERVICE_ID);

    // then
    deepEqual(result, Result.ok(OK));
    assert.deepStrictEqual(state.stateUpdate.authorizationQueues.get(coreIndex), queue);
    const updated = state.stateUpdate.privilegedServices;
    assert.ok(updated !== null, "stateUpdate.privilegedServices should be written");
    assert.strictEqual(updated.assigners[0], CURRENT_SERVICE_ID);
    assert.strictEqual(updated.assigners[1], tryAsServiceId(0));
  });

  it("should prevent the previous assigner from re-assigning after transfer", () => {
    const state = partiallyUpdatedState();
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const coreIndex = tryAsCoreIndex(0);
    const newAssigner = tryAsServiceId(99);
    const firstQueue = FixedSizeArray.new(
      Array.from({ length: AUTHORIZATION_QUEUE_SIZE }, () => Bytes.fill(HASH_SIZE, 0xee).asOpaque()),
      AUTHORIZATION_QUEUE_SIZE,
    );
    const secondQueue = FixedSizeArray.new(
      Array.from({ length: AUTHORIZATION_QUEUE_SIZE }, () => Bytes.fill(HASH_SIZE, 0xff).asOpaque()),
      AUTHORIZATION_QUEUE_SIZE,
    );

    // when: first call succeeds and transfers the assigner to service 99
    const first = partialState.updateAuthorizationQueue(coreIndex, firstQueue, newAssigner);
    // and the previous assigner (service 0) immediately tries to re-assign
    const second = partialState.updateAuthorizationQueue(coreIndex, secondQueue, tryAsServiceId(0));

    // then
    deepEqual(first, Result.ok(OK));
    deepEqual(
      second,
      Result.error(UpdatePrivilegesError.UnprivilegedService, () => "Service 0 not assigner for core 0 (expected: 99)"),
    );
    // the first queue remains — the failing second call must not overwrite it
    assert.deepStrictEqual(state.stateUpdate.authorizationQueues.get(coreIndex), firstQueue);
    // and the transferred assigner is still in place
    const updated = state.stateUpdate.privilegedServices;
    assert.ok(updated !== null);
    assert.strictEqual(updated.assigners[0], newAssigner);
  });
});

describe("PartialState.updatePrivilegedServices", () => {
  it("should update privileged services", () => {
    const state = partiallyUpdatedState();
    const partialState = AccumulateExternalities.forService({
```
