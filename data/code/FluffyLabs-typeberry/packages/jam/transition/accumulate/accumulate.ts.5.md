---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate.ts#L511-L613
title: packages/jam/transition/accumulate/accumulate.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 5
chunk_total: 7
content_sha: b3dd0520aebc4aadbb23cb157b728eed6c7ebdcee1cda01710d32c4e5b7b86d7
language: typescript
---
`packages/jam/transition/accumulate/accumulate.ts` (lines 511–613)

```typescript
    for (const serviceId of accumulatedServices) {
      // https://graypaper.fluffylabs.dev/#/7e6ff6a/181003185103?v=0.6.7
      const info = partialStateUpdate.getServiceInfo(serviceId);
      if (info === null) {
        // NOTE If there is no service, we dont update it.
        logger.log`Skipping update of ${serviceId}, because we have no service info.`;
        continue;
      }
      // δ‡
      partialStateUpdate.updateServiceInfo(serviceId, ServiceAccountInfo.create({ ...info, lastAccumulation: slot }));
    }

    return {
      recentlyAccumulated,
      timeslot: slot,
      accumulationQueue: tryAsPerEpochBlock(accumulationQueue, this.chainSpec),
      ...partialStateUpdate.stateUpdate.services,
    };
  }

  /**
   * A method that calculates the initial gas limit.
   *
   * Please note it cannot overflow because we use `BigInt`, and the final result is clamped to `maxBlockGas` (W_G).
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/183402184502?v=0.7.2
   */
  private getGasLimit() {
    const calculatedGasLimit =
      GAS_TO_INVOKE_WORK_REPORT * BigInt(this.chainSpec.coresCount) +
      Array.from(this.state.privilegedServices.autoAccumulateServices.values()).reduce(
        (acc, gasLimit) => acc + gasLimit,
        0n,
      );
    const gasLimit = tryAsServiceGas(
      this.chainSpec.maxBlockGas > calculatedGasLimit ? this.chainSpec.maxBlockGas : calculatedGasLimit,
    );

    return tryAsServiceGas(gasLimit);
  }

  /**
   * Detects the very unlikely situation where multiple services are created with the same ID.
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/30f20330f403?v=0.7.2
   *
   * NOTE: This is public only for testing purposes and should not be used outside of accumulation.
   */
  public hasDuplicatedServiceIdCreated(createdIds: ServiceId[]): boolean {
    const uniqueIds = new Set(createdIds);
    return uniqueIds.size !== createdIds.length;
  }

  async transition({ reports, slot, entropy }: AccumulateInput): Promise<Result<AccumulateResult, ACCUMULATION_ERROR>> {
    const statistics: Map<ServiceId, CountAndGasUsed> = new Map();
    const yieldedRoots: Map<ServiceId, HashSet<OpaqueHash>> = new Map();
    const accumulateQueue = new AccumulateQueue(this.chainSpec, this.state);
    const toAccumulateImmediately = accumulateQueue.getWorkReportsToAccumulateImmediately(reports);
    const toAccumulateLater = accumulateQueue.getWorkReportsToAccumulateLater(reports);
    const queueFromState = accumulateQueue.getQueueFromState(slot);
    const toEnqueue = pruneQueue(
      queueFromState.concat(toAccumulateLater),
      getWorkPackageHashes(toAccumulateImmediately),
    );
    const queue = accumulateQueue.enqueueReports(toEnqueue);
    const accumulatableReports = ArrayView.from(toAccumulateImmediately.concat(queue));

    const gasLimit = this.getGasLimit();
    const autoAccumulateServices = this.state.privilegedServices.autoAccumulateServices;

    const { accumulatedReports, gasCost, state, ...rest } = await this.accumulateSequentially(
      gasLimit,
      accumulatableReports,
      [],
      slot,
      entropy,
      statistics,
      AccumulationStateUpdate.empty(),
      autoAccumulateServices,
      yieldedRoots,
    );
    // we can safely ignore top-level gas cost from accSequentially.
    const _gasCost = gasCost;
    assertEmpty(rest);

    const accumulated = accumulatableReports.subview(0, accumulatedReports);
    const {
      yieldedRoot,
      services,
      transfers,
      validatorsData,
      privilegedServices,
      authorizationQueues,
      ...stateUpdateRest
    } = state;
    assertEmpty(stateUpdateRest);

    // transfers and yielded root are retrieved after each pvm invocation so we can ignore it here
    const _transfers = transfers;
    const _yieldedRoot = yieldedRoot;

    if (this.hasDuplicatedServiceIdCreated(services.created)) {
      logger.trace`Duplicated Service creation detected. Block is invalid.`;
```
