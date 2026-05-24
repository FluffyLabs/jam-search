---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/externalities/state-update.ts#L113-L239
title: packages/jam/jam-host-calls/externalities/state-update.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 4
content_sha: cd5a355b2da6990cce432d4c28eeab5eaf0e9ef6eb17a0c6c73a7445fa095765
language: typescript
---
`packages/jam/jam-host-calls/externalities/state-update.ts` (lines 113–239)

```typescript
      update.validatorsData = asKnownSize([...from.validatorsData]);
    }

    if (from.privilegedServices !== null) {
      update.privilegedServices = PrivilegedServices.create({
        ...from.privilegedServices,
        assigners: asKnownSize([...from.privilegedServices.assigners]),
      });
    }
    return update;
  }

  /** Retrieve and clear pending transfers. */
  takeTransfers() {
    const transfers = this.transfers;
    this.transfers = [];
    return transfers;
  }

  /** Retrieve and clear yielded root. */
  takeYieldedRoot() {
    const yieldedRoot = this.yieldedRoot;
    this.yieldedRoot = null;
    return yieldedRoot;
  }
}

type StateSlice = Pick<State, "getService" | "privilegedServices">;

export class PartiallyUpdatedState<T extends StateSlice = StateSlice> {
  /** A collection of state updates. */
  public readonly stateUpdate;

  static new<T extends StateSlice = StateSlice>(state: T, stateUpdate?: AccumulationStateUpdate) {
    return new PartiallyUpdatedState<T>(state, stateUpdate);
  }

  private constructor(
    /** Original (unmodified state). */
    public readonly state: T,
    stateUpdate?: AccumulationStateUpdate,
  ) {
    this.stateUpdate =
      stateUpdate === undefined ? AccumulationStateUpdate.empty() : AccumulationStateUpdate.copyFrom(stateUpdate);
  }

  /**
   * Retrieve info of service with given id.
   *
   * NOTE the info may be updated compared to what is in the state.
   *
   * Takes into account ejected and newly created services as well.
   */
  getServiceInfo(destination: ServiceId | null): ServiceAccountInfo | null {
    if (destination === null) {
      return null;
    }

    const maybeUpdatedServiceInfo = this.stateUpdate.services.updated.get(destination);

    if (maybeUpdatedServiceInfo !== undefined) {
      return maybeUpdatedServiceInfo.action.account;
    }

    const maybeService = this.state.getService(destination);
    if (maybeService === null) {
      return null;
    }

    return maybeService.getInfo();
  }

  getStorage(serviceId: ServiceId, rawKey: StorageKey): BytesBlob | null {
    const storages = this.stateUpdate.services.storage.get(serviceId) ?? [];
    const item = storages.find((x) => x.key.isEqualTo(rawKey));
    if (item !== undefined) {
      return item.value;
    }

    const service = this.state.getService(serviceId);
    return service?.getStorage(rawKey) ?? null;
  }

  /**
   * Returns `true` if the preimage is already provided either in current
   * accumulation scope or earlier.
   *
   * NOTE: Does not check if the preimage is available, we just check
   * the existence in `preimages` map.
   */
  hasPreimage(serviceId: ServiceId, hash: PreimageHash): boolean {
    const preimages = this.stateUpdate.services.preimages.get(serviceId) ?? [];
    const providedPreimage = preimages.find(
      // we ignore the action here, since if there is <any> update on that
      // hash it means it has to exist, right?
      (p) => p.hash.isEqualTo(hash),
    );
    if (providedPreimage !== undefined) {
      return true;
    }

    // fallback to state preimages
    const service = this.state.getService(serviceId);
    if (service === undefined) {
      return false;
    }

    return service?.hasPreimage(hash) ?? false;
  }

  getPreimage(serviceId: ServiceId, hash: PreimageHash): BytesBlob | null {
    // TODO [ToDr] Should we verify availability here?
    const preimages = this.stateUpdate.services.preimages.get(serviceId) ?? [];
    const freshlyProvided = preimages.find((x) => x.hash.isEqualTo(hash));
    if (freshlyProvided !== undefined && freshlyProvided.action.kind === UpdatePreimageKind.Provide) {
      return freshlyProvided.action.preimage.blob;
    }

    const service = this.state.getService(serviceId);
    return service?.getPreimage(hash) ?? null;
  }

  /**
   * Get status of a preimage of current service taking into account any updates.
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/110201110201?v=0.7.2
   */
```
