---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts#L311-L406
title: packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 3
chunk_total: 10
content_sha: a44447cca99943cd245ee343f676110ca490c7298ecd9da837fe587cbd7dd6f2
language: typescript
---
`packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts` (lines 311–406)

```typescript
    it("shoult update delegator (own privledges)", () => {
      const manager = tryAsServiceId(1);
      const delegator = tryAsServiceId(5);
      const initialPrivilegedServices = createPrivilegedServices({ manager, delegator });
      const state = InMemoryState.partial(tinyChainSpec, { privilegedServices: initialPrivilegedServices });

      const inputState = AccumulationStateUpdateBuilder.new().get();

      const newDelegator = tryAsServiceId(42);

      const stateUpdate = AccumulationStateUpdateBuilder.new()
        .withPrivilegedServices(initialPrivilegedServices)
        .withDelegator(newDelegator)
        .get();

      const results = AccumulationResultsBuilder.new().add(delegator, stateUpdate).get();

      const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(resultState.privilegedServices, createPrivilegedServices({ manager, delegator: newDelegator }));
    });

    it("should not update delegator (own privledges)", () => {
      const manager = tryAsServiceId(1);
      const registrar = tryAsServiceId(5);
      const delegator = tryAsServiceId(6);
      const assignerA = tryAsServiceId(7);
      const assignerB = tryAsServiceId(8);
      const assigners = tryAsPerCore([assignerA, assignerB], tinyChainSpec);
      const initialPrivilegedServices = createPrivilegedServices({ manager, registrar, delegator, assigners });
      const state = InMemoryState.partial(tinyChainSpec, { privilegedServices: initialPrivilegedServices });

      const inputState = AccumulationStateUpdateBuilder.new().get();

      const newDelegator = tryAsServiceId(42);

      const stateUpdate = AccumulationStateUpdateBuilder.new()
        .withPrivilegedServices(initialPrivilegedServices)
        .withDelegator(newDelegator)
        .get();

      const results = AccumulationResultsBuilder.new()
        .add(registrar, AccumulationStateUpdate.copyFrom(stateUpdate))
        .add(assignerA, AccumulationStateUpdate.copyFrom(stateUpdate))
        .add(assignerB, AccumulationStateUpdate.copyFrom(stateUpdate))
        .get();

      const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(resultState.privilegedServices, initialPrivilegedServices);
    });

    it("shoult update assigner (own privledges)", () => {
      const manager = tryAsServiceId(1);
      const delegator = tryAsServiceId(2);
      const registrar = tryAsServiceId(3);
      const assignerA = tryAsServiceId(10);
      const assignerB = tryAsServiceId(11);
      const assigners = tryAsPerCore([assignerA, assignerB], tinyChainSpec);
      const initialPrivilegedServices = createPrivilegedServices({ manager, assigners, delegator, registrar });
      const state = InMemoryState.partial(tinyChainSpec, {
        privilegedServices: initialPrivilegedServices,
      });

      const inputState = AccumulationStateUpdate.empty();

      const newAssigners = [...assigners];
      newAssigners[0] = tryAsServiceId(99);

      const results = AccumulationResultsBuilder.new()
        .add(
          assignerA,
          AccumulationStateUpdateBuilder.new()
            .withPrivilegedServices(initialPrivilegedServices)
            .withAssigners(newAssigners)
            .get(),
        )
        .get();

      const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(
        resultState.privilegedServices,
        createPrivilegedServices({
          ...initialPrivilegedServices,
          assigners: tryAsPerCore(newAssigners, tinyChainSpec),
        }),
      );
    });

    it("shoult not update assigner (own privledges)", () => {
      const manager = tryAsServiceId(1);
      const delegator = tryAsServiceId(2);
      const registrar = tryAsServiceId(3);
      const assignerA = tryAsServiceId(10);
      const assignerB = tryAsServiceId(11);
```
