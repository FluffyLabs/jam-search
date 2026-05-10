---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/in-memory-state.ts#L314-L407
title: packages/jam/state/in-memory-state.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 3
chunk_total: 7
content_sha: fa1574599fbf15422ebfac6e89cb17861739a8c0a4cb868d2eda4c39f8aad0c5
language: typescript
---
`packages/jam/state/in-memory-state.ts` (lines 314–407)

```typescript
      for (const update of updates) {
        const { kind } = update.action;
        const service = this.services.get(serviceId);
        if (service === undefined) {
          return Result.error(
            UpdateError.NoService,
            () => `Attempting to update storage of non-existing service: ${serviceId}`,
          );
        }

        if (kind === UpdateStorageKind.Set) {
          const { key, value } = update.action.storage;
          service.data.storage.set(key.toString(), StorageItem.create({ key, value }));
        } else if (kind === UpdateStorageKind.Remove) {
          const { key } = update.action;
          check`
          ${service.data.storage.has(key.toString())}
          Attempting to remove non-existing storage item at ${serviceId}: ${update.action.key}
        `;
          service.data.storage.delete(key.toString());
        } else {
          assertNever(kind);
        }
      }
    }
    return Result.ok(OK);
  }

  private updatePreimages(preimagesUpdates: Map<ServiceId, UpdatePreimage[]> | undefined): Result<OK, UpdateError> {
    if (preimagesUpdates === undefined) {
      return Result.ok(OK);
    }
    for (const [serviceId, updates] of preimagesUpdates.entries()) {
      const service = this.services.get(serviceId);
      if (service === undefined) {
        return Result.error(
          UpdateError.NoService,
          () => `Attempting to update preimage of non-existing service: ${serviceId}`,
        );
      }
      for (const update of updates) {
        const { kind } = update.action;
        if (kind === UpdatePreimageKind.Provide) {
          const { preimage, slot } = update.action;
          if (service.data.preimages.has(preimage.hash)) {
            return Result.error(
              UpdateError.PreimageExists,
              () => `Overwriting existing preimage at ${serviceId}: ${preimage}`,
            );
          }
          service.data.preimages.set(preimage.hash, preimage);
          if (slot !== null) {
            const lookupHistory = service.data.lookupHistory.get(preimage.hash);
            const length = tryAsU32(preimage.blob.length);
            const lookup = LookupHistoryItem.new(preimage.hash, length, tryAsLookupHistorySlots([slot]));
            if (lookupHistory === undefined) {
              // no lookup history for that preimage at all (edge case, should be requested)
              service.data.lookupHistory.set(preimage.hash, [lookup]);
            } else {
              // insert or replace exiting entry
              const index = lookupHistory.map((x) => x.length).indexOf(length);
              lookupHistory.splice(index, index === -1 ? 0 : 1, lookup);
            }
          }
        } else if (kind === UpdatePreimageKind.Remove) {
          const { hash, length } = update.action;
          service.data.preimages.delete(hash);
          const history = service.data.lookupHistory.get(hash) ?? [];
          const idx = history.map((x) => x.length).indexOf(length);
          if (idx !== -1) {
            history.splice(idx, 1);
          }
        } else if (kind === UpdatePreimageKind.UpdateOrAdd) {
          const { item } = update.action;
          const history = service.data.lookupHistory.get(item.hash) ?? [];
          const existingIdx = history.map((x) => x.length).indexOf(item.length);
          const removeCount = existingIdx === -1 ? 0 : 1;
          history.splice(existingIdx, removeCount, item);
          service.data.lookupHistory.set(item.hash, history);
        } else {
          assertNever(kind);
        }
      }
    }
    return Result.ok(OK);
  }

  private updateServices(servicesUpdates: Map<ServiceId, UpdateService> | undefined): Result<OK, UpdateError> {
    if (servicesUpdates === undefined) {
      return Result.ok(OK);
    }
    for (const [serviceId, update] of servicesUpdates.entries()) {
      const { kind, account } = update.action;
      if (kind === UpdateServiceKind.Create) {
```
