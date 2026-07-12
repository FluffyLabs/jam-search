---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/statistics.test.ts#L488-L588
title: packages/jam/transition/statistics.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 5
chunk_total: 7
content_sha: c9f26e5f288115af8a7f4723c82333bf927efaf46b666e087578c11b17e833e4
language: typescript
---
`packages/jam/transition/statistics.test.ts` (lines 488–588)

```typescript
        authorIndex: validatorIndex,
        extrinsic: extrinsic,
        incomingReports,
        availableReports: [],
        accumulationStatistics: new Map(),
        currentValidatorData,
        reporters,
      });
      const state = copyAndUpdateState(statistics.state, update);

      assert.deepEqual(state.statistics.cores[coreIndex], expectedStatistics);
    });

    it("should update popularity score of core statistics based on assurances", () => {
      const { statistics, currentSlot, validatorIndex, coreStatistics, currentValidatorData, reporters } = prepareData({
        previousSlot: 0,
        currentSlot: 1,
      });
      const coreIndex = tryAsCoreIndex(0);
      const bitvec = BitVec.fromBlob(BytesBlob.parseBlob("0xff").raw, tinyChainSpec.coresCount);
      const assurances = asKnownSize([createAssurance(validatorIndex, bitvec)]) as unknown as AssurancesExtrinsic;
      const extrinsic = getExtrinsic({ assurances });
      const expectedStatistics = { ...coreStatistics[coreIndex], popularity: 1 };

      assert.deepEqual(statistics.state.statistics.cores[coreIndex], coreStatistics[coreIndex]);

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

      assert.deepEqual(state.statistics.cores[coreIndex], expectedStatistics);
    });

    it("should update data availability score of core statistics based on available work-reports", () => {
      const { statistics, currentSlot, validatorIndex, coreStatistics, currentValidatorData, reporters } = prepareData({
        previousSlot: 0,
        currentSlot: 1,
      });
      const coreIndex = tryAsCoreIndex(0);
      const guarantees = [{ credentials: [{ validatorIndex }] }] as unknown as GuaranteesExtrinsic;
      const extrinsic = getExtrinsic({ guarantees });
      const availableReports = asKnownSize([createWorkReport(coreIndex)]);
      const expectedStatistics = { ...coreStatistics[coreIndex], dataAvailabilityLoad: 2253257361 };

      assert.deepEqual(statistics.state.statistics.cores[coreIndex], coreStatistics[coreIndex]);

      const update = statistics.transition({
        slot: currentSlot,
        authorIndex: validatorIndex,
        extrinsic: extrinsic,
        incomingReports: asKnownSize([]),
        availableReports,
        accumulationStatistics: new Map(),
        currentValidatorData,
        reporters,
      });
      const state = copyAndUpdateState(statistics.state, update);

      assert.deepEqual(state.statistics.cores[coreIndex], expectedStatistics);
    });

    it("should update provided score of service statistics based on extrinstic preimages", () => {
      const preimages: PreimagesExtrinsic = asKnownSize([createPreimage(1), createPreimage(2), createPreimage(3)]);
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
      const guarantees = [
        { report: createWorkReport(tryAsCoreIndex(0)), credentials: [{ validatorIndex }] },
      ] as unknown as GuaranteesExtrinsic;
      const extrinsic = getExtrinsic({ guarantees, preimages });
      const expectedStatistics = {
        ...serviceStatistics.get(serviceIndex),
        providedCount: 3,
        providedSize: 6, // 1 + 2 + 3
      };

      assert.deepEqual(statistics.state.statistics.services.get(serviceIndex), serviceStatistics.get(serviceIndex));

      const update = statistics.transition({
        slot: currentSlot,
        authorIndex: validatorIndex,
        extrinsic: extrinsic,
        incomingReports: [],
        availableReports: [],
```
