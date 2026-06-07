---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/statistics.test.ts#L410-L495
title: packages/jam/transition/statistics.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 4
chunk_total: 7
content_sha: a6e77367dc5ad0dd774abecf4b0fad305f47099c45e588038e5ac8bd528d5858
language: typescript
---
`packages/jam/transition/statistics.test.ts` (lines 410–495)

```typescript
      const { statistics, currentSlot, validatorIndex, currentStatistics, currentValidatorData, reporters } =
        prepareData({
          previousSlot: 0,
          currentSlot: 1,
          reporters: asKnownSize(validatorsData.map((v) => v.ed25519)),
          currentValidatorData: tryAsPerValidator(validatorsData, tinyChainSpec),
        });
      const validatorIndex2 = tryAsValidatorIndex(1);
      const validatorIndex3 = tryAsValidatorIndex(2);
      const guarantees = [] as unknown as GuaranteesExtrinsic;
      const extrinsic = getExtrinsic({ guarantees });
      const expectedStatistics = { ...currentStatistics[validatorIndex], blocks: 1, guarantees: 1 };
      const expectedStatistics2 = { ...currentStatistics[validatorIndex2], blocks: 0, guarantees: 1 };
      const expectedStatistics3 = { ...currentStatistics[validatorIndex3], blocks: 0, guarantees: 1 };

      assert.strictEqual(statistics.state.statistics.current[validatorIndex].guarantees, 0);
      assert.strictEqual(statistics.state.statistics.current[validatorIndex2].guarantees, 0);
      assert.strictEqual(statistics.state.statistics.current[validatorIndex3].guarantees, 0);

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

      assert.deepEqual(state.statistics.current[validatorIndex], expectedStatistics);
      assert.deepEqual(state.statistics.current[validatorIndex2], expectedStatistics2);
      assert.deepEqual(state.statistics.current[validatorIndex3], expectedStatistics3);
    });

    it("should update assurances for each validator based on assurances from extrinstic", () => {
      const { statistics, currentSlot, validatorIndex, currentStatistics, currentValidatorData, reporters } =
        prepareData({
          previousSlot: 0,
          currentSlot: 1,
        });
      const assurances = asKnownSize([createAssurance(validatorIndex)]) as unknown as AssurancesExtrinsic;
      const extrinsic = getExtrinsic({ assurances });
      const expectedStatistics = { ...currentStatistics[validatorIndex], blocks: 1, assurances: 1 };

      assert.strictEqual(statistics.state.statistics.current[validatorIndex].assurances, 0);

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

      assert.deepEqual(state.statistics.current[validatorIndex], expectedStatistics);
    });

    it("should update refine score of core statistics based on incoming work-reports", () => {
      const { statistics, currentSlot, validatorIndex, coreStatistics, currentValidatorData, reporters } = prepareData({
        previousSlot: 0,
        currentSlot: 1,
      });
      const coreIndex = tryAsCoreIndex(0);
      const guarantees = [{ credentials: [{ validatorIndex }] }] as unknown as GuaranteesExtrinsic;
      const extrinsic = getExtrinsic({ guarantees });
      const incomingReports = asKnownSize([createWorkReport(coreIndex)]);
      const expectedStatistics = { ...coreStatistics[coreIndex], bundleSize: 2253240945 };

      assert.deepEqual(statistics.state.statistics.cores[coreIndex], coreStatistics[coreIndex]);

      const update = statistics.transition({
        slot: currentSlot,
        authorIndex: validatorIndex,
        extrinsic: extrinsic,
        incomingReports,
        availableReports: [],
        accumulationStatistics: new Map(),
        currentValidatorData,
        reporters,
      });
```
