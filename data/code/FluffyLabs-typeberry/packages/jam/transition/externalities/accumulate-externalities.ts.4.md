---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.ts#L404-L504
title: packages/jam/transition/externalities/accumulate-externalities.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 4
chunk_total: 9
content_sha: 0f8e05997201d53aa86624957ce324fc5946e7d89fabdb7c186b27b1ca4c59ff
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.ts` (lines 404–504)

```typescript
        source: this.currentServiceId,
        destination: destinationId,
        amount,
        memo,
        gas,
      }),
    );

    // reduced balance
    this.updatedState.updateServiceInfo(
      this.currentServiceId,
      ServiceAccountInfo.create({
        ...source,
        balance: tryAsU64(newBalance),
      }),
    );
    return Result.ok(OK);
  }

  newService(
    codeHash: CodeHash,
    codeLength: U64,
    accumulateMinGas: ServiceGas,
    onTransferMinGas: ServiceGas,
    gratisStorage: U64,
    wantedServiceId: U64,
  ): Result<ServiceId, NewServiceError> {
    // calculate the threshold. Storage is empty, one preimage requested.
    // https://graypaper.fluffylabs.dev/#/7e6ff6a/115901115901?v=0.6.7
    const items = tryAsU32(2 * 1 + 0);
    // https://graypaper.fluffylabs.dev/#/7e6ff6a/116b01116b01?v=0.6.7
    const bytes = sumU64(LOOKUP_HISTORY_ENTRY_BYTES, codeLength);
    const clampedLength = clampU64ToU32(codeLength);

    // check if we are priviledged to set gratis storage
    // https://graypaper.fluffylabs.dev/#/7e6ff6a/369203369603?v=0.6.7
    if (gratisStorage !== tryAsU64(0) && this.currentServiceId !== this.updatedState.getPrivilegedServices().manager) {
      return Result.error(
        NewServiceError.UnprivilegedService,
        () => `Service ${this.currentServiceId} not privileged to set gratis storage`,
      );
    }

    // check if we have enough balance
    // https://graypaper.fluffylabs.dev/#/7e6ff6a/369e0336a303?v=0.6.7
    const thresholdForNew = ServiceAccountInfo.calculateThresholdBalance(items, bytes.value, gratisStorage);
    const currentService = this.getCurrentServiceInfo();
    const thresholdForCurrent = ServiceAccountInfo.calculateThresholdBalance(
      currentService.storageUtilisationCount,
      currentService.storageUtilisationBytes,
      currentService.gratisStorage,
    );
    const balanceLeftForCurrent = currentService.balance - thresholdForNew;
    if (balanceLeftForCurrent < thresholdForCurrent || bytes.overflow) {
      return Result.error(
        NewServiceError.InsufficientFunds,
        () =>
          `Insufficient funds: balance=${currentService.balance}, required=${thresholdForNew}, overflow=${bytes.overflow}`,
      );
    }

    // `a`: https://graypaper.fluffylabs.dev/#/ab2cdbd/366b02366d02?v=0.7.2
    const newAccount = ServiceAccountInfo.create({
      codeHash,
      balance: thresholdForNew,
      accumulateMinGas,
      onTransferMinGas,
      storageUtilisationBytes: bytes.value,
      storageUtilisationCount: items,
      gratisStorage,
      created: this.currentTimeslot,
      lastAccumulation: tryAsTimeSlot(0),
      parentService: this.currentServiceId,
    });

    const newLookupItem = LookupHistoryItem.new(codeHash.asOpaque(), clampedLength, tryAsLookupHistorySlots([]));

    // `s`: https://graypaper.fluffylabs.dev/#/ab2cdbd/361003361003?v=0.7.2
    const updatedCurrentAccount = ServiceAccountInfo.create({
      ...currentService,
      balance: tryAsU64(balanceLeftForCurrent),
    });

    if (
      wantedServiceId < MIN_PUBLIC_SERVICE_INDEX &&
      this.currentServiceId === this.updatedState.getPrivilegedServices().registrar
    ) {
      // NOTE: It's safe to cast to `Number` here, bcs here service ID cannot be bigger than 2**16
      const newServiceId = tryAsServiceId(Number(wantedServiceId));
      if (this.getServiceInfo(newServiceId) !== null) {
        return Result.error(
          NewServiceError.RegistrarServiceIdAlreadyTaken,
          () => `Service ID ${newServiceId} already taken`,
        );
      }
      // add the new service with selected ID
      // https://graypaper.fluffylabs.dev/#/ab2cdbd/36be0336c003?v=0.7.2
      this.updatedState.createService(newServiceId, newAccount, newLookupItem);
      // update the balance of current service
      // https://graypaper.fluffylabs.dev/#/ab2cdbd/36c20336c403?v=0.7.2
      this.updatedState.updateServiceInfo(this.currentServiceId, updatedCurrentAccount);
```
