---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts#L782-L884
title: packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 8
chunk_total: 10
content_sha: d965a38262c412c7e86d216f9cc430afdf1674853ce76ed57fb4c0808dfd0979
language: typescript
---
`packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts` (lines 782–884)

```typescript
          accumulateMinGas: tryAsServiceGas(10n),
          onTransferMinGas: tryAsServiceGas(5n),
          storageUtilisationBytes: tryAsU64(0n),
          gratisStorage: tryAsU64(0n),
          storageUtilisationCount: tryAsU32(0),
          created: tryAsTimeSlot(0),
          lastAccumulation: tryAsTimeSlot(0),
          parentService: tryAsServiceId(0),
        });

        const update = UpdateService.update({ serviceInfo: accountInfo });

        const servicesUpdate = {
          created: [],
          updated: new Map([[serviceId, update]]),
          removed: [],
          preimages: new Map(),
          storage: new Map(),
        };

        const stateUpdate = AccumulationStateUpdate.new(servicesUpdate);

        const results = AccumulationResultsBuilder.new().add(serviceId, stateUpdate).get();

        const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

        deepEqual(resultState.services.updated.get(serviceId), update);
      });
    });

    describe("mergeRemovedServices", () => {
      it("should copy removed services and their preimage updates", () => {
        const state = InMemoryState.empty(tinyChainSpec);
        const inputState = AccumulationStateUpdate.empty();

        const author = tryAsServiceId(7);
        const removedId = tryAsServiceId(250);

        const removeUpdate = UpdatePreimage.remove({
          hash: Bytes.fill(HASH_SIZE, 0x42).asOpaque(),
          length: tryAsU32(5),
        });

        const servicesUpdate = {
          created: [],
          updated: new Map(),
          removed: [removedId],
          preimages: new Map([[removedId, [removeUpdate]]]),
          storage: new Map(),
        };

        const stateUpdate = AccumulationStateUpdate.new(servicesUpdate);

        const results = AccumulationResultsBuilder.new().add(author, stateUpdate).get();

        const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

        deepEqual(resultState.services.removed, [removedId]);
        deepEqual(resultState.services.preimages.get(removedId), [removeUpdate]);
      });
    });
  });

  describe("mergeTransfers", () => {
    it("should collect transfers from all service results", () => {
      const state = InMemoryState.empty(tinyChainSpec);
      const inputState = AccumulationStateUpdate.empty();

      const transfer1 = createTransfer({ source: 1, destination: 2, amount: tryAsU64(100n), gas: 50n });
      const transfer2 = createTransfer({ source: 3, destination: 4, amount: tryAsU64(200n), gas: 75n });

      const results = AccumulationResultsBuilder.new()
        .add(1, AccumulationStateUpdateBuilder.new().withTransfers([transfer1]).get())
        .add(2, AccumulationStateUpdateBuilder.new().withTransfers([transfer2]).get())
        .get();

      const { transfers } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(transfers, [transfer1, transfer2]);
    });

    it("should handle empty transfers from all services", () => {
      const state = InMemoryState.empty(tinyChainSpec);
      const inputState = AccumulationStateUpdate.empty();

      const results = AccumulationResultsBuilder.new()
        .add(1, AccumulationStateUpdate.empty())
        .add(2, AccumulationStateUpdate.empty())
        .get();

      const { transfers } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(transfers, []);
    });

    it("should handle multiple transfers from a single service", () => {
      const state = InMemoryState.empty(tinyChainSpec);
      const inputState = AccumulationStateUpdate.empty();

      const transfer1 = createTransfer({ source: 1, destination: 2, amount: tryAsU64(100n), gas: 50n });
      const transfer2 = createTransfer({ source: 1, destination: 3, amount: tryAsU64(150n), gas: 60n });

      const results = AccumulationResultsBuilder.new()
```
