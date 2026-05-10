---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.ts#L295-L414
title: packages/jam/transition/externalities/accumulate-externalities.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 3
chunk_total: 9
content_sha: e585e07c1cd4ab686339c0fc1153725d1e18c0af66b7c848819a503e12a797f5
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.ts` (lines 295–414)

```typescript
    if (s.status === PreimageStatusKind.Requested) {
      const res = updateStorageUtilisation();
      if (res.isError) {
        return Result.error(ForgetPreimageError.StorageUtilisationError, res.details);
      }
      this.updatedState.updatePreimage(
        serviceId,
        UpdatePreimage.remove({
          hash: status.hash,
          length: status.length,
        }),
      );
      return Result.ok(OK);
    }

    const t = this.currentTimeslot;
    // https://graypaper.fluffylabs.dev/#/ab2cdbd/380802380802?v=0.7.2
    if (s.status === PreimageStatusKind.Unavailable) {
      const y = s.data[1];
      if (y < t - this.chainSpec.preimageExpungePeriod) {
        const res = updateStorageUtilisation();
        if (res.isError) {
          return Result.error(ForgetPreimageError.StorageUtilisationError, res.details);
        }
        this.updatedState.updatePreimage(
          serviceId,
          UpdatePreimage.remove({
            hash: status.hash,
            length: status.length,
          }),
        );
        return Result.ok(OK);
      }

      return Result.error(
        ForgetPreimageError.NotExpired,
        () => `Preimage not expired: y=${y}, timeslot=${t}, period=${this.chainSpec.preimageExpungePeriod}`,
      );
    }

    // https://graypaper.fluffylabs.dev/#/ab2cdbd/382802383302?v=0.7.2
    if (s.status === PreimageStatusKind.Available) {
      this.updatedState.updatePreimage(
        serviceId,
        UpdatePreimage.updateOrAdd({
          lookupHistory: LookupHistoryItem.new(status.hash, status.length, tryAsLookupHistorySlots([s.data[0], t])),
        }),
      );
      return Result.ok(OK);
    }

    // https://graypaper.fluffylabs.dev/#/ab2cdbd/384002384c02?v=0.7.2
    if (s.status === PreimageStatusKind.Reavailable) {
      const y = s.data[1];
      if (y < t - this.chainSpec.preimageExpungePeriod) {
        this.updatedState.updatePreimage(
          serviceId,
          UpdatePreimage.updateOrAdd({
            lookupHistory: LookupHistoryItem.new(status.hash, status.length, tryAsLookupHistorySlots([s.data[2], t])),
          }),
        );

        return Result.ok(OK);
      }

      return Result.error(
        ForgetPreimageError.NotExpired,
        () => `Preimage not expired: y=${y}, timeslot=${t}, period=${this.chainSpec.preimageExpungePeriod}`,
      );
    }

    assertNever(s);
  }

  transfer(
    destinationId: ServiceId | null,
    amount: U64,
    gas: ServiceGas,
    memo: Bytes<TRANSFER_MEMO_BYTES>,
  ): Result<OK, TransferError> {
    const source = this.getCurrentServiceInfo();
    const destination = this.getServiceInfo(destinationId);
    /** https://graypaper.fluffylabs.dev/#/9a08063/370401370401?v=0.6.6 */
    if (destination === null || destinationId === null) {
      return Result.error(TransferError.DestinationNotFound, () => `Destination service not found: ${destinationId}`);
    }

    /** https://graypaper.fluffylabs.dev/#/9a08063/371301371301?v=0.6.6 */
    if (gas < destination.onTransferMinGas) {
      return Result.error(TransferError.GasTooLow, () => `Gas ${gas} below minimum ${destination.onTransferMinGas}`);
    }

    /** https://graypaper.fluffylabs.dev/#/9a08063/371b01371b01?v=0.6.6 */
    const newBalance = source.balance - amount;
    const thresholdBalance = ServiceAccountInfo.calculateThresholdBalance(
      source.storageUtilisationCount,
      source.storageUtilisationBytes,
      source.gratisStorage,
    );
    if (newBalance < thresholdBalance) {
      return Result.error(
        TransferError.BalanceBelowThreshold,
        () => `Balance ${newBalance} below threshold ${thresholdBalance}`,
      );
    }

    // outgoing transfer
    this.updatedState.stateUpdate.transfers.push(
      PendingTransfer.create({
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
```
