---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/statistics.test.ts#L581-L637
title: packages/jam/transition/statistics.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 6
chunk_total: 7
content_sha: 3e87104823687895875eafae1f126f742ac4530eb2ecb6aeff1013113ce490f6
language: typescript
---
`packages/jam/transition/statistics.test.ts` (lines 581–637)

```typescript
      assert.deepEqual(statistics.state.statistics.services.get(serviceIndex), serviceStatistics.get(serviceIndex));

      const update = statistics.transition({
        slot: currentSlot,
        authorIndex: validatorIndex,
        extrinsic: extrinsic,
        incomingReports: [],
        availableReports: [],
        accumulationStatistics: new Map(),
        currentValidatorData,
        reporters,
      });
      const state = copyAndUpdateState(statistics.state, update);

      assert.deepEqual(state.statistics.services.get(serviceIndex), expectedStatistics);
    });

    it("should update accumulation score of service statistics based on accumulation statistics", () => {
      const {
        statistics,
        currentSlot,
        validatorIndex,
        serviceIndex,
        serviceStatistics,
        currentValidatorData,
        reporters,
      } = prepareData({
        previousSlot: 0,
        currentSlot: 1,
      });

      const accumulationStatistics = new Map([[tryAsServiceId(0), countGasUsed(1, 3n)]]);

      const expectedStatistics = {
        ...serviceStatistics.get(serviceIndex),
        accumulateCount: 1,
        accumulateGasUsed: 3n,
      };

      assert.deepEqual(statistics.state.statistics.services.get(serviceIndex), serviceStatistics.get(serviceIndex));

      const update = statistics.transition({
        slot: currentSlot,
        authorIndex: validatorIndex,
        extrinsic: getExtrinsic(),
        incomingReports: [],
        availableReports: [],
        accumulationStatistics,
        currentValidatorData,
        reporters,
      });
      const state = copyAndUpdateState(statistics.state, update);

      assert.deepEqual(state.statistics.services.get(serviceIndex), expectedStatistics);
    });
  });
});
```
