---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulation-result-merge-utils.ts#L1-L109
title: packages/jam/transition/accumulate/accumulation-result-merge-utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 3
content_sha: 44e974ba39328b74af1297362a0f2a25872e53cea1d5ca1a42b4586ee57cfdb0
language: typescript
---
`packages/jam/transition/accumulate/accumulation-result-merge-utils.ts` (lines 1–109)

```typescript
import { type ServiceGas, type ServiceId, tryAsServiceGas } from "@typeberry/block";
import type { ChainSpec } from "@typeberry/config";
import { AccumulationStateUpdate, type PendingTransfer } from "@typeberry/jam-host-calls";
import { MAX_VALUE_U64, sumU64 } from "@typeberry/numbers";
import { PrivilegedServices, tryAsPerCore, UpdatePreimageKind } from "@typeberry/state";
import type { AccumulateState } from "./accumulate-state.js";

export function mergePerallelAccumulationResults(
  chainSpec: ChainSpec,
  state: AccumulateState,
  inputState: AccumulationStateUpdate,
  results: ParallelAccumulationResult,
): MergeResult {
  const mergeContext = createMergeContext(chainSpec, state, inputState, results);

  for (const resultEntry of results) {
    mergePrivilegedServices(mergeContext, resultEntry);
    mergeValidatorsData(mergeContext, resultEntry);
    mergeAuthorizationQueues(mergeContext, resultEntry);
    mergeServices(mergeContext, resultEntry);
    mergeTransfers(mergeContext, resultEntry);
    mergeTotalGas(mergeContext, resultEntry);
  }

  return finalize(mergeContext);
}

type ResultKey = ServiceId;
type ResultValue = { consumedGas: ServiceGas; stateUpdate: AccumulationStateUpdate };
type ResultEntry = [ResultKey, ResultValue];

export type ParallelAccumulationResult = Map<ResultKey, ResultValue>;

export type MergeResult = {
  transfers: PendingTransfer[];
  totalGasCost: ServiceGas;
  state: AccumulationStateUpdate;
};

type MergeContext = {
  outputState: AccumulationStateUpdate;
  transfers: PendingTransfer[];
  totalGasCost: ServiceGas;
  currentPrivilegedServices: PrivilegedServices;
  privilegedServicesUpdatedByManager: PrivilegedServices;
  newCreatedServices: Set<ServiceId>;
  initialCreatedServices: Set<ServiceId>;
  newRemovedServices: Set<ServiceId>;
  initialRemovedServices: Set<ServiceId>;
  chainSpec: ChainSpec;
};

function createMergeContext(
  chainSpec: ChainSpec,
  state: AccumulateState,
  inputState: AccumulationStateUpdate,
  results: ParallelAccumulationResult,
): MergeContext {
  const currentPrivilegedServices = inputState.privilegedServices ?? state.privilegedServices;
  const currentManager = currentPrivilegedServices.manager;
  const privilegedServicesUpdatedByManager =
    results.get(currentManager)?.stateUpdate.privilegedServices ?? currentPrivilegedServices;

  return {
    chainSpec,
    outputState: AccumulationStateUpdate.copyFrom(inputState),
    transfers: [],
    totalGasCost: tryAsServiceGas(0),
    currentPrivilegedServices,
    privilegedServicesUpdatedByManager,
    newCreatedServices: new Set(inputState.services.created),
    initialCreatedServices: new Set(inputState.services.created),
    newRemovedServices: new Set(inputState.services.removed),
    initialRemovedServices: new Set(inputState.services.removed),
  };
}

function updatePrivilegedService(
  currentServiceId: ServiceId,
  serviceIdUpdatedByManager: ServiceId,
  selfUpdatedServiceId: ServiceId,
) {
  if (currentServiceId === serviceIdUpdatedByManager) {
    return selfUpdatedServiceId;
  }

  return serviceIdUpdatedByManager;
}

function mergePrivilegedServices(mergeContext: MergeContext, [serviceId, { stateUpdate }]: ResultEntry) {
  const { outputState, currentPrivilegedServices, chainSpec, privilegedServicesUpdatedByManager } = mergeContext;
  const currentManager = currentPrivilegedServices.manager;
  const currentRegistrar = currentPrivilegedServices.registrar;
  const currentDelegator = currentPrivilegedServices.delegator;
  const currentAssigners = currentPrivilegedServices.assigners;
  const { privilegedServices } = stateUpdate;

  if (privilegedServices === null) {
    return;
  }

  // initial value (ignore the update, because it might not be authorized)
  if (outputState.privilegedServices === null) {
    outputState.privilegedServices = PrivilegedServices.create({
      ...currentPrivilegedServices,
    });
  }

  // manager can override everything and it always takes precedence over
```
