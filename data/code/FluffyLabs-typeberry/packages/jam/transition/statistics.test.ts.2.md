---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/statistics.test.ts#L217-L325
title: packages/jam/transition/statistics.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 2
chunk_total: 7
content_sha: 4daeed5683b77b60ff1aed644c258c5bd51d18f812100d0b49ad9d27d94c401b
language: typescript
---
`packages/jam/transition/statistics.test.ts` (lines 217–325)

```typescript
        bitfield: bitvec ?? BitVec.fromBlob(Bytes.zero(HASH_SIZE).raw, tinyChainSpec.coresCount),
        validatorIndex: tryAsValidatorIndex(validatorIndex),
        signature: Bytes.zero(ED25519_SIGNATURE_BYTES).asOpaque(),
      });

    const countGasUsed = (count: number, gasUsed: bigint) => ({
      count: tryAsU32(count),
      gasUsed: tryAsServiceGas(gasUsed),
    });

    function createWorkReport(coreIndex: CoreIndex): WorkReport {
      const source = BytesBlob.parseBlob(testWorkReportHex());
      const report = Decoder.decodeObject(WorkReport.Codec, source, tinyChainSpec);
      return WorkReport.create({
        ...report,
        coreIndex: coreIndex,
      });
    }

    function prepareData({
      previousSlot,
      currentSlot,
      reporters,
      currentValidatorData: validatorDataToOverride,
    }: {
      previousSlot: number;
      currentSlot: number;
      reporters?: readonly Ed25519Key[];
      currentValidatorData?: State["currentValidatorData"];
    }) {
      const validatorIndex = tryAsValidatorIndex(0);
      const serviceIndex = tryAsServiceId(0);
      const currentStatistics = emptyValidatorStatistics();
      const lastStatistics = emptyValidatorStatistics();
      const coreStatistics = tryAsPerCore(
        FixedSizeArray.fill(() => CoreStatistics.empty(), tinyChainSpec.coresCount),
        tinyChainSpec,
      );
      const serviceStatistics = new Map([[serviceIndex, ServiceStatistics.empty()]]);
      const statisticsData = StatisticsData.create({
        current: currentStatistics,
        previous: lastStatistics,
        cores: coreStatistics,
        services: serviceStatistics,
      });

      const defaultReporters: readonly Ed25519Key[] = [];
      const state: StatisticsState = {
        statistics: statisticsData,
        timeslot: tryAsTimeSlot(previousSlot),
        currentValidatorData: validatorDataToOverride ?? currentValidatorData,
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
        serviceIndex,
        currentSlot: tryAsTimeSlot(currentSlot),
        reporters: reporters ?? defaultReporters,
        currentValidatorData: state.currentValidatorData,
      };
    }

    it("should increase number of blocks created by validator", () => {
      const emptyExtrinsic = getExtrinsic();
      const { statistics, currentSlot, validatorIndex, currentStatistics, currentValidatorData, reporters } =
        prepareData({
          previousSlot: 0,
          currentSlot: 1,
        });
      const expectedStatistics = { ...currentStatistics[validatorIndex], blocks: 1 };

      assert.strictEqual(statistics.state.statistics.current[validatorIndex].blocks, 0);

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

      assert.deepEqual(state.statistics.current[validatorIndex], expectedStatistics);
    });

    it("should add tickets length from extrinstic to tickets in statistics", () => {
      const tickets = [1, 2, 3] as unknown as TicketsExtrinsic;
      const extrinsic = getExtrinsic({ tickets });
      const { statistics, currentSlot, validatorIndex, currentStatistics, currentValidatorData, reporters } =
        prepareData({
          previousSlot: 0,
          currentSlot: 1,
        });
      const expectedStatistics = { ...currentStatistics[validatorIndex], blocks: 1, tickets: tickets.length };

      assert.strictEqual(statistics.state.statistics.current[validatorIndex].tickets, 0);

      const update = statistics.transition({
        slot: currentSlot,
```
