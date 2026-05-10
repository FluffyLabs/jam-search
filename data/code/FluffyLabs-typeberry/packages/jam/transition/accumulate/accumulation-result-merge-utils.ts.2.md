---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulation-result-merge-utils.ts#L211-L298
title: packages/jam/transition/accumulate/accumulation-result-merge-utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 2
chunk_total: 3
content_sha: 1ac1c5de9d41a7419d1e12d993a35f1e0f873261131ec12dba34e347c3bf05da
language: typescript
---
`packages/jam/transition/accumulate/accumulation-result-merge-utils.ts` (lines 211–298)

```typescript
  if (maybeUpdatedStorage !== undefined) {
    outputState.services.storage.set(serviceId, maybeUpdatedStorage);
  }
}

function mergePreimages(mergeContext: MergeContext, [serviceId, { stateUpdate }]: ResultEntry) {
  const outputState = mergeContext.outputState;
  const maybeUpdatedPreimages = stateUpdate.services.preimages.get(serviceId);

  if (maybeUpdatedPreimages !== undefined) {
    const currentServiceUpdates = maybeUpdatedPreimages.filter(
      (x) => x.action.kind !== UpdatePreimageKind.Provide || x.action.providedFor === serviceId,
    );
    const otherServiceUpdates = maybeUpdatedPreimages.filter(
      (x) => x.action.kind === UpdatePreimageKind.Provide && x.action.providedFor !== serviceId,
    );
    outputState.services.preimages.set(serviceId, currentServiceUpdates);
    for (const update of otherServiceUpdates) {
      if (update.action.kind !== UpdatePreimageKind.Provide) {
        continue;
      }
      const id = update.action.providedFor;
      const preimages = outputState.services.preimages.get(id) ?? [];
      preimages.push(update);
      outputState.services.preimages.set(id, preimages);
    }
  }
}

function mergeCreatedServices(mergeContext: MergeContext, [_serviceId, { stateUpdate }]: ResultEntry) {
  const { outputState, initialCreatedServices, newCreatedServices } = mergeContext;

  const createdServices = stateUpdate.services.created.filter((id) => !initialCreatedServices.has(id));

  for (const id of createdServices) {
    newCreatedServices.add(id);
    const update = stateUpdate.services.updated.get(id);

    if (update !== undefined) {
      outputState.services.updated.set(id, update);
    }
  }
}

function mergeRemovedServices(mergeContext: MergeContext, [_serviceId, { stateUpdate }]: ResultEntry) {
  const { outputState, initialRemovedServices, newRemovedServices } = mergeContext;
  const removedServices = stateUpdate.services.removed.filter((id) => !initialRemovedServices.has(id));

  for (const id of removedServices) {
    newRemovedServices.add(id);
    const preimages = stateUpdate.services.preimages.get(id);

    if (preimages !== undefined) {
      outputState.services.preimages.set(id, preimages);
    }
  }
}

function mergeUpdatedServices(mergeContext: MergeContext, [serviceId, { stateUpdate }]: ResultEntry) {
  const outputState = mergeContext.outputState;
  const maybeUpdatedService = stateUpdate.services.updated.get(serviceId);

  if (maybeUpdatedService !== undefined) {
    outputState.services.updated.set(serviceId, maybeUpdatedService);
  }
}

function mergeTransfers(mergeContext: MergeContext, [_serviceId, { stateUpdate }]: ResultEntry) {
  const { transfers } = mergeContext;
  transfers.push(...stateUpdate.transfers);
}

function mergeTotalGas(mergeContext: MergeContext, [_serviceId, { consumedGas }]: ResultEntry) {
  const { overflow, value } = sumU64(mergeContext.totalGasCost, consumedGas);
  mergeContext.totalGasCost = tryAsServiceGas(overflow ? MAX_VALUE_U64 : value);
}

function finalize(mergeContext: MergeContext): MergeResult {
  const state = mergeContext.outputState;
  state.services.created = Array.from(mergeContext.newCreatedServices);
  state.services.removed = Array.from(mergeContext.newRemovedServices);

  return {
    state,
    totalGasCost: mergeContext.totalGasCost,
    transfers: mergeContext.transfers,
  };
}
```
