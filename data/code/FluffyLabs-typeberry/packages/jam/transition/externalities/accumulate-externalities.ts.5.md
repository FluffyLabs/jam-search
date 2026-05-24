---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.ts#L502-L593
title: packages/jam/transition/externalities/accumulate-externalities.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 5
chunk_total: 9
content_sha: a8041fa33390ff20f3db1d31066a367e5b3e648278988f30eb4850d1d84ff392
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.ts` (lines 502–593)

```typescript
      // update the balance of current service
      // https://graypaper.fluffylabs.dev/#/ab2cdbd/36c20336c403?v=0.7.2
      this.updatedState.updateServiceInfo(this.currentServiceId, updatedCurrentAccount);
      return Result.ok(newServiceId);
    }

    // NOTE: in case the service is not a registrar or the requested serviceId is out of range,
    // we completely ignore the `wantedServiceId` and assign a random one
    const newServiceId = this.nextNewServiceId;

    // add the new service
    // https://graypaper.fluffylabs.dev/#/7e6ff6a/36cb0236cb02?v=0.6.7
    this.updatedState.createService(newServiceId, newAccount, newLookupItem);

    // update the balance of current service
    // https://graypaper.fluffylabs.dev/#/ab2cdbd/36ec0336ee03?v=0.7.2
    this.updatedState.updateServiceInfo(this.currentServiceId, updatedCurrentAccount);

    // update the next service id we are going to create next
    // https://graypaper.fluffylabs.dev/#/7e6ff6a/36a70336a703?v=0.6.7
    this.nextNewServiceId = this.getNextAvailableServiceId(bumpServiceId(newServiceId));

    return Result.ok(newServiceId);
  }

  upgradeService(codeHash: CodeHash, gas: U64, allowance: U64): void {
    /** https://graypaper.fluffylabs.dev/#/9a08063/36c80336c803?v=0.6.6 */
    const serviceInfo = this.getCurrentServiceInfo();
    this.updatedState.updateServiceInfo(
      this.currentServiceId,
      ServiceAccountInfo.create({
        ...serviceInfo,
        codeHash,
        accumulateMinGas: tryAsServiceGas(gas),
        onTransferMinGas: tryAsServiceGas(allowance),
      }),
    );
  }

  updateValidatorsData(validatorsData: PerValidator<ValidatorData>): Result<OK, UnprivilegedError> {
    /** https://graypaper.fluffylabs.dev/#/7e6ff6a/362802362d02?v=0.6.7 */
    const currentDelegator = this.updatedState.getPrivilegedServices().delegator;

    if (currentDelegator !== this.currentServiceId) {
      logger.trace`Current service id (${this.currentServiceId}) is not a validators manager. (expected: ${currentDelegator}) and cannot update validators data. Ignoring`;
      return Result.error(
        UnprivilegedError,
        () => `Service ${this.currentServiceId} is not delegator (expected: ${currentDelegator})`,
      );
    }

    this.updatedState.stateUpdate.validatorsData = validatorsData;
    return Result.ok(OK);
  }

  checkpoint(): void {
    /** https://graypaper.fluffylabs.dev/#/9a08063/362202362202?v=0.6.6 */
    this.checkpointedState = AccumulationStateUpdate.copyFrom(this.updatedState.stateUpdate);
  }

  updateAuthorizationQueue(
    coreIndex: CoreIndex,
    authQueue: FixedSizeArray<AuthorizerHash, AUTHORIZATION_QUEUE_SIZE>,
    newAssigner: ServiceId | null,
  ): Result<OK, UpdatePrivilegesError> {
    /** https://graypaper.fluffylabs.dev/#/7e6ff6a/36a40136a401?v=0.6.7 */

    // NOTE `coreIndex` is already verified in the HC, so this is infallible.
    const privilegedServices = this.updatedState.getPrivilegedServices();
    const currentAssigners = privilegedServices.assigners;
    const assigner = currentAssigners[coreIndex];

    if (assigner !== this.currentServiceId) {
      logger.trace`Current service id (${this.currentServiceId}) is not an auth manager of core ${coreIndex} (expected: ${assigner}) and cannot update authorization queue.`;
      return Result.error(
        UpdatePrivilegesError.UnprivilegedService,
        () => `Service ${this.currentServiceId} not assigner for core ${coreIndex} (expected: ${assigner})`,
      );
    }

    if (newAssigner === null) {
      logger.trace`The new auth manager is not a valid service id.`;
      return Result.error(
        UpdatePrivilegesError.InvalidServiceId,
        () => `New auth manager is null for core ${coreIndex}`,
      );
    }

    // update the authorization queue
    this.updatedState.stateUpdate.authorizationQueues.set(coreIndex, authQueue);
    // move permissions to the new assigner
    const assigners = currentAssigners.slice();
```
