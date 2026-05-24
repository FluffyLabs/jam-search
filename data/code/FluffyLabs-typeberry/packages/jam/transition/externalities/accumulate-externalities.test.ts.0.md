---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L1-L126
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 26
content_sha: b0d566d3028d5ffb0281f3d1c8366d842458ac9200d60ecda4b275db91c207fd
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 1–126)

```typescript
import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import {
  type CodeHash,
  type ServiceId,
  tryAsCoreIndex,
  tryAsServiceGas,
  tryAsServiceId,
  tryAsTimeSlot,
} from "@typeberry/block";
import type { PreimageHash } from "@typeberry/block/preimage.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { asKnownSize, FixedSizeArray, HashDictionary } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import { BANDERSNATCH_KEY_BYTES, BLS_KEY_BYTES, ED25519_KEY_BYTES } from "@typeberry/crypto";
import { Blake2b, HASH_SIZE } from "@typeberry/hash";
import {
  CURRENT_SERVICE_ID,
  EjectError,
  ForgetPreimageError,
  NewServiceError,
  PartiallyUpdatedState,
  PendingTransfer,
  PreimageStatusKind,
  ProvidePreimageError,
  RequestPreimageError,
  TRANSFER_MEMO_BYTES,
  TransferError,
  UnprivilegedError,
  UpdatePrivilegesError,
  writeServiceIdAsLeBytes,
} from "@typeberry/jam-host-calls";
import { tryAsU32, tryAsU64, type U32, type U64 } from "@typeberry/numbers";
import {
  AUTHORIZATION_QUEUE_SIZE,
  InMemoryService,
  InMemoryState,
  LookupHistoryItem,
  type LookupHistorySlots,
  PreimageItem,
  PrivilegedServices,
  ServiceAccountInfo,
  StorageItem,
  type StorageKey,
  tryAsLookupHistorySlots,
  tryAsPerCore,
  UpdatePreimage,
  UpdateService,
  VALIDATOR_META_BYTES,
  ValidatorData,
} from "@typeberry/state";
import { testState } from "@typeberry/state/test.utils.js";
import { asOpaqueType, deepEqual, OK, Result } from "@typeberry/utils";
import { AccumulateExternalities } from "./accumulate-externalities.js";

let blake2b: Blake2b;

before(async () => {
  blake2b = await Blake2b.createHasher();
});

function partiallyUpdatedState() {
  return PartiallyUpdatedState.new(testState());
}

const INVALID_SERVICE_ID_ERROR = "Either manager or delegator or registrar is not a valid service id.";

describe("PartialState.checkPreimageStatus", () => {
  it("should check preimage status from state", () => {
    const state = partiallyUpdatedState();
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });
    const preimageHash = Bytes.parseBytes(
      "0xc16326432b5b3213dfd1609495e13c6b276cb474d679645337e5c2c09f19b53c",
      HASH_SIZE,
    ).asOpaque();

    const status = partialState.checkPreimageStatus(preimageHash, tryAsU64(35));
    assert.deepStrictEqual(status, {
      status: PreimageStatusKind.Available,
      data: [0],
    });
  });

  it("should return preimage status when its in updated state", () => {
    const state = partiallyUpdatedState();
    const serviceId = tryAsServiceId(0);
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: serviceId,
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const preimageHash = Bytes.parseBytes(
      "0xc16326432b5b3213dfd1609495e13c6b276cb474d679645337e5c2c09f19b53c",
      HASH_SIZE,
    ).asOpaque();
    const length = tryAsU64(35);

    const updates = state.stateUpdate.services.preimages.get(serviceId) ?? [];
    updates.push(
      UpdatePreimage.updateOrAdd({
        lookupHistory: LookupHistoryItem.new(preimageHash, tryAsU32(Number(length)), tryAsLookupHistorySlots([])),
      }),
    );
    state.stateUpdate.services.preimages.set(serviceId, updates);

    const status = partialState.checkPreimageStatus(preimageHash, length);
    assert.deepStrictEqual(status, {
      status: PreimageStatusKind.Requested,
    });
  });
});

describe("PartialState.requestPreimage", () => {
  it("should request a preimage and update service info", () => {
    const state = partiallyUpdatedState();
```
