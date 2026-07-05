---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/in-memory-state.test.ts#L1-L134
title: packages/jam/state/in-memory-state.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 5
content_sha: 489fb3f382ba249a41eca1b22a0a4d4795e22a91c816df38a3c42226d508791e
language: typescript
---
`packages/jam/state/in-memory-state.test.ts` (lines 1–134)

```typescript
import assert from "node:assert";
import { before, describe, it } from "node:test";
import { tryAsServiceGas, tryAsServiceId, tryAsTimeSlot } from "@typeberry/block";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { HashDictionary } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import { Blake2b, HASH_SIZE } from "@typeberry/hash";
import { tryAsU32, tryAsU64 } from "@typeberry/numbers";
import { asOpaqueType, deepEqual, OK, Result } from "@typeberry/utils";
import { InMemoryState, UpdateError } from "./in-memory-state.js";
import {
  LookupHistoryItem,
  PreimageItem,
  ServiceAccountInfo,
  StorageItem,
  type StorageKey,
  tryAsLookupHistorySlots,
} from "./service.js";
import { UpdatePreimage, UpdateService, UpdateStorage } from "./state-update.js";

let blake2b: Blake2b;

before(async () => {
  blake2b = await Blake2b.createHasher();
});

describe("InMemoryState", () => {
  // backward-compatable account fields
  const accountComp = {
    gratisStorage: tryAsU64(1024),
    created: tryAsTimeSlot(10),
    lastAccumulation: tryAsTimeSlot(15),
    parentService: tryAsServiceId(1),
  };

  it("should not change anything when state udpate is empty", () => {
    const state = InMemoryState.empty(tinyChainSpec);
    const expectedState = InMemoryState.empty(tinyChainSpec);

    state.applyUpdate({});

    deepEqual(state, expectedState);
  });

  it("should create a new service when UpdateServiceKind.Create is applied", () => {
    const state = InMemoryState.empty(tinyChainSpec);

    const serviceId = tryAsServiceId(1);
    const accountInfo = ServiceAccountInfo.create({
      codeHash: Bytes.zero(HASH_SIZE).asOpaque(),
      balance: tryAsU64(100),
      accumulateMinGas: tryAsServiceGas(10),
      onTransferMinGas: tryAsServiceGas(5),
      storageUtilisationBytes: tryAsU64(8),
      storageUtilisationCount: tryAsU32(3),
      ...accountComp,
    });

    const result = state.applyUpdate({
      updated: new Map([
        [
          serviceId,
          UpdateService.create({
            serviceInfo: accountInfo,
            lookupHistory: null,
          }),
        ],
      ]),
    });

    assert.deepEqual(result, Result.ok(OK));

    const service = state.services.get(serviceId);
    if (service === undefined) {
      assert.fail("Service not created!");
    }
    assert.deepEqual(service.data.info, accountInfo);
    assert.deepEqual(service.data.storage, new Map());
    assert.deepEqual(service.data.preimages, HashDictionary.new());
    assert.deepEqual(service.data.lookupHistory, HashDictionary.new());
  });

  it("should fail to create a service that already exists", () => {
    const state = InMemoryState.empty(tinyChainSpec);

    const serviceId = tryAsServiceId(1);
    const accountInfo = ServiceAccountInfo.create({
      codeHash: Bytes.zero(HASH_SIZE).asOpaque(),
      balance: tryAsU64(100),
      accumulateMinGas: tryAsServiceGas(10),
      onTransferMinGas: tryAsServiceGas(5),
      storageUtilisationBytes: tryAsU64(8),
      storageUtilisationCount: tryAsU32(3),
      ...accountComp,
    });

    // First creation succeeds
    let result = state.applyUpdate({
      updated: new Map([
        [
          serviceId,
          UpdateService.create({
            serviceInfo: accountInfo,
            lookupHistory: null,
          }),
        ],
      ]),
    });

    assert.deepEqual(result, Result.ok(OK));

    // Second creation should fail
    result = state.applyUpdate({
      updated: new Map([
        [
          serviceId,
          UpdateService.create({
            serviceInfo: accountInfo,
            lookupHistory: null,
          }),
        ],
      ]),
    });

    deepEqual(
      result,
      Result.error(UpdateError.DuplicateService, () => "1 already exists!"),
    );
  });

  it("should update storage of an existing service", () => {
    const state = InMemoryState.empty(tinyChainSpec);

    const serviceId = tryAsServiceId(1);
```
