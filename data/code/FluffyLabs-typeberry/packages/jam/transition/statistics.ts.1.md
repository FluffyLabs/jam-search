---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/statistics.ts#L117-L228
title: packages/jam/transition/statistics.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 4
content_sha: 53dd28522460a62a4251f365cc1c5d6da2817828c64447fc5890015258783cb2
language: typescript
---
`packages/jam/transition/statistics.ts` (lines 117–228)

```typescript
      extrinsicCount: 0,
      extrinsicSize: 0,
      exported: 0,
    };

    /** Maximal number of work results is I=16 */
    for (const workResult of workResults) {
      score.gasUsed += workResult.load.gasUsed;
      score.imported += workResult.load.importedSegments;
      score.extrinsicCount += workResult.load.extrinsicCount;
      score.extrinsicSize += workResult.load.extrinsicSize;
      score.exported += workResult.load.exportedSegments;
    }

    return {
      /** Total gas used will never exceed `2**64` */
      gasUsed: tryAsServiceGas(score.gasUsed),
      /** Each result can import, export up to `W_M, W_X = 3072` segments so we are slightly below `2**16` */
      exported: tryAsU16(score.exported),
      imported: tryAsU16(score.imported),
      /** Each result can have up to `T = 128` extrinsics so we are below `2**16` */
      extrinsicCount: tryAsU16(score.extrinsicCount),
      /** Each result can have up to `W_R = 49152` which cannot be over `2**32` */
      extrinsicSize: tryAsU32(score.extrinsicSize),
    };
  }

  /** https://graypaper.fluffylabs.dev/#/68eaa1f/191602191602?v=0.6.4 */
  private calculateProvidedScoreService(preimages: Preimage[]) {
    const score = {
      count: 0,
      size: 0,
    };

    for (const preimage of preimages) {
      score.count += 1;
      score.size += preimage.blob.length;
    }

    return {
      /** Number of preimages can never exceed 2**16 */
      count: tryAsU16(score.count),
      /** Each preimage.blob.length can be up to `W_C = 4_000_000`
       * with maximal size of EACH preimage, number of preimages in block for one service must be `<= 1073` */
      size: tryAsU32(score.size),
    };
  }

  /**
   * Collects all service ids from the following sources:
   * - preimages
   * - work results
   * - accumulation keys
   * - transfer keys
   *
   * https://graypaper.fluffylabs.dev/#/cc517d7/195f04195f04?v=0.6.5
   */
  private collectServiceIds(
    preimages: PreimagesExtrinsic,
    workResults: WorkResult[],
    accumulationKeys: MapIterator<ServiceId>,
  ) {
    const serviceIds = new Set<ServiceId>();

    for (const preimage of preimages) {
      serviceIds.add(preimage.requester);
    }
    for (const workResult of workResults) {
      serviceIds.add(workResult.serviceId);
    }
    for (const serviceId of accumulationKeys) {
      serviceIds.add(serviceId);
    }

    return serviceIds;
  }

  /**
   * https://graypaper.fluffylabs.dev/#/68eaa1f/188903188903?v=0.6.4
   * https://graypaper.fluffylabs.dev/#/68eaa1f/19fc0019fc00?v=0.6.4
   * https://graypaper.fluffylabs.dev/#/68eaa1f/199002199002?v=0.6.4
   */
  transition(input: Input): StatisticsStateUpdate {
    const { slot, authorIndex, extrinsic, incomingReports, availableReports } = input;

    /** get statistics for the current epoch */
    const statistics = this.getStatistics(slot);
    const { current, cores, services } = statistics;
    check`${current[authorIndex] !== undefined} authorIndex is out of bounds`;

    /** One validator can produce maximal one block per timeslot */
    const newBlocksCount = current[authorIndex].blocks + 1;
    current[authorIndex].blocks = tryAsU32(newBlocksCount);

    const newTicketsCount = current[authorIndex].tickets + extrinsic.tickets.length;
    current[authorIndex].tickets = tryAsU32(newTicketsCount);

    const newPreimagesCount = current[authorIndex].preImages + extrinsic.preimages.length;
    current[authorIndex].preImages = tryAsU32(newPreimagesCount);

    /**
     * This value is well bounded by number of blocks in the epoch
     * and maximal amount of preimage data in the extrinsics per one validator.
     * So it can't reach 2GB.
     */
    const preImagesSize = extrinsic.preimages.reduce((sum, preimage) => sum + preimage.blob.length, 0);
    const newPreImagesSize = current[authorIndex].preImagesSize + preImagesSize;
    current[authorIndex].preImagesSize = tryAsU32(newPreImagesSize);

    /**
     * Update guarantees
     *
```
