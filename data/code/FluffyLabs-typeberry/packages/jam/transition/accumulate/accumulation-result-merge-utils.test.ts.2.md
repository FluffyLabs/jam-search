---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts#L225-L314
title: packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 2
chunk_total: 10
content_sha: 2696097f66f12f0fae87412d3297a8ae866458db6d99a4a3c604fe435a27c39c
language: typescript
---
`packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts` (lines 225–314)

```typescript
          AccumulationStateUpdateBuilder.new().withPrivilegedServices(newPrivilegedServices).get(),
        )
        .get();

      const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(resultState.privilegedServices, newPrivilegedServices);
    });

    it("should not update privilegedServices if there is no privileged services in state update", () => {
      const initialPrivilegedServices = PrivilegedServices.create({
        manager: tryAsServiceId(1),
        assigners: tryAsPerCore(Array(tinyChainSpec.coresCount).fill(tryAsServiceId(2)), tinyChainSpec),
        delegator: tryAsServiceId(3),
        registrar: tryAsServiceId(4),
        autoAccumulateServices: new Map([[tryAsServiceId(5), tryAsServiceGas(123n)]]),
      });

      const state = InMemoryState.partial(tinyChainSpec, {
        privilegedServices: initialPrivilegedServices,
      });
      const currentManagerServiceId = state.privilegedServices.manager;

      const inputState = AccumulationStateUpdate.empty();

      const results = AccumulationResultsBuilder.new()
        .add(currentManagerServiceId, AccumulationStateUpdate.empty())
        .get();

      const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(resultState.privilegedServices, null);
    });

    it("should update registrar (own privledges)", () => {
      const manager = tryAsServiceId(1);
      const registrar = tryAsServiceId(5);
      const initialPrivilegedServices = createPrivilegedServices({ manager, registrar });
      const state = InMemoryState.partial(tinyChainSpec, { privilegedServices: initialPrivilegedServices });

      const inputState = AccumulationStateUpdateBuilder.new().get();

      const newRegistrar = tryAsServiceId(42);

      const stateUpdate = AccumulationStateUpdateBuilder.new()
        .withPrivilegedServices(initialPrivilegedServices)
        .withRegistrar(newRegistrar)
        .get();

      const results = AccumulationResultsBuilder.new().add(registrar, stateUpdate).get();

      const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(resultState.privilegedServices, createPrivilegedServices({ manager, registrar: newRegistrar }));
    });

    it("should not update registrar (own privledges)", () => {
      const manager = tryAsServiceId(1);
      const registrar = tryAsServiceId(5);
      const delegator = tryAsServiceId(6);
      const assignerA = tryAsServiceId(7);
      const assignerB = tryAsServiceId(8);
      const assigners = tryAsPerCore([assignerA, assignerB], tinyChainSpec);
      const initialPrivilegedServices = createPrivilegedServices({ manager, registrar, delegator, assigners });
      const state = InMemoryState.partial(tinyChainSpec, { privilegedServices: initialPrivilegedServices });

      const inputState = AccumulationStateUpdateBuilder.new().get();

      const newRegistrar = tryAsServiceId(42);

      const stateUpdate = AccumulationStateUpdateBuilder.new()
        .withPrivilegedServices(initialPrivilegedServices)
        .withRegistrar(newRegistrar)
        .get();

      const results = AccumulationResultsBuilder.new()
        .add(delegator, AccumulationStateUpdate.copyFrom(stateUpdate))
        .add(assignerA, AccumulationStateUpdate.copyFrom(stateUpdate))
        .add(assignerB, AccumulationStateUpdate.copyFrom(stateUpdate))
        .get();

      const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(resultState.privilegedServices, initialPrivilegedServices);
    });

    it("shoult update delegator (own privledges)", () => {
      const manager = tryAsServiceId(1);
      const delegator = tryAsServiceId(5);
      const initialPrivilegedServices = createPrivilegedServices({ manager, delegator });
```
