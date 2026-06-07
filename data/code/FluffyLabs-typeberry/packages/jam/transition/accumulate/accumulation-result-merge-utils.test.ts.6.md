---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts#L590-L691
title: packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 6
chunk_total: 10
content_sha: 9d9ff1827798368438ac1fbe1f9821e594a14df01e82aadb8d4eb8cabc56192e
language: typescript
---
`packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts` (lines 590–691)

```typescript
      const newQueue = createAuthQueue(0xaa);

      const stateUpdate = AccumulationStateUpdateBuilder.new().withAuthorizationQueue(0, newQueue).get();

      const results = AccumulationResultsBuilder.new().add(assignerA, stateUpdate).get();

      const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(resultState.authorizationQueues, stateUpdate.authorizationQueues);
    });

    it("should not update other core authorization queue", () => {
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

      const results = AccumulationResultsBuilder.new().add(assignerB, stateUpdate).get();

      const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(resultState.authorizationQueues, new Map());
    });

    it("should not update authorization queue", () => {
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

      const results = AccumulationResultsBuilder.new().add(manager, stateUpdate).get();

      const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(resultState.authorizationQueues, new Map());
    });
  });

  describe("mergeServices", () => {
    describe("mergePreimages", () => {
      it("should merge preimages provided for current service", () => {
        const state = InMemoryState.empty(tinyChainSpec);
        const inputState = AccumulationStateUpdate.empty();

        const author = tryAsServiceId(11);

        const preimage = PreimageItem.create({
          hash: Bytes.fill(HASH_SIZE, 0x02).asOpaque(),
          blob: Bytes.fill(5, 0x01),
        });

        const update = UpdatePreimage.provide({ preimage, slot: null, providedFor: author });

        const servicesUpdate = {
          created: [],
          updated: new Map(),
          removed: [],
          preimages: new Map([[author, [update]]]),
          storage: new Map(),
        };

        const stateUpdate = AccumulationStateUpdate.new(servicesUpdate);
        const results = AccumulationResultsBuilder.new().add(author, stateUpdate).get();

        const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

        deepEqual(resultState.services.preimages.get(author), [update]);
      });

      it("should route provide updates targeted at another service to that target and leave producer's list empty", () => {
        const state = InMemoryState.empty(tinyChainSpec);
        const inputState = AccumulationStateUpdate.empty();

        const author = tryAsServiceId(12);
        const target = tryAsServiceId(13);

        const preimage = PreimageItem.create({
          hash: Bytes.fill(HASH_SIZE, 0x03).asOpaque(),
          blob: Bytes.fill(3, 0x05),
        });
        const update = UpdatePreimage.provide({ preimage: preimage, slot: null, providedFor: target });

```
