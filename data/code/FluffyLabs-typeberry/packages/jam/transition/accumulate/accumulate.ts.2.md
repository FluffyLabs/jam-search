---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate.ts#L215-L321
title: packages/jam/transition/accumulate/accumulate.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 2
chunk_total: 7
content_sha: 6d18e577fffdc0989a0fbffd84d9aeff245859fb219c7a109102d76037af4e9f
language: typescript
---
`packages/jam/transition/accumulate/accumulate.ts` (lines 215–321)

```typescript
     */
    if (result.memorySlice.length === HASH_SIZE) {
      const memorySlice = Bytes.fromBlob(result.memorySlice, HASH_SIZE);
      newState.yieldedRoot = memorySlice.asOpaque();
    }

    /**
     * Everything was okay so we can return a new state
     *
     * https://graypaper.fluffylabs.dev/#/7e6ff6a/302302302302?v=0.6.7
     */
    return Result.ok({ stateUpdate: newState, consumedGas: tryAsServiceGas(result.consumedGas) });
  }

  /**
   * A method that accumulate reports connected with a single service
   *
   * https://graypaper.fluffylabs.dev/#/7e6ff6a/18d70118d701?v=0.6.7
   */
  private async accumulateSingleService(
    serviceId: ServiceId,
    transfers: PendingTransfer[],
    operands: Operand[],
    gasCost: ServiceGas,
    slot: TimeSlot,
    entropy: EntropyHash,
    inputStateUpdate: AccumulationStateUpdate,
  ) {
    logger.log`Accumulating service ${serviceId}, transfers: ${transfers.length} operands: ${operands.length} at slot: ${slot}`;

    const updatedState = PartiallyUpdatedState.new(this.state, inputStateUpdate);

    const serviceInfo = updatedState.getServiceInfo(serviceId);
    if (serviceInfo !== null) {
      // update the balance from incoming transfers
      const newBalance = sumU64(serviceInfo.balance, ...transfers.map((item) => item.amount));

      if (newBalance.overflow) {
        logger.log`Accumulation failed because of overflowing balance ${serviceId}.`;
        return { stateUpdate: null, consumedGas: tryAsServiceGas(0n) };
      }

      const newInfo = ServiceAccountInfo.create({ ...serviceInfo, balance: newBalance.value });
      updatedState.updateServiceInfo(serviceId, newInfo);
    }

    const result = await this.pvmAccumulateInvocation(
      slot,
      serviceId,
      transfers,
      operands,
      gasCost,
      entropy,
      updatedState,
    );

    if (result.isError) {
      // https://graypaper.fluffylabs.dev/#/ab2cdbd/2fc9032fc903?v=0.7.2
      logger.log`Accumulation failed for ${serviceId}.`;
      // even though accumulation failed, we still need to make sure that
      // incoming transfers updated the balance, hence we pass state update here
      return { stateUpdate: updatedState.stateUpdate, consumedGas: tryAsServiceGas(0n) };
    }

    logger.log`Accumulation successful for ${serviceId}. Consumed: ${result.ok.consumedGas}`;
    return result.ok;
  }

  /**
   * The outer accumulation function ∆+ which transforms a gas-limit, a sequence of work-reports,
   * an initial partial-state and a dictionary of services enjoying free accumulation,
   * into a tuple of the number of work-results accumulated, a posterior state-context,
   * the resultant deferred-transfers and accumulation-output pairing.
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/172901172901?v=0.7.2
   */
  private async accumulateSequentially(
    gasLimit: ServiceGas,
    reports: ArrayView<WorkReport>,
    transfers: PendingTransfer[],
    slot: TimeSlot,
    entropy: EntropyHash,
    statistics: Map<ServiceId, CountAndGasUsed>,
    stateUpdate: AccumulationStateUpdate,
    autoAccumulateServices: Map<ServiceId, ServiceGas>,
    yieldedRoots: Map<ServiceId, HashSet<OpaqueHash>>,
  ): Promise<SequentialAccumulationResult> {
    const i = this.findReportCutoffIndex(gasLimit, reports);

    /** https://graypaper.fluffylabs.dev/#/ab2cdbd/17e50117e501?v=0.7.2 */
    const n = transfers.length + i + autoAccumulateServices.size;

    if (n === 0) {
      return {
        accumulatedReports: tryAsU32(0),
        gasCost: tryAsServiceGas(0),
        state: stateUpdate,
      };
    }

    const reportsToAccumulateInParallel = reports.subview(0, i);
    const accumulateData = new AccumulateData(reportsToAccumulateInParallel, transfers, autoAccumulateServices);
    const reportsToAccumulateSequentially = reports.subview(i);

    const results = await this.accumulateInParallel(accumulateData, slot, entropy, stateUpdate);

    this.updateStatistics(results, statistics, accumulateData);
```
