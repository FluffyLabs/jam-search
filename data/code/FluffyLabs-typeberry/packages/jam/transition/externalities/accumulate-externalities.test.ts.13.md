---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L1436-L1549
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 13
chunk_total: 26
content_sha: c09321d5070f80d4473aecc94eaeda46f741af155d4c79341154fcd917963b0c
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 1436–1549)

```typescript
describe("PartialState.updatePrivilegedServices", () => {
  it("should update privileged services", () => {
    const state = partiallyUpdatedState();
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
    const registrar = tryAsServiceId(4);
    const autoAccumulateServices = new Map([
      [tryAsServiceId(4), tryAsServiceGas(10n)],
      [tryAsServiceId(5), tryAsServiceGas(20n)],
    ]);

    // when
    const result = partialState.updatePrivilegedServices(
      manager,
      assigners,
      delegator,
      registrar,
      autoAccumulateServices,
    );

    // then
    assert.deepStrictEqual(result, Result.ok(OK));
    assert.deepStrictEqual(
      state.stateUpdate.privilegedServices,
      PrivilegedServices.create({
        manager,
        assigners,
        delegator,
        registrar,
        autoAccumulateServices,
      }),
    );
  });

  it("should return InvalidService when given manager is invalid service id", () => {
    const state = partiallyUpdatedState();
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const manager: ServiceId | null = null;
    const assigners = tryAsPerCore(new Array(tinyChainSpec.coresCount).fill(tryAsServiceId(2)), tinyChainSpec);
    const delegator = tryAsServiceId(3);
    const registrar = tryAsServiceId(4);
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

  it("should return InvalidService when given validator is invalid service id", () => {
    const state = partiallyUpdatedState();
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
    const delegator: ServiceId | null = null;
    const registrar = tryAsServiceId(4);
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

  it("should return InvalidService when given registrar is invalid service id", () => {
    const state = partiallyUpdatedState();
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
```
