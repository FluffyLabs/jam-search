---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/chain-stf.ts#L297-L406
title: packages/jam/transition/chain-stf.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 3
chunk_total: 5
content_sha: 9db7d71574c684238b9894bde2d2ca10b829510762b926bccb822067321594ce
language: typescript
---
`packages/jam/transition/chain-stf.ts` (lines 297–406)

```typescript
      return stfError(StfErrorKind.Reports, reportsResult);
    }

    const { reported: workPackages, reporters, stateUpdate: reportsUpdate, ...reportsRest } = reportsResult.ok;
    assertEmpty(reportsRest);
    const { availabilityAssignment: reportsAvailAssignment, ...reportsUpdateRest } = reportsUpdate;
    assertEmpty(reportsUpdateRest);

    // preimages
    const preimagesResult = this.preimages.integrate({
      slot: timeSlot,
      preimages: block.extrinsic.view().preimages.materialize(),
    });
    if (preimagesResult.isError) {
      return stfError(StfErrorKind.Preimages, preimagesResult);
    }
    const { preimages, ...preimagesRest } = preimagesResult.ok;
    assertEmpty(preimagesRest);

    const timerAccumulate = this.measureAccumulate();
    // accumulate
    const accumulateResult = await this.accumulate.transition({
      slot: timeSlot,
      reports: availableReports,
      entropy: entropy[0],
    });
    logger.log`#${timeSlot} ${timerAccumulate}`;
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
```
