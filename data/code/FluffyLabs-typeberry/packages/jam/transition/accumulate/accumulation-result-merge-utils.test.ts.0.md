---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts#L1-L128
title: packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 10
content_sha: d39c74ddb13a58d33b4a71eea0412907ae9baba607b02a54b3146a83dcb9941a
language: typescript
---
`packages/jam/transition/accumulate/accumulation-result-merge-utils.test.ts` (lines 1–128)

```typescript
import { describe, it } from "node:test";
import {
  type PerValidator,
  type ServiceGas,
  type ServiceId,
  tryAsCoreIndex,
  tryAsPerValidator,
  tryAsServiceGas,
  tryAsServiceId,
  tryAsTimeSlot,
} from "@typeberry/block";
import type { AuthorizerHash } from "@typeberry/block/refine-context.js";
import { Bytes } from "@typeberry/bytes";
import { FixedSizeArray } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import { BANDERSNATCH_KEY_BYTES, BLS_KEY_BYTES, ED25519_KEY_BYTES } from "@typeberry/crypto";
import { HASH_SIZE } from "@typeberry/hash";
import { AccumulationStateUpdate, PendingTransfer } from "@typeberry/jam-host-calls";
import { TRANSFER_MEMO_BYTES } from "@typeberry/jam-host-calls/externalities/partial-state.js";
import { MAX_VALUE_U64, tryAsU32, tryAsU64, type U64 } from "@typeberry/numbers";
import {
  AUTHORIZATION_QUEUE_SIZE,
  InMemoryState,
  PreimageItem,
  PrivilegedServices,
  ServiceAccountInfo,
  StorageItem,
  tryAsPerCore,
  UpdatePreimage,
  UpdateService,
  UpdateStorage,
  VALIDATOR_META_BYTES,
  ValidatorData,
} from "@typeberry/state";
import { deepEqual } from "@typeberry/utils";
import { mergePerallelAccumulationResults } from "./accumulation-result-merge-utils.js";

class AccumulationStateUpdateBuilder {
  private stateUpdate = AccumulationStateUpdate.empty();

  private constructor() {}

  static new() {
    return new AccumulationStateUpdateBuilder();
  }

  withTransfers(transfers: PendingTransfer[]) {
    this.stateUpdate.transfers = transfers;
    return this;
  }

  withPrivilegedServices(privilegedServices: PrivilegedServices) {
    this.stateUpdate.privilegedServices = privilegedServices;
    return this;
  }

  withDelegator(maybeDelegatorServiceId: number) {
    if (this.stateUpdate.privilegedServices === null) {
      throw new Error("PrivilegedServices have not been initialized yet. Use `withPrivilegedServices` first");
    }
    const delegator = tryAsServiceId(maybeDelegatorServiceId);
    this.withPrivilegedServices({
      ...this.stateUpdate.privilegedServices,
      delegator,
    });

    return this;
  }

  withRegistrar(maybeRegistarServiceId: number) {
    if (this.stateUpdate.privilegedServices === null) {
      throw new Error("PrivilegedServices have not been initialized yet. Use `withPrivilegedServices` first");
    }
    const registrar = tryAsServiceId(maybeRegistarServiceId);
    this.withPrivilegedServices({
      ...this.stateUpdate.privilegedServices,
      registrar,
    });

    return this;
  }

  withAssigners(maybeAssigners: number[]) {
    if (this.stateUpdate.privilegedServices === null) {
      throw new Error("PrivilegedServices have not been initialized yet. Use `withPrivilegedServices` first");
    }

    const assigners = tryAsPerCore(maybeAssigners.map(tryAsServiceId), tinyChainSpec);
    this.withPrivilegedServices({
      ...this.stateUpdate.privilegedServices,
      assigners,
    });

    return this;
  }

  withValidatorsData(validatorsData: PerValidator<ValidatorData>) {
    this.stateUpdate.validatorsData = validatorsData;
    return this;
  }

  withAuthorizationQueue(maybeCoreIndex: number, queue: AuthorizerHash[]) {
    const coreIndex = tryAsCoreIndex(maybeCoreIndex);
    const fixedQueue = FixedSizeArray.new(queue, AUTHORIZATION_QUEUE_SIZE);
    this.stateUpdate.authorizationQueues.set(coreIndex, fixedQueue);
    return this;
  }

  withServiceStorage(maybeServiceId: number, updates: UpdateStorage[]) {
    const serviceId = tryAsServiceId(maybeServiceId);
    this.stateUpdate.services.storage.set(serviceId, updates);
    return this;
  }

  get() {
    return this.stateUpdate;
  }
}

class AccumulationResultsBuilder {
  private results = new Map<ServiceId, { consumedGas: ServiceGas; stateUpdate: AccumulationStateUpdate }>();

  private constructor() {}

  static new() {
    return new AccumulationResultsBuilder();
  }

```
