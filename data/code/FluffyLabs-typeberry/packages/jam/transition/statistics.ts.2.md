---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/statistics.ts#L222-L310
title: packages/jam/transition/statistics.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 2
chunk_total: 4
content_sha: 5528f995f32a3c05a2505435a299840db70e93582d178852ae8b77595b073406
language: typescript
---
`packages/jam/transition/statistics.ts` (lines 222–310)

```typescript
    const preImagesSize = extrinsic.preimages.reduce((sum, preimage) => sum + preimage.blob.length, 0);
    const newPreImagesSize = current[authorIndex].preImagesSize + preImagesSize;
    current[authorIndex].preImagesSize = tryAsU32(newPreImagesSize);

    /**
     * Update guarantees
     *
     * https://graypaper.fluffylabs.dev/#/ab2cdbd/19ea0119f201?v=0.7.2
     */
    const validatorKeys = input.currentValidatorData.map((v) => v.ed25519);

    for (const reporter of input.reporters) {
      const index = validatorKeys.findIndex((x) => x.isEqualTo(reporter));
      if (index === -1) {
        /**
         * it should never happen because:
         * 1. the extrinsic is verified in reports transition
         * 2. we use current validators set from safrole
         */
        continue;
      }
      const newGuaranteesCount = current[index].guarantees + 1;
      current[index].guarantees = tryAsU32(newGuaranteesCount);
    }

    for (const { validatorIndex } of extrinsic.assurances) {
      const newAssurancesCount = current[validatorIndex].assurances + 1;
      current[validatorIndex].assurances = tryAsU32(newAssurancesCount);
    }

    /** Update core statistics */
    for (let coreId = 0; coreId < this.chainSpec.coresCount; coreId++) {
      const coreIndex = tryAsCoreIndex(coreId);

      // NOTE [MaSo] At most one work report per core in the block.
      // https://graypaper.fluffylabs.dev/#/cc517d7/156700156700?v=0.6.5
      const workReport = incomingReports.find((wr) => wr.coreIndex === coreIndex);
      const { imported, extrinsicCount, extrinsicSize, exported, gasUsed } =
        workReport !== undefined
          ? this.calculateRefineScore(workReport.results.map((r) => r))
          : {
              imported: tryAsU16(0),
              extrinsicCount: tryAsU16(0),
              extrinsicSize: tryAsU32(0),
              exported: tryAsU16(0),
              gasUsed: tryAsServiceGas(0n),
            };

      // NOTE [MaSo] At most one work report per core in the block.
      // https://graypaper.fluffylabs.dev/#/cc517d7/145d01145d01?v=0.6.5
      const availableWorkReport = availableReports.find((wr) => wr.coreIndex === coreIndex);
      const popularity = extrinsic.assurances.reduce((sum, { bitfield }) => sum + (bitfield.isSet(coreId) ? 1 : 0), 0);

      /**
       * Core statistics are tracked only per-block basis, so we override previous values.
       * https://graypaper.fluffylabs.dev/#/cc517d7/190201190501?v=0.6.5
       */
      cores[coreIndex].imports = imported;
      cores[coreIndex].extrinsicCount = extrinsicCount;
      cores[coreIndex].extrinsicSize = extrinsicSize;
      cores[coreIndex].exports = exported;
      cores[coreIndex].gasUsed = gasUsed;
      cores[coreIndex].bundleSize = tryAsU32(workReport?.workPackageSpec.length ?? 0);
      cores[coreIndex].dataAvailabilityLoad = this.calculateDAScoreCore(availableWorkReport);
      cores[coreIndex].popularity = tryAsU16(popularity);
    }

    /** Update services statistics */
    services.clear();
    const serviceIds = this.collectServiceIds(
      extrinsic.preimages,
      incomingReports.flatMap((wr) => wr.results),
      input.accumulationStatistics.keys(),
    );

    for (const serviceId of serviceIds) {
      const workResults = incomingReports.flatMap((wr) => wr.results.filter((r) => r.serviceId === serviceId));
      const { gasUsed, imported, extrinsicCount, extrinsicSize, exported } = this.calculateRefineScore(workResults);

      const preimages = extrinsic.preimages.filter((preimage) => preimage.requester === serviceId);
      const { count: providedCount, size: providedSize } = this.calculateProvidedScoreService(preimages);

      const { count: accumulatedCount, gasUsed: accumulatedGasUsed } = input.accumulationStatistics.get(serviceId) ?? {
        count: tryAsU32(0),
        gasUsed: tryAsServiceGas(0n),
      };

      /**
       * Service statistics are tracked only per-block basis, so we override previous values.
```
