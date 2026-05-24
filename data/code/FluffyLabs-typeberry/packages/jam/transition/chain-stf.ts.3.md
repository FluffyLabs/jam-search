---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/chain-stf.ts#L296-L407
title: packages/jam/transition/chain-stf.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 3
chunk_total: 5
content_sha: 30dfd6e5100cebb63412ce649c6104f9572fa6626637952f3b81a14dfe65fcb0
language: typescript
---
`packages/jam/transition/chain-stf.ts` (lines 296–407)

```typescript
      slot: timeSlot,
      preimages: block.extrinsic.view().preimages.materialize(),
    });
    if (preimagesResult.isError) {
      return stfError(StfErrorKind.Preimages, preimagesResult);
    }
    const { preimages, ...preimagesRest } = preimagesResult.ok;
    assertEmpty(preimagesRest);

    const timerAccumulate = measure(`import:accumulate (${PvmBackend[this.accumulate.options.pvm]})`);
    // accumulate
    const accumulateResult = await this.accumulate.transition({
      slot: timeSlot,
      reports: availableReports,
      entropy: entropy[0],
    });
    logger.log`${timerAccumulate()}`;
    if (accumulateResult.isError) {
      return stfError(StfErrorKind.Accumulate, accumulateResult);
    }
    const {
      stateUpdate: accumulateUpdate,
      accumulationStatistics,
      accumulationOutputLog,
      ...accumulateRest
    } = accumulateResult.ok;
    assertEmpty(accumulateRest);

    const {
      privilegedServices: maybePrivilegedServices,
      authQueues: maybeAuthorizationQueues,
      designatedValidatorData: maybeDesignatedValidatorData,
      preimages: accumulatePreimages,
      accumulationQueue,
      recentlyAccumulated,
      ...servicesUpdateFromAccumulate
    } = accumulateUpdate;

    const servicesUpdate: ServicesUpdate = { ...servicesUpdateFromAccumulate, preimages: accumulatePreimages };

    const accumulateRoot = await this.accumulateOutput.transition({ accumulationOutputLog });
    // recent history
    const recentHistoryUpdate = this.recentHistory.transition({
      partial: recentHistoryPartialUpdate,
      headerHash,
      accumulateRoot,
      workPackages,
    });
    const { recentBlocks, ...recentHistoryRest } = recentHistoryUpdate;
    assertEmpty(recentHistoryRest);

    // authorization
    const authorizationUpdate = this.authorization.transition({
      slot: timeSlot,
      used: this.getUsedAuthorizerHashes(block.extrinsic.view().guarantees.view()),
    });
    const { authPools, ...authorizationRest } = authorizationUpdate;
    assertEmpty(authorizationRest);

    const extrinsic = block.extrinsic.materialize();
    const statisticsUpdate = this.statistics.transition({
      slot: timeSlot,
      authorIndex: header.bandersnatchBlockAuthorIndex,
      extrinsic,
      incomingReports: extrinsic.guarantees.map((g) => g.report),
      availableReports,
      accumulationStatistics,
      reporters: reporters,
      currentValidatorData,
    });
    const { statistics, ...statisticsRest } = statisticsUpdate;
    assertEmpty(statisticsRest);

    // Concat accumulatePreimages updates with preimages
    for (const [serviceId, accPreimageUpdates] of accumulatePreimages.entries()) {
      const preimagesUpdates = preimages.get(serviceId);
      if (preimagesUpdates === undefined) {
        preimages.set(serviceId, accPreimageUpdates);
      } else {
        preimages.set(serviceId, preimagesUpdates.concat(accPreimageUpdates));
      }
    }

    return Result.ok({
      ...(maybeAuthorizationQueues !== undefined ? { authQueues: maybeAuthorizationQueues } : {}),
      ...(maybeDesignatedValidatorData !== undefined ? { designatedValidatorData: maybeDesignatedValidatorData } : {}),
      ...(maybePrivilegedServices !== undefined ? { privilegedServices: maybePrivilegedServices } : {}),
      authPools,
      disputesRecords,
      availabilityAssignment: reportsAvailAssignment,
      recentBlocks,
      statistics,
      timeslot,
      epochRoot,
      entropy,
      currentValidatorData,
      nextValidatorData,
      previousValidatorData,
      sealingKeySeries,
      ticketsAccumulator,
      accumulationQueue,
      recentlyAccumulated,
      accumulationOutputLog,
      ...servicesUpdate,
      preimages,
    });
  }

  private getUsedAuthorizerHashes(guarantees: GuaranteesExtrinsicView) {
    const map = new Map<CoreIndex, HashSet<AuthorizerHash>>();
    for (const guarantee of guarantees) {
      const reportView = guarantee.view().report.view();
```
