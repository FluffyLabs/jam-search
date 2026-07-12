---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/externalities/state-update.ts#L342-L421
title: packages/jam/jam-host-calls/externalities/state-update.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 3
chunk_total: 4
content_sha: e1642a461e0fd7bb358a22b4ffe6cabcf42ab030d27cac7da29fc04d578532f5
language: typescript
---
`packages/jam/jam-host-calls/externalities/state-update.ts` (lines 342–421)

```typescript
    check`${items >= 0} storageUtilisationCount has to be a positive number, got: ${items}`;
    check`${bytes >= 0} storageUtilisationBytes has to be a positive number, got: ${bytes}`;

    const overflowItems = !isU32(items);
    const overflowBytes = !isU64(bytes);

    // TODO [ToDr] this is not specified in GP, but it seems sensible.
    if (overflowItems || overflowBytes) {
      return Result.error(
        InsufficientFundsError,
        () => `Storage utilisation overflow: items=${overflowItems}, bytes=${overflowBytes}`,
      );
    }

    const thresholdBalance = ServiceAccountInfo.calculateThresholdBalance(items, bytes, serviceInfo.gratisStorage);
    if (serviceInfo.balance < thresholdBalance) {
      return Result.error(
        InsufficientFundsError,
        () => `Service balance (${serviceInfo.balance}) below threshold (${thresholdBalance})`,
      );
    }

    // Update service info with new details.
    this.updateServiceInfo(
      serviceId,
      ServiceAccountInfo.create({
        ...serviceInfo,
        storageUtilisationBytes: bytes,
        storageUtilisationCount: items,
      }),
    );
    return Result.ok(OK);
  }

  updateServiceInfo(serviceId: ServiceId, newInfo: ServiceAccountInfo) {
    const existingUpdate = this.stateUpdate.services.updated.get(serviceId);

    if (existingUpdate?.action.kind === UpdateServiceKind.Create) {
      this.stateUpdate.services.updated.set(
        serviceId,
        UpdateService.create({
          serviceInfo: newInfo,
          lookupHistory: existingUpdate.action.lookupHistory,
        }),
      );
      return;
    }

    this.stateUpdate.services.updated.set(
      serviceId,
      UpdateService.update({
        serviceInfo: newInfo,
      }),
    );
  }

  createService(serviceId: ServiceId, newInfo: ServiceAccountInfo, newLookupHistory: LookupHistoryItem) {
    this.stateUpdate.services.created.push(serviceId);
    this.stateUpdate.services.updated.set(
      serviceId,
      UpdateService.create({
        serviceInfo: newInfo,
        lookupHistory: newLookupHistory,
      }),
    );
  }

  getPrivilegedServices() {
    if (this.stateUpdate.privilegedServices !== null) {
      return this.stateUpdate.privilegedServices;
    }

    return this.state.privilegedServices;
  }
}

function preimageLenAsU32(length: U64) {
  // Safe to convert to Number and U32: we check that len < 2^32 before conversion
  return length >= 2n ** 32n ? null : tryAsU32(Number(length));
}
```
