---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts#L402-L505
title: packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 4
chunk_total: 10
content_sha: 2bbb6cf7b362331360ea37f231bfb4a6b027c0542335944846bf64914b99aebc
language: typescript
---
`packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts` (lines 402–505)

```typescript
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

      const newAssignersToSetByAssignerA = [assignerA, 98];
      const newAssignersToSetByAssignerB = [99, assignerB];
      const newAssignersToSetByOthers = [100, 101];

      const results = AccumulationResultsBuilder.new()
        .add(
          assignerA,
          AccumulationStateUpdateBuilder.new()
            .withPrivilegedServices(initialPrivilegedServices)
            .withAssigners(newAssignersToSetByAssignerA)
            .get(),
        )
        .add(
          assignerB,
          AccumulationStateUpdateBuilder.new()
            .withPrivilegedServices(initialPrivilegedServices)
            .withAssigners(newAssignersToSetByAssignerB)
            .get(),
        )
        .add(
          delegator,
          AccumulationStateUpdateBuilder.new()
            .withPrivilegedServices(initialPrivilegedServices)
            .withAssigners(newAssignersToSetByOthers)
            .get(),
        )
        .add(
          registrar,
          AccumulationStateUpdateBuilder.new()
            .withPrivilegedServices(initialPrivilegedServices)
            .withAssigners(newAssignersToSetByOthers)
            .get(),
        )
        .get();

      const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(resultState.privilegedServices, initialPrivilegedServices);
    });

    it("should override self-updated changes", () => {
      const manager = tryAsServiceId(1);
      const delegator = tryAsServiceId(2);
      const registrar = tryAsServiceId(3);
      const assignerA = tryAsServiceId(4);
      const assignerB = tryAsServiceId(5);
      const assigners = tryAsPerCore([assignerA, assignerB], tinyChainSpec);

      const initialPrivilegedServices = createPrivilegedServices({ manager, assigners, registrar, delegator });

      const state = InMemoryState.partial(tinyChainSpec, {
        privilegedServices: initialPrivilegedServices,
      });

      const inputState = AccumulationStateUpdate.empty();

      const delegatorUpdate = AccumulationStateUpdateBuilder.new()
        .withPrivilegedServices(initialPrivilegedServices)
        .withDelegator(22)
        .get();
      const registrarUpdate = AccumulationStateUpdateBuilder.new()
        .withPrivilegedServices(initialPrivilegedServices)
        .withRegistrar(23)
        .get();
      const assignerAUpdate = AccumulationStateUpdateBuilder.new()
        .withPrivilegedServices(initialPrivilegedServices)
        .withAssigners([24, assignerB])
        .get();
      const assignerBUpdate = AccumulationStateUpdateBuilder.new()
        .withPrivilegedServices(initialPrivilegedServices)
        .withAssigners([assignerA, 25])
        .get();

      const managerUpdate = AccumulationStateUpdateBuilder.new()
        .withPrivilegedServices(initialPrivilegedServices)
        .withDelegator(32)
        .withRegistrar(33)
        .withAssigners([34, 35])
        .get();

      const results = AccumulationResultsBuilder.new()
        .add(delegator, delegatorUpdate)
        .add(registrar, registrarUpdate)
        .add(assignerA, assignerAUpdate)
        .add(assignerB, assignerBUpdate)
        .add(manager, managerUpdate)
        .get();

      const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(resultState.privilegedServices, managerUpdate.privilegedServices);
```
