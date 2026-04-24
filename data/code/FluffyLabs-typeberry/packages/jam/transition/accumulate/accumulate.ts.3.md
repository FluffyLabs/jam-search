---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate.ts#L317-L425
title: packages/jam/transition/accumulate/accumulate.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 3
chunk_total: 7
content_sha: 03bc5b33c82f2b3b9913dcb09116cca59d80667f94413278fee0fc097a48fd83
language: typescript
---
`packages/jam/transition/accumulate/accumulate.ts` (lines 317–425)

```typescript
    const reportsToAccumulateSequentially = reports.subview(i);

    const results = await this.accumulateInParallel(accumulateData, slot, entropy, stateUpdate);

    this.updateStatistics(results, statistics, accumulateData);
    this.updateYieldedRoots(results, yieldedRoots);
    const {
      state: stateAfterParallelAcc,
      totalGasCost,
      transfers: newTransfers,
    } = mergePerallelAccumulationResults(this.chainSpec, this.state, stateUpdate, results);

    /**
     * Gas limit from transfers (from `t`, not `t*`) is added to the next round of accumulation
     *
     * https://graypaper.fluffylabs.dev/#/ab2cdbd/172b02172b02?v=0.7.2
     */
    const transfersGas = transfers.map((t) => t.gas);
    const { value: newGasLimit, overflow } = sumU64(tryAsServiceGas(gasLimit - totalGasCost), ...transfersGas);
    // NOTE [ToDr] recursive invocation
    const {
      accumulatedReports,
      gasCost: seqGasCost,
      state,
      ...seqRest
    } = await this.accumulateSequentially(
      tryAsServiceGas(overflow ? MAX_VALUE_U64 : newGasLimit),
      reportsToAccumulateSequentially,
      newTransfers,
      slot,
      entropy,
      statistics,
      stateAfterParallelAcc,
      new Map(),
      yieldedRoots,
    );
    assertEmpty(seqRest);

    return {
      accumulatedReports: tryAsU32(i + accumulatedReports),
      gasCost: tryAsServiceGas(totalGasCost + seqGasCost),
      state,
    };
  }

  private updateStatistics(
    results: Map<ServiceId, { consumedGas: ServiceGas }>,
    statistics: Map<ServiceId, CountAndGasUsed>,
    accumulateData: AccumulateData,
  ) {
    for (const [serviceId, { consumedGas }] of results.entries()) {
      // https://graypaper.fluffylabs.dev/#/ab2cdbd/193b05193b05?v=0.7.2
      const serviceStatistics = statistics.get(serviceId) ?? { count: tryAsU32(0), gasUsed: tryAsServiceGas(0) };
      const count = accumulateData.getReportsLength(serviceId);

      /**
       * [0.7.1]: We do not update statistics, if the service only had incoming transfers
       *
       * https://graypaper.fluffylabs.dev/#/1c979cb/18ae0318ae03?v=0.7.1
       */
      const shouldUpdateStatisticsPre072 = !Compatibility.isGreaterOrEqual(GpVersion.V0_7_2) && count > 0;
      /**
       * [0.7.2]: We update statistics if anything is changed
       *
       * https://graypaper.fluffylabs.dev/#/ab2cdbd/18d00318dd03?v=0.7.2
       */
      const shouldUpdateStatisticsPost072 =
        Compatibility.isGreaterOrEqual(GpVersion.V0_7_2) && (count > 0 || consumedGas > 0n);
      /**
       * [0.7.1]: Tests are in version 0.7.1 but expect this change from 0.7.2
       *
       * https://github.com/davxy/jam-test-vectors/pull/104
       */
      const shouldUpdateStatistics071DavxyTraces =
        Compatibility.isSuite(TestSuite.W3F_DAVXY, GpVersion.V0_7_1) && (count > 0 || consumedGas > 0n);

      if (shouldUpdateStatisticsPre072 || shouldUpdateStatisticsPost072 || shouldUpdateStatistics071DavxyTraces) {
        serviceStatistics.count = tryAsU32(serviceStatistics.count + count);
        serviceStatistics.gasUsed = tryAsServiceGas(serviceStatistics.gasUsed + consumedGas);
        statistics.set(serviceId, serviceStatistics);
      }
    }
  }

  private updateYieldedRoots(
    results: Map<ServiceId, { stateUpdate: Pick<AccumulationStateUpdate, "yieldedRoot"> }>,
    yieldedRoots: Map<ServiceId, HashSet<OpaqueHash>>,
  ) {
    for (const [
      serviceId,
      {
        stateUpdate: { yieldedRoot },
      },
    ] of results.entries()) {
      if (yieldedRoot !== null) {
        const rootsSet = yieldedRoots.get(serviceId);
        if (rootsSet === undefined) {
          const hashSet = HashSet.from([yieldedRoot]);
          yieldedRoots.set(serviceId, hashSet);
        } else {
          rootsSet.insert(yieldedRoot);
        }
      }
    }
  }

  /**
   * The parallelized accumulation function ∆∗ which,
   * with the help of the single-service accumulation function ∆1,
```
