---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.ts#L590-L700
title: packages/jam/transition/externalities/accumulate-externalities.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 6
chunk_total: 9
content_sha: adb9fddc1211e30f793ee7fddd7870ff112f0bb9cd9716cd57c32a5490bd0633
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.ts` (lines 590–700)

```typescript
    // update the authorization queue
    this.updatedState.stateUpdate.authorizationQueues.set(coreIndex, authQueue);
    // move permissions to the new assigner
    const assigners = currentAssigners.slice();
    assigners[coreIndex] = newAssigner;
    this.updatedState.stateUpdate.privilegedServices = PrivilegedServices.create({
      ...privilegedServices,
      // since coreindex is validated, we do not alter the size,
      // hence it's safe to convert back
      assigners: asKnownSize(assigners),
    });
    return Result.ok(OK);
  }

  updatePrivilegedServices(
    manager: ServiceId | null,
    assigners: PerCore<ServiceId>,
    delegator: ServiceId | null,
    registrar: ServiceId | null,
    autoAccumulateServices: Map<ServiceId, ServiceGas>,
  ): Result<OK, UpdatePrivilegesError> {
    if (manager === null || delegator === null || registrar === null) {
      return Result.error(
        UpdatePrivilegesError.InvalidServiceId,
        () => "Either manager or delegator or registrar is not a valid service id.",
      );
    }

    // finally update the privileges
    this.updatedState.stateUpdate.privilegedServices = PrivilegedServices.create({
      manager,
      assigners,
      delegator,
      registrar: registrar ?? tryAsServiceId(0),
      autoAccumulateServices,
    });

    return Result.ok(OK);
  }

  yield(hash: OpaqueHash): void {
    /** https://graypaper.fluffylabs.dev/#/ab2cdbd/380f03381503?v=0.7.2 */
    this.updatedState.stateUpdate.yieldedRoot = hash;
  }

  providePreimage(serviceId: ServiceId | null, preimage: BytesBlob): Result<OK, ProvidePreimageError> {
    // we need to explicitly check if service exists, since it's a different error.
    // we also check if it's in newly created
    // https://graypaper.fluffylabs.dev/#/ab2cdbd/384e03384e03?v=0.7.2
    const service = serviceId === null ? null : this.updatedState.getServiceInfo(serviceId);
    if (service === null || serviceId === null) {
      return Result.error(ProvidePreimageError.ServiceNotFound, () => `Service not found: ${serviceId}`);
    }

    // calculating the hash
    const preimageHash = this.blake2b.hashBytes(preimage).asOpaque<PreimageHash>();

    // checking service internal lookup
    const stateLookup = this.updatedState.getLookupHistory(
      this.currentTimeslot,
      serviceId,
      preimageHash,
      tryAsU64(preimage.length),
    );
    if (stateLookup === null || !LookupHistoryItem.isRequested(stateLookup)) {
      return Result.error(
        ProvidePreimageError.WasNotRequested,
        () => `Preimage was not requested: hash=${preimageHash}, service=${serviceId}`,
      );
    }

    // checking already provided preimages
    const hasPreimage = this.updatedState.hasPreimage(serviceId, preimageHash);
    if (hasPreimage) {
      return Result.error(
        ProvidePreimageError.AlreadyProvided,
        () => `Preimage already provided: hash=${preimageHash}, service=${serviceId}`,
      );
    }

    // setting up the new preimage
    const providedFor = serviceId;
    const update = UpdatePreimage.provide({
      preimage: PreimageItem.create({
        hash: preimageHash,
        blob: preimage,
      }),
      slot: this.currentTimeslot,
      providedFor,
    });

    this.updatedState.updatePreimage(serviceId, update);

    if (this.currentServiceId !== providedFor) {
      this.updatedState.updatePreimage(this.currentServiceId, update);
    }

    return Result.ok(OK);
  }

  eject(destination: ServiceId | null, previousCodeHash: PreimageHash): Result<OK, EjectError> {
    const service = this.getServiceInfo(destination);
    const isRemoved =
      this.updatedState.stateUpdate.services.removed.find((serviceId) => serviceId === destination) !== undefined;

    if (service === null || destination === null || isRemoved) {
      return Result.error(EjectError.InvalidService, () => "Service missing");
    }

    const currentService = this.getCurrentServiceInfo();

```
