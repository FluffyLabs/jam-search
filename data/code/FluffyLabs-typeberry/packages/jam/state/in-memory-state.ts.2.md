---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/in-memory-state.ts#L209-L319
title: packages/jam/state/in-memory-state.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 2
chunk_total: 7
content_sha: 6325f69ae5668769b411472cb17db0cf513789238e752e0adcd86c163f8796bf
language: typescript
---
`packages/jam/state/in-memory-state.ts` (lines 209–319)

```typescript
   * Create a new `InMemoryState` with a partial state override.
   *
   * Note the rest of the state will be set to some empty,
   * not-necessarily coherent values.
   */
  static partial(spec: ChainSpec, partial: Partial<InMemoryStateFields>) {
    const state = InMemoryState.empty(spec);
    Object.assign(state, partial);
    return state;
  }

  /**
   * Create a new `InMemoryState` from some other state object.
   */
  static copyFrom(chainSpec: ChainSpec, other: State, servicesData: Map<ServiceId, ServiceEntries>) {
    const services = new Map<ServiceId, InMemoryService>();
    for (const [id, entries] of servicesData.entries()) {
      const service = other.getService(id);
      if (service === null) {
        throw new Error(`Expected service ${id} to be part of the state!`);
      }
      const inMemService = InMemoryService.copyFrom(service, entries);
      services.set(id, inMemService);
    }

    return InMemoryState.new(chainSpec, {
      availabilityAssignment: other.availabilityAssignment,
      accumulationQueue: other.accumulationQueue,
      designatedValidatorData: other.designatedValidatorData,
      nextValidatorData: other.nextValidatorData,
      currentValidatorData: other.currentValidatorData,
      previousValidatorData: other.previousValidatorData,
      disputesRecords: other.disputesRecords,
      timeslot: other.timeslot,
      entropy: other.entropy,
      authPools: other.authPools,
      authQueues: other.authQueues,
      recentBlocks: other.recentBlocks,
      statistics: other.statistics,
      recentlyAccumulated: other.recentlyAccumulated,
      ticketsAccumulator: other.ticketsAccumulator,
      sealingKeySeries: other.sealingKeySeries,
      epochRoot: other.epochRoot,
      privilegedServices: other.privilegedServices,
      accumulationOutputLog: other.accumulationOutputLog,
      services,
    });
  }

  /**
   * Convert in-memory state into enumerable service information.
   */
  intoServicesData(): Map<ServiceId, ServiceEntries> {
    const servicesData = new Map<ServiceId, ServiceEntries>();
    for (const [serviceId, { data }] of this.services) {
      servicesData.set(serviceId, {
        storageKeys: Array.from(data.storage.values()).map((x) => x.key),
        preimages: Array.from(data.preimages.keys()),
        lookupHistory: Array.from(data.lookupHistory).flatMap(([hash, items]) =>
          items.map((item) => ({ hash, length: item.length })),
        ),
      });
    }
    return servicesData;
  }

  /**
   * Modify the state and apply a single state update.
   */
  applyUpdate(update: Partial<State & ServicesUpdate>): Result<OK, UpdateError> {
    const { removed, created: _, updated, preimages, storage, ...rest } = update;
    // just assign all other variables
    Object.assign(this, rest);

    // and update the services state
    let result: Result<OK, UpdateError>;
    result = this.updateServices(updated);
    if (result.isError) {
      return result;
    }
    result = this.updatePreimages(preimages);
    if (result.isError) {
      return result;
    }
    result = this.updateStorage(storage);
    if (result.isError) {
      return result;
    }
    this.removeServices(removed);

    return Result.ok(OK);
  }

  private removeServices(servicesRemoved: ServiceId[] | undefined) {
    for (const serviceId of servicesRemoved ?? []) {
      check`${this.services.has(serviceId)} Attempting to remove non-existing service: ${serviceId}`;
      this.services.delete(serviceId);
    }
  }

  private updateStorage(storageUpdates: Map<ServiceId, UpdateStorage[]> | undefined): Result<OK, UpdateError> {
    if (storageUpdates === undefined) {
      return Result.ok(OK);
    }
    for (const [serviceId, updates] of storageUpdates.entries()) {
      for (const update of updates) {
        const { kind } = update.action;
        const service = this.services.get(serviceId);
        if (service === undefined) {
          return Result.error(
            UpdateError.NoService,
```
