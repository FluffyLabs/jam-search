---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.ts#L111-L217
title: packages/jam/transition/externalities/accumulate-externalities.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 9
content_sha: ee7908a1836bdc83148adb4c571fb29771aa31f9ebdd6b180906dc2c2f36d3d3
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.ts` (lines 111–217)

```typescript
    this.nextNewServiceId = this.getNextAvailableServiceId(args.nextNewServiceIdCandidate);
  }

  private readonly chainSpec: ChainSpec;
  private readonly blake2b: Blake2b;
  private readonly updatedState: PartiallyUpdatedState;
  /** `x_s` */
  private readonly currentServiceId: ServiceId;
  private readonly currentTimeslot: TimeSlot;

  /** Return the underlying state update and checkpointed state. */
  getStateUpdates(): [AccumulationStateUpdate, AccumulationStateUpdate] {
    return [this.updatedState.stateUpdate, this.checkpointedState];
  }

  /** Return current `x_i` value of next new service id. */
  getNextNewServiceId() {
    return this.nextNewServiceId;
  }

  /**
   * Retrieve service info of currently accumulating service.
   *
   * Takes into account updates over the state.
   */
  private getCurrentServiceInfo(): ServiceAccountInfo {
    const serviceInfo = this.updatedState.getServiceInfo(this.currentServiceId);
    if (serviceInfo === null) {
      throw new Error(`Missing service info for current service! ${this.currentServiceId}`);
    }
    return serviceInfo;
  }

  /**
   * Retrieve info of service with given id.
   *
   * NOTE the info may be updated compared to what is in the state.
   *
   * Takes into account newly created services as well.
   */
  getServiceInfo(destination: ServiceId | null): ServiceAccountInfo | null {
    return this.updatedState.getServiceInfo(destination);
  }

  /**
   * Returns `true` if given service has a particular preimage unavailable
   * and expired.
   *
   * Note that we only check the state here, since the function is used
   * in the context of `eject` function.
   *
   * There is one way that previousCode is in the recently updated state
   * - cannot be part of the newly created service, because
   *   the preimage would not be available yet.
   * - cannot be "freshly provided", since we defer updating the
   *   lookup status.
   */
  private isPreviousCodeExpired(destination: ServiceId, previousCodeHash: PreimageHash, len: U64): [boolean, string] {
    const slots = this.updatedState.getLookupHistory(this.currentTimeslot, destination, previousCodeHash, len);
    const status = slots === null ? null : slotsToPreimageStatus(slots.slots);
    // The previous code needs to be forgotten and expired.
    if (status?.status !== PreimageStatusKind.Unavailable) {
      return [false, `wrong status: ${status !== null ? PreimageStatusKind[status.status] : null}`];
    }
    const t = this.currentTimeslot;
    const isExpired = status.data[1] < t - this.chainSpec.preimageExpungePeriod;
    return [isExpired, isExpired ? "" : "not expired"];
  }

  /** `check`: https://graypaper.fluffylabs.dev/#/ab2cdbd/30c60330c603?v=0.7.2 */
  private getNextAvailableServiceId(serviceId: ServiceId): ServiceId {
    let currentServiceId = serviceId;
    const mod = 2 ** 32 - MIN_PUBLIC_SERVICE_INDEX - 2 ** 8;

    for (;;) {
      const service = this.getServiceInfo(currentServiceId);
      // we found an empty id
      if (service === null) {
        return currentServiceId;
      }
      // keep trying
      currentServiceId = tryAsServiceId(
        ((currentServiceId - MIN_PUBLIC_SERVICE_INDEX + 1 + mod) % mod) + MIN_PUBLIC_SERVICE_INDEX,
      );
    }
  }

  checkPreimageStatus(hash: PreimageHash, length: U64): PreimageStatus | null {
    // https://graypaper.fluffylabs.dev/#/9a08063/378102378102?v=0.6.6
    const status = this.updatedState.getLookupHistory(this.currentTimeslot, this.currentServiceId, hash, length);
    if (status === null) {
      return null;
    }

    return slotsToPreimageStatus(status.slots);
  }

  requestPreimage(hash: PreimageHash, length: U64): Result<OK, RequestPreimageError> {
    const existingPreimage = this.updatedState.getLookupHistory(
      this.currentTimeslot,
      this.currentServiceId,
      hash,
      length,
    );

    if (existingPreimage !== null) {
      const len = existingPreimage.slots.length;
```
