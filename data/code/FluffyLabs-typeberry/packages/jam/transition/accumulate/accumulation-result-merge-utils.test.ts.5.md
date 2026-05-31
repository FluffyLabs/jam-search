---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts#L501-L595
title: packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 5
chunk_total: 10
content_sha: 086b196173e777ba1142af45c66ae925ad803aafa9fb7afb761db3b832722450
language: typescript
---
`packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts` (lines 501–595)

```typescript
        .get();

      const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(resultState.privilegedServices, managerUpdate.privilegedServices);
    });
  });

  describe("mergeValidatorsData", () => {
    it("should update validators data when delegator service provides it", () => {
      const delegatorServiceId = tryAsServiceId(5);
      const state = InMemoryState.empty(tinyChainSpec);
      const inputState = AccumulationStateUpdateBuilder.new()
        .withPrivilegedServices(createPrivilegedServices())
        .withDelegator(delegatorServiceId)
        .get();

      const newValidatorsData = createValidatorsData(1);

      const results = AccumulationResultsBuilder.new()
        .add(delegatorServiceId, AccumulationStateUpdateBuilder.new().withValidatorsData(newValidatorsData).get())
        .get();

      const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(resultState.validatorsData, newValidatorsData);
    });

    it("should not update validators data when non-delegator service provides it", () => {
      const delegatorServiceId = tryAsServiceId(5);
      const otherServiceId = tryAsServiceId(10);
      const state = InMemoryState.empty(tinyChainSpec);
      const initialValidatorsData = createValidatorsData(0);

      const inputState = AccumulationStateUpdateBuilder.new()
        .withPrivilegedServices(createPrivilegedServices())
        .withDelegator(delegatorServiceId)
        .withValidatorsData(initialValidatorsData)
        .get();

      const newValidatorsData = createValidatorsData(1);
      const stateUpdate = AccumulationStateUpdateBuilder.new().withValidatorsData(newValidatorsData).get();

      const results = new Map([[otherServiceId, { consumedGas: tryAsServiceGas(10n), stateUpdate }]]);

      const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(resultState.validatorsData, initialValidatorsData);
    });

    it("should not update validators data when delegator provides no data", () => {
      const delegatorServiceId = tryAsServiceId(5);
      const otherServiceId = tryAsServiceId(10);
      const state = InMemoryState.empty(tinyChainSpec);
      const initialValidatorsData = createValidatorsData(0);

      const inputState = AccumulationStateUpdateBuilder.new()
        .withPrivilegedServices(createPrivilegedServices())
        .withDelegator(delegatorServiceId)
        .withValidatorsData(initialValidatorsData)
        .get();

      const stateUpdate = AccumulationStateUpdateBuilder.new().get();

      const results = new Map([[otherServiceId, { consumedGas: tryAsServiceGas(10n), stateUpdate }]]);

      const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(resultState.validatorsData, initialValidatorsData);
    });
  });

  describe("mergeAuthorizationQueues", () => {
    function createAuthQueue(fillByte: number): AuthorizerHash[] {
      return Array(AUTHORIZATION_QUEUE_SIZE).fill(Bytes.fill(HASH_SIZE, fillByte).asOpaque());
    }

    it("should update own core authorization queue", () => {
      const manager = tryAsServiceId(1);
      const assignerA = tryAsServiceId(10);
      const assignerB = tryAsServiceId(11);
      const assigners = tryAsPerCore([assignerA, assignerB], tinyChainSpec);

      const state = InMemoryState.partial(tinyChainSpec, {
        privilegedServices: createPrivilegedServices({ manager, assigners }),
      });

      const inputState = AccumulationStateUpdate.empty();

      const newQueue = createAuthQueue(0xaa);

      const stateUpdate = AccumulationStateUpdateBuilder.new().withAuthorizationQueue(0, newQueue).get();

      const results = AccumulationResultsBuilder.new().add(assignerA, stateUpdate).get();

```
