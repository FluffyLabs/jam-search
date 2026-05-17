---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.ts#L209-L299
title: packages/jam/transition/externalities/accumulate-externalities.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 2
chunk_total: 9
content_sha: 10e44a30e9c9fb690d0c8afed338b1f0b2afbd2e8cf869cb116396fcc19326e6
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.ts` (lines 209–299)

```typescript
    const existingPreimage = this.updatedState.getLookupHistory(
      this.currentTimeslot,
      this.currentServiceId,
      hash,
      length,
    );

    if (existingPreimage !== null) {
      const len = existingPreimage.slots.length;
      // https://graypaper.fluffylabs.dev/#/9a08063/380901380901?v=0.6.6
      if (len === PreimageStatusKind.Requested) {
        return Result.error(RequestPreimageError.AlreadyRequested, () => `Preimage already requested: hash=${hash}`);
      }
      if (len === PreimageStatusKind.Available || len === PreimageStatusKind.Reavailable) {
        return Result.error(RequestPreimageError.AlreadyAvailable, () => `Preimage already available: hash=${hash}`);
      }

      // TODO [ToDr] Not sure if we should update the service info in that case,
      // but for now we let that case fall-through.
      check`${len === PreimageStatusKind.Unavailable} preimage is not unavailable`;
    }

    // make sure we have enough balance for this update
    // https://graypaper.fluffylabs.dev/#/9a08063/381201381601?v=0.6.6
    const serviceInfo = this.getCurrentServiceInfo();
    const hasPreimage = existingPreimage !== null;
    const countDiff = hasPreimage ? 0 : 2;
    const lenDiff = length - BigInt(existingPreimage?.length ?? 0);
    const items = serviceInfo.storageUtilisationCount + countDiff;
    const bytes =
      serviceInfo.storageUtilisationBytes + BigInt(lenDiff) + (hasPreimage ? 0n : LOOKUP_HISTORY_ENTRY_BYTES);

    const res = this.updatedState.updateServiceStorageUtilisation(this.currentServiceId, items, bytes, serviceInfo);

    if (res.isError) {
      return Result.error(RequestPreimageError.InsufficientFunds, res.details);
    }

    // and now update preimages

    // TODO [ToDr] This is probably invalid. What if someome requests the same
    // hash with two different lengths over `2**32`? We will end up with the same entry.
    // hopefuly this will be prohibitevely expensive?
    const clampedLength = clampU64ToU32(length);
    if (existingPreimage === null) {
      // https://graypaper.fluffylabs.dev/#/9a08063/38a60038a600?v=0.6.6
      this.updatedState.updatePreimage(
        this.currentServiceId,
        UpdatePreimage.updateOrAdd({
          lookupHistory: LookupHistoryItem.new(hash, clampedLength, tryAsLookupHistorySlots([])),
        }),
      );
    } else {
      /** https://graypaper.fluffylabs.dev/#/9a08063/38ca0038ca00?v=0.6.6 */
      this.updatedState.updatePreimage(
        this.currentServiceId,
        UpdatePreimage.updateOrAdd({
          lookupHistory: LookupHistoryItem.new(
            hash,
            clampedLength,
            tryAsLookupHistorySlots([...existingPreimage.slots, this.currentTimeslot]),
          ),
        }),
      );
    }

    return Result.ok(OK);
  }

  forgetPreimage(hash: PreimageHash, length: U64): Result<OK, ForgetPreimageError> {
    const serviceId = this.currentServiceId;
    const status = this.updatedState.getLookupHistory(this.currentTimeslot, this.currentServiceId, hash, length);
    if (status === null) {
      return Result.error(ForgetPreimageError.NotFound, () => `Preimage not found: hash=${hash}, length=${length}`);
    }

    const s = slotsToPreimageStatus(status.slots);

    const updateStorageUtilisation = () => {
      const serviceInfo = this.getCurrentServiceInfo();
      const items = serviceInfo.storageUtilisationCount - 2; // subtracting 1 for lookup history item and 1 for the preimage
      const bytes = serviceInfo.storageUtilisationBytes - length - LOOKUP_HISTORY_ENTRY_BYTES;
      return this.updatedState.updateServiceStorageUtilisation(this.currentServiceId, items, bytes, serviceInfo);
    };

    // https://graypaper.fluffylabs.dev/#/ab2cdbd/380802380802?v=0.7.2
    if (s.status === PreimageStatusKind.Requested) {
      const res = updateStorageUtilisation();
      if (res.isError) {
        return Result.error(ForgetPreimageError.StorageUtilisationError, res.details);
      }
```
