---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.ts#L695-L783
title: packages/jam/transition/externalities/accumulate-externalities.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 7
chunk_total: 9
content_sha: 081fa4c41459d096cec6fce14bd6d032f935a44a7a8776d383b71b167ebcc0b4
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.ts` (lines 695–783)

```typescript
    if (service === null || destination === null || isRemoved) {
      return Result.error(EjectError.InvalidService, () => "Service missing");
    }

    const currentService = this.getCurrentServiceInfo();

    // check if the service expects to be ejected by us:
    const expectedCodeHash = Bytes.zero(HASH_SIZE).asOpaque<CodeHash>();
    writeServiceIdAsLeBytes(this.currentServiceId, expectedCodeHash.raw);
    if (!service.codeHash.isEqualTo(expectedCodeHash)) {
      return Result.error(EjectError.InvalidService, () => "Invalid code hash");
    }

    // make sure the service only has required number of storage items?
    if (service.storageUtilisationCount !== REQUIRED_NUMBER_OF_STORAGE_ITEMS_FOR_EJECT) {
      return Result.error(EjectError.InvalidPreimage, () => "Too many storage items");
    }

    // storage items length
    const l = tryAsU64(
      maxU64(service.storageUtilisationBytes, LOOKUP_HISTORY_ENTRY_BYTES) - LOOKUP_HISTORY_ENTRY_BYTES,
    );

    // check if we have a preimage with the entire storage.
    const [isPreviousCodeExpired, errorReason] = this.isPreviousCodeExpired(destination, previousCodeHash, l);
    if (!isPreviousCodeExpired) {
      return Result.error(EjectError.InvalidPreimage, () => `Previous code available: ${errorReason}`);
    }

    // compute new balance of the service.
    const newBalance = sumU64(currentService.balance, service.balance);
    // TODO [ToDr] what to do in case of overflow?
    if (newBalance.overflow) {
      return Result.error(EjectError.InvalidService, () => "Balance overflow");
    }

    // update current service.
    this.updatedState.updateServiceInfo(
      this.currentServiceId,
      ServiceAccountInfo.create({
        ...currentService,
        balance: newBalance.value,
      }),
    );
    // and finally add an ejected service.
    this.updatedState.stateUpdate.services.removed.push(destination);

    // take care of the code preimage and its lookup history
    // Safe, because we know the preimage is valid, and it's the code of the service, which is bounded by maximal service code size anyway (much smaller than 2**32 bytes).
    const preimageLength = tryAsU32(Number(l));
    const preimages = this.updatedState.stateUpdate.services.preimages.get(destination) ?? [];
    preimages.push(UpdatePreimage.remove({ hash: previousCodeHash, length: preimageLength }));
    this.updatedState.stateUpdate.services.preimages.set(destination, preimages);

    return Result.ok(OK);
  }

  read(serviceId: ServiceId | null, rawKey: StorageKey): BytesBlob | null {
    if (serviceId === null) {
      return null;
    }
    return this.updatedState.getStorage(serviceId, rawKey);
  }

  write(rawKey: StorageKey, data: BytesBlob | null): Result<number | null, "full"> {
    const rawKeyBytes = tryAsU64(rawKey.length);
    const current = this.read(this.currentServiceId, rawKey);
    const isAddingNew = current === null && data !== null;
    const isRemoving = current !== null && data === null;
    const countDiff = isAddingNew ? 1 : isRemoving ? -1 : 0;
    const lenDiff = (data?.length ?? 0) - (current?.length ?? 0);
    const baseStorageDiff = isAddingNew ? BASE_STORAGE_BYTES : isRemoving ? -BASE_STORAGE_BYTES : 0n;
    const keyDiffRemoving = isRemoving ? -rawKeyBytes : 0n;
    const keyDiffAdding = isAddingNew ? rawKeyBytes : 0n;
    const rawKeyDiff = keyDiffRemoving + keyDiffAdding;

    const serviceInfo = this.getCurrentServiceInfo();
    const items = serviceInfo.storageUtilisationCount + countDiff;
    const bytes = serviceInfo.storageUtilisationBytes + BigInt(lenDiff) + baseStorageDiff + rawKeyDiff;
    const res = this.updatedState.updateServiceStorageUtilisation(this.currentServiceId, items, bytes, serviceInfo);
    if (res.isError) {
      return Result.error("full", res.details);
    }

    this.updatedState.updateStorage(this.currentServiceId, rawKey, data);

    return Result.ok(current === null ? null : current.length);
  }

```
