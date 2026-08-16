---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/externalities/state-update.ts#L233-L345
title: packages/jam/jam-host-calls/externalities/state-update.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 2
chunk_total: 4
content_sha: 465db964f3c5809c3d38967b298daca3fe1727de96c9a8caa89fbbdaaa18963c
language: typescript
---
`packages/jam/jam-host-calls/externalities/state-update.ts` (lines 233–345)

```typescript
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
  getLookupHistory(
    currentTimeslot: TimeSlot,
    serviceId: ServiceId,
    hash: PreimageHash,
    length: U64,
  ): LookupHistoryItem | null {
    const updatedService = this.stateUpdate.services.updated.get(serviceId);

    /** Return lookup history item for newly created service */
    if (updatedService !== undefined && updatedService.action.kind === UpdateServiceKind.Create) {
      const lookupHistoryItem = updatedService.action.lookupHistory;

      if (
        lookupHistoryItem !== null &&
        hash.isEqualTo(lookupHistoryItem.hash) &&
        length === BigInt(lookupHistoryItem.length)
      ) {
        return lookupHistoryItem;
      }
    }

    const preimages = this.stateUpdate.services.preimages.get(serviceId) ?? [];
    // TODO [ToDr] This is most likely wrong. We may have `provide` and `remove` within
    // the same state update. We should however switch to proper "updated state"
    // representation soon.
    const updatedPreimage = preimages.findLast(
      (update) => update.hash.isEqualTo(hash) && BigInt(update.length) === length,
    );

    const stateFallback = () => {
      // fallback to state lookup
      const service = this.state.getService(serviceId);
      const lenU32 = preimageLenAsU32(length);
      if (lenU32 === null || service === null) {
        return null;
      }

      const slots = service.getLookupHistory(hash, lenU32);
      return slots === null ? null : LookupHistoryItem.new(hash, lenU32, slots);
    };

    if (updatedPreimage === undefined) {
      return stateFallback();
    }

    const { action } = updatedPreimage;
    switch (action.kind) {
      case UpdatePreimageKind.Provide: {
        // casting to U32 is safe, since we compare with object we have in memory.
        return LookupHistoryItem.new(hash, updatedPreimage.length, tryAsLookupHistorySlots([currentTimeslot]));
      }
      case UpdatePreimageKind.Remove: {
        return null;
      }
      case UpdatePreimageKind.UpdateOrAdd: {
        return action.item;
      }
    }

    assertNever(action);
  }

  /* State update functions. */
  updateStorage(serviceId: ServiceId, key: StorageKey, value: BytesBlob | null) {
    const update =
      value === null
        ? UpdateStorage.remove({ key })
        : UpdateStorage.set({
            storage: StorageItem.create({ key, value }),
          });

    const storages = this.stateUpdate.services.storage.get(serviceId) ?? [];
    const index = storages.findIndex((x) => x.key.isEqualTo(key));
    const count = index === -1 ? 0 : 1;
    storages.splice(index, count, update);
    this.stateUpdate.services.storage.set(serviceId, storages);
  }

  /**
   * Update a preimage.
   *
   * Note we store all previous entries as well, since there might be a sequence of:
   * `provide` -> `remove` and both should update the end state somehow.
   */
  updatePreimage(serviceId: ServiceId, newUpdate: UpdatePreimage) {
    const updatePreimages = this.stateUpdate.services.preimages.get(serviceId) ?? [];
    updatePreimages.push(newUpdate);
    this.stateUpdate.services.preimages.set(serviceId, updatePreimages);
  }

  updateServiceStorageUtilisation(
    serviceId: ServiceId,
    items: number,
    bytes: bigint,
    serviceInfo: ServiceAccountInfo,
  ): Result<OK, InsufficientFundsError> {
    check`${items >= 0} storageUtilisationCount has to be a positive number, got: ${items}`;
    check`${bytes >= 0} storageUtilisationBytes has to be a positive number, got: ${bytes}`;

    const overflowItems = !isU32(items);
```
