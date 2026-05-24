---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts#L881-L923
title: packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 9
chunk_total: 10
content_sha: ab5ca2c3a42a4a3453a8099db4323f247302d63f4c8ba6dd983454b9c6410899
language: typescript
---
`packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts` (lines 881–923)

```typescript
      const transfer1 = createTransfer({ source: 1, destination: 2, amount: tryAsU64(100n), gas: 50n });
      const transfer2 = createTransfer({ source: 1, destination: 3, amount: tryAsU64(150n), gas: 60n });

      const results = AccumulationResultsBuilder.new()
        .add(1, AccumulationStateUpdateBuilder.new().withTransfers([transfer1, transfer2]).get())
        .get();

      const { transfers } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(transfers, [transfer1, transfer2]);
    });
  });

  describe("mergeTotalGas", () => {
    it("should sum consumed gas from parallel results", () => {
      const state = InMemoryState.empty(tinyChainSpec);
      const inputState = AccumulationStateUpdate.empty();

      const results = AccumulationResultsBuilder.new()
        .add(1, AccumulationStateUpdate.empty(), 10n)
        .add(2, AccumulationStateUpdate.empty(), 20n)
        .get();

      const { totalGasCost } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(totalGasCost, tryAsServiceGas(30n));
    });

    it("should clamp to MAX_VALUE_U64 on overflow", () => {
      const state = InMemoryState.empty(tinyChainSpec);
      const inputState = AccumulationStateUpdate.empty();

      const results = AccumulationResultsBuilder.new()
        .add(1, AccumulationStateUpdate.empty(), MAX_VALUE_U64)
        .add(2, AccumulationStateUpdate.empty(), MAX_VALUE_U64)
        .get();

      const { totalGasCost } = mergePerallelAccumulationResults(tinyChainSpec, state, inputState, results);

      deepEqual(totalGasCost, tryAsServiceGas(MAX_VALUE_U64));
    });
  });
});
```
