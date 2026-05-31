---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts#L687-L786
title: packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 7
chunk_total: 10
content_sha: 8a421be047d31efe23162a2481733e91c5423336e39838564161174b96c55f9a
language: typescript
---
`packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts` (lines 687–786)

```typescript
          hash: Bytes.fill(HASH_SIZE, 0x03).asOpaque(),
          blob: Bytes.fill(3, 0x05),
        });
        const update = UpdatePreimage.provide({ preimage: preimage, slot: null, providedFor: target });

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

        deepEqual(resultState.services.preimages.get(author), []);
        deepEqual(resultState.services.preimages.get(target), [update]);
      });
    });

    describe("mergeStorage", () => {
      it("should apply storage updates provided by the service", () => {
        const state = InMemoryState.empty(tinyChainSpec);
        const inputState = AccumulationStateUpdate.empty();

        const serviceId = tryAsServiceId(5);
        const storageSetUpdate = createStorageSetUpdate(1, 10);
        const storageRemoveUpdate = createStorageRemoveUpdate(2);
        const storageUpdates = [storageSetUpdate, storageRemoveUpdate];

        const stateUpdate = AccumulationStateUpdateBuilder.new().withServiceStorage(serviceId, storageUpdates).get();

        const results = AccumulationResultsBuilder.new().add(serviceId, stateUpdate).get();

        const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

        deepEqual(resultState.services.storage.get(serviceId), storageUpdates);
      });
    });

    describe("mergeCreatedServices", () => {
      it("should add newly created services and copy their updates", () => {
        const state = InMemoryState.empty(tinyChainSpec);
        const inputState = AccumulationStateUpdate.empty();

        const author = tryAsServiceId(1);
        const createdId = tryAsServiceId(200);

        const accountInfo = ServiceAccountInfo.create({
          codeHash: Bytes.zero(HASH_SIZE).asOpaque(),
          balance: tryAsU64(100n),
          accumulateMinGas: tryAsServiceGas(10n),
          onTransferMinGas: tryAsServiceGas(5n),
          storageUtilisationBytes: tryAsU64(0n),
          gratisStorage: tryAsU64(0n),
          storageUtilisationCount: tryAsU32(0),
          created: tryAsTimeSlot(0),
          lastAccumulation: tryAsTimeSlot(0),
          parentService: tryAsServiceId(0),
        });

        const update = UpdateService.create({ serviceInfo: accountInfo, lookupHistory: null });

        const servicesUpdate = {
          created: [createdId],
          updated: new Map([[createdId, update]]),
          removed: [],
          preimages: new Map(),
          storage: new Map(),
        };

        const stateUpdate = AccumulationStateUpdate.new(servicesUpdate);

        const results = AccumulationResultsBuilder.new().add(author, stateUpdate).get();

        const { state: resultState } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

        deepEqual(resultState.services.created, [createdId]);
        deepEqual(resultState.services.updated.get(createdId), update);
      });
    });

    describe("mergeUpdatedServices", () => {
      it("should copy service update", () => {
        const state = InMemoryState.empty(tinyChainSpec);
        const inputState = AccumulationStateUpdate.empty();

        const serviceId = tryAsServiceId(10);

        const accountInfo = ServiceAccountInfo.create({
          codeHash: Bytes.zero(HASH_SIZE).asOpaque(),
          balance: tryAsU64(500n),
          accumulateMinGas: tryAsServiceGas(10n),
          onTransferMinGas: tryAsServiceGas(5n),
          storageUtilisationBytes: tryAsU64(0n),
          gratisStorage: tryAsU64(0n),
          storageUtilisationCount: tryAsU32(0),
```
