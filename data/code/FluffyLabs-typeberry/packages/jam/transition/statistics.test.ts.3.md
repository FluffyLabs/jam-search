---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/statistics.test.ts#L320-L414
title: packages/jam/transition/statistics.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 3
chunk_total: 7
content_sha: bd26586fdfaee05055c7239684d30fd5f13ada8688cda99f375d189a74b42c01
language: typescript
---
`packages/jam/transition/statistics.test.ts` (lines 320–414)

```typescript
      const expectedStatistics = { ...currentStatistics[validatorIndex], blocks: 1, tickets: tickets.length };

      assert.strictEqual(statistics.state.statistics.current[validatorIndex].tickets, 0);

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

    it("should add preimages length from extrinstic to preImages in statistics", () => {
      const { statistics, currentSlot, validatorIndex, currentStatistics, currentValidatorData, reporters } =
        prepareData({
          previousSlot: 0,
          currentSlot: 1,
        });
      const preimages: PreimagesExtrinsic = asKnownSize([createPreimage(0), createPreimage(0), createPreimage(0)]);
      const assurances = asKnownSize([createAssurance(validatorIndex + 1)]) as unknown as AssurancesExtrinsic;
      const extrinsic = getExtrinsic({ preimages, assurances });
      const expectedStatistics = { ...currentStatistics[validatorIndex], blocks: 1, preImages: preimages.length };

      assert.strictEqual(statistics.state.statistics.current[validatorIndex].preImages, 0);

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

    it("should add preimages size length from extrinstic to preImagesSize in statistics", () => {
      const preimages: PreimagesExtrinsic = asKnownSize([createPreimage(1), createPreimage(2), createPreimage(3)]);
      const extrinsic = getExtrinsic({ preimages });
      const { statistics, currentSlot, validatorIndex, currentStatistics, currentValidatorData, reporters } =
        prepareData({
          previousSlot: 0,
          currentSlot: 1,
        });
      const expectedStatistics = {
        ...currentStatistics[validatorIndex],
        blocks: 1,
        preImages: preimages.length,
        preImagesSize: 6,
      };

      assert.strictEqual(statistics.state.statistics.current[validatorIndex].preImagesSize, 0);

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

    it("should update guarantees for each validator based on reporters set from input, a maximum of once per validator", () => {
      const createValidatorData = (seed: number) =>
        ValidatorData.create({
          ed25519: Bytes.fill(ED25519_KEY_BYTES, seed).asOpaque(),
          bandersnatch: Bytes.zero(BANDERSNATCH_KEY_BYTES).asOpaque(),
          bls: Bytes.zero(BLS_KEY_BYTES).asOpaque(),
          metadata: Bytes.zero(1).asOpaque(),
        });
      const validatorsData = Array.from({ length: tinyChainSpec.validatorsCount }).map((_, index) =>
        createValidatorData(index),
      );
      const { statistics, currentSlot, validatorIndex, currentStatistics, currentValidatorData, reporters } =
        prepareData({
          previousSlot: 0,
          currentSlot: 1,
          reporters: asKnownSize(validatorsData.map((v) => v.ed25519)),
```
