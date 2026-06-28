---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulation-result-merge-utils.ts#L103-L216
title: packages/jam/transition/accumulate/accumulation-result-merge-utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 3
content_sha: 43104bbc0e82aa5f9dc2f80868e8a4632b4cbeca453f497574f415f2e3cec112
language: typescript
---
`packages/jam/transition/accumulate/accumulation-result-merge-utils.ts` (lines 103–216)

```typescript
  if (outputState.privilegedServices === null) {
    outputState.privilegedServices = PrivilegedServices.create({
      ...currentPrivilegedServices,
    });
  }

  // manager can override everything and it always takes precedence over
  // everything else
  if (serviceId === currentManager) {
    outputState.privilegedServices = PrivilegedServices.create({
      ...privilegedServices,
    });
  }

  // current registrar can transfer out it's permissions, but only if
  // it wasn't overwritten by manager in current run
  if (serviceId === currentRegistrar) {
    const newRegistrar = updatePrivilegedService(
      currentPrivilegedServices.registrar,
      privilegedServicesUpdatedByManager.registrar,
      privilegedServices.registrar,
    );

    outputState.privilegedServices = PrivilegedServices.create({
      ...outputState.privilegedServices,
      registrar: newRegistrar,
    });
  }

  // current delegator can transfer out it's permissions, but only if
  // it wasn't overwritten by manager in current run
  if (serviceId === currentDelegator) {
    const newDelegator = updatePrivilegedService(
      currentPrivilegedServices.delegator,
      privilegedServicesUpdatedByManager.delegator,
      privilegedServices.delegator,
    );
    outputState.privilegedServices = PrivilegedServices.create({
      ...outputState.privilegedServices,
      delegator: newDelegator,
    });
  }

  let shouldUpdateAssigners = false;

  // same with assigners - they are free to transfer out their core
  const newAssigners = currentAssigners.map((currentAssigner, coreIndex) => {
    if (serviceId === currentAssigner) {
      const newAssigner = updatePrivilegedService(
        currentPrivilegedServices.assigners[coreIndex],
        privilegedServicesUpdatedByManager.assigners[coreIndex],
        privilegedServices.assigners[coreIndex],
      );

      shouldUpdateAssigners = shouldUpdateAssigners || newAssigner !== currentAssigner;

      return newAssigner;
    }

    return currentAssigner;
  });

  if (shouldUpdateAssigners) {
    const newAssignersPerCore = tryAsPerCore(newAssigners, chainSpec);
    outputState.privilegedServices = PrivilegedServices.create({
      ...outputState.privilegedServices,
      assigners: newAssignersPerCore,
    });
  }
}

function mergeValidatorsData(mergeContext: MergeContext, [serviceId, { stateUpdate }]: ResultEntry) {
  const { outputState, currentPrivilegedServices } = mergeContext;
  const currentDelegator = currentPrivilegedServices.delegator;
  const { validatorsData } = stateUpdate;

  if (validatorsData !== null && serviceId === currentDelegator) {
    outputState.validatorsData = validatorsData;
  }
}

function mergeAuthorizationQueues(mergeContext: MergeContext, [serviceId, { stateUpdate }]: ResultEntry) {
  const { outputState, currentPrivilegedServices } = mergeContext;
  const currentAssigners = currentPrivilegedServices.assigners;
  const { authorizationQueues } = stateUpdate;

  if (authorizationQueues !== null) {
    for (const [core, queue] of authorizationQueues.entries()) {
      if (serviceId === currentAssigners[core]) {
        outputState.authorizationQueues.set(core, queue);
      }
    }
  }
}

function mergeServices(mergeContext: MergeContext, resultEntry: ResultEntry) {
  mergePreimages(mergeContext, resultEntry);
  mergeStorage(mergeContext, resultEntry);
  mergeCreatedServices(mergeContext, resultEntry);
  mergeUpdatedServices(mergeContext, resultEntry);
  mergeRemovedServices(mergeContext, resultEntry);
}

function mergeStorage(mergeContext: MergeContext, [serviceId, { stateUpdate }]: ResultEntry) {
  const outputState = mergeContext.outputState;

  const maybeUpdatedStorage = stateUpdate.services.storage.get(serviceId);

  if (maybeUpdatedStorage !== undefined) {
    outputState.services.storage.set(serviceId, maybeUpdatedStorage);
  }
}

function mergePreimages(mergeContext: MergeContext, [serviceId, { stateUpdate }]: ResultEntry) {
```
