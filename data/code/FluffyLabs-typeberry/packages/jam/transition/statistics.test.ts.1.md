---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/statistics.test.ts#L100-L219
title: packages/jam/transition/statistics.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 7
content_sha: 5e061c3f1e8195c9a87451db7bb7208686e41527c9df8566fbcdde491e1c2a77
language: typescript
---
`packages/jam/transition/statistics.test.ts` (lines 100–219)

```typescript
      previous: lastStatistics,
      cores: coreStatistics,
      services: serviceStatistics,
    });
    const state: StatisticsState = {
      statistics: statisticsData,
      timeslot: tryAsTimeSlot(previousSlot),
      currentValidatorData: asOpaqueType([]),
    };
    const statistics = new Statistics(tinyChainSpec, state);

    return {
      statistics,
      currentStatistics,
      lastStatistics,
      coreStatistics,
      serviceStatistics,
      state,
      validatorIndex,
      currentSlot: tryAsTimeSlot(currentSlot),
      currentValidatorData: state.currentValidatorData,
      reporters: asKnownSize([]),
    };
  }

  describe("epoch change", () => {
    it("should keep the same 'current' and 'last' statistics if epoch is not changed", () => {
      const emptyExtrinsic = getExtrinsic();
      const {
        statistics,
        currentSlot,
        validatorIndex,
        currentStatistics,
        lastStatistics,
        currentValidatorData,
        reporters,
      } = prepareData({
        previousSlot: 0,
        currentSlot: 1,
      });

      const update = statistics.transition({
        slot: currentSlot,
        authorIndex: validatorIndex,
        extrinsic: emptyExtrinsic,
        incomingReports: [],
        availableReports: [],
        accumulationStatistics: new Map(),
        currentValidatorData,
        reporters,
      });

      const state = copyAndUpdateState(statistics.state, update);

      assert.deepStrictEqual(state.statistics.current, currentStatistics);
      assert.deepStrictEqual(state.statistics.previous, lastStatistics);
    });

    it("should create a new 'current' statistics and previous current should be 'last' when the epoch is changed", () => {
      const previousSlot = 1;
      const emptyExtrinsic = getExtrinsic();
      const { statistics, currentSlot, validatorIndex, currentStatistics, currentValidatorData, reporters } =
        prepareData({
          previousSlot,
          currentSlot: previousSlot + tinyChainSpec.epochLength,
        });

      assert.deepStrictEqual(statistics.state.statistics.current, currentStatistics);

      const update = statistics.transition({
        slot: currentSlot,
        authorIndex: validatorIndex,
        extrinsic: emptyExtrinsic,
        incomingReports: [],
        availableReports: [],
        accumulationStatistics: new Map(),
        currentValidatorData,
        reporters,
      });
      const state = copyAndUpdateState(statistics.state, update);

      assert.deepStrictEqual(state.statistics.previous, currentStatistics);
    });

    it("should create a new current statistics object that have length equal to number of validators ", () => {
      const previousSlot = 1;
      const emptyExtrinsic = getExtrinsic();
      const { statistics, currentSlot, validatorIndex, currentValidatorData, reporters } = prepareData({
        previousSlot,
        currentSlot: previousSlot + tinyChainSpec.epochLength,
      });

      const update = statistics.transition({
        slot: currentSlot,
        authorIndex: validatorIndex,
        extrinsic: emptyExtrinsic,
        incomingReports: [],
        availableReports: [],
        accumulationStatistics: new Map(),
        currentValidatorData,
        reporters,
      });
      const state = copyAndUpdateState(statistics.state, update);

      assert.deepStrictEqual(state.statistics.current.length, tinyChainSpec.validatorsCount);
    });
  });

  describe("stats update", () => {
    const createPreimage = (blobLength: number) => ({
      requester: 0,
      blob: { length: blobLength },
    });

    const createAssurance = (validatorIndex: number, bitvec?: BitVec) =>
      AvailabilityAssurance.create({
        anchor: Bytes.zero(HASH_SIZE).asOpaque(),
        bitfield: bitvec ?? BitVec.fromBlob(Bytes.zero(HASH_SIZE).raw, tinyChainSpec.coresCount),
        validatorIndex: tryAsValidatorIndex(validatorIndex),
        signature: Bytes.zero(ED25519_SIGNATURE_BYTES).asOpaque(),
```
