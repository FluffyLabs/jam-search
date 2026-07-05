---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/preimages.test.ts#L1-L110
title: packages/jam/transition/preimages.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 5c4bf022b0315bd04052364f06641d8dc4be96c9f6847066d6b07af3998bd8f4
language: typescript
---
`packages/jam/transition/preimages.test.ts` (lines 1–110)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import type { ServiceId } from "@typeberry/block";
import { tryAsServiceGas, tryAsServiceId, tryAsTimeSlot } from "@typeberry/block";
import type { PreimagesExtrinsic } from "@typeberry/block/preimage.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { HashDictionary } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import { Blake2b, HASH_SIZE } from "@typeberry/hash";
import { tryAsU32, tryAsU64 } from "@typeberry/numbers";
import {
  InMemoryService,
  InMemoryState,
  LookupHistoryItem,
  PreimageItem,
  ServiceAccountInfo,
  tryAsLookupHistorySlots,
} from "@typeberry/state";
import { deepEqual, Result } from "@typeberry/utils";
import { Preimages, PreimagesErrorCode, type PreimagesInput } from "./preimages.js";

function createInput(preimages: { requester: ServiceId; blob: BytesBlob }[], slot: number): PreimagesInput {
  return {
    preimages: preimages as PreimagesExtrinsic,
    slot: tryAsTimeSlot(slot),
  };
}

function createAccount(
  id: ServiceId,
  preimagesEntries: PreimageItem[] = [],
  lookupHistoryEntries: LookupHistoryItem[] = [],
): InMemoryService {
  const preimages = HashDictionary.fromEntries(preimagesEntries.map((x) => [x.hash, x]));
  const lookupHistory = HashDictionary.fromEntries(lookupHistoryEntries.map((x) => [x.hash, [x]]));

  return InMemoryService.new(id, {
    info: ServiceAccountInfo.create({
      codeHash: Bytes.zero(HASH_SIZE).asOpaque(),
      balance: tryAsU64(0),
      accumulateMinGas: tryAsServiceGas(0),
      onTransferMinGas: tryAsServiceGas(0),
      storageUtilisationBytes: tryAsU64(0),
      storageUtilisationCount: tryAsU32(0),
      gratisStorage: tryAsU64(0),
      created: tryAsTimeSlot(0),
      lastAccumulation: tryAsTimeSlot(0),
      parentService: tryAsServiceId(0),
    }),
    storage: new Map(),
    preimages,
    lookupHistory,
  });
}

describe("Preimages", async () => {
  const blake2b = await Blake2b.createHasher();

  it("should reject preimages that are not sorted by requester", () => {
    const state = InMemoryState.partial(tinyChainSpec, {
      services: new Map([
        [tryAsServiceId(0), createAccount(tryAsServiceId(0))],
        [tryAsServiceId(1), createAccount(tryAsServiceId(1))],
      ]),
    });
    const preimages = new Preimages(state, blake2b);

    const blob1 = BytesBlob.parseBlob("0xd34db33f11223344556677889900aabbccddeeff0123456789abcdef01234567");
    const blob2 = BytesBlob.parseBlob("0xf00dc0de11223344556677889900aabbccddeeff0123456789abcdef01234567");
    const input = createInput(
      [
        { requester: tryAsServiceId(1), blob: blob1 },
        { requester: tryAsServiceId(0), blob: blob2 },
      ],
      tryAsTimeSlot(12),
    );

    const result = preimages.integrate(input);

    deepEqual(
      result,
      Result.error(PreimagesErrorCode.PreimagesNotSortedUnique, () => "Preimages not sorted/unique at index 1"),
    );
  });

  it("should reject preimages that are sorted by requester but not by blob", () => {
    const state = InMemoryState.partial(tinyChainSpec, {
      services: new Map([[tryAsServiceId(0), createAccount(tryAsServiceId(0))]]),
    });
    const preimages = new Preimages(state, blake2b);

    const blob1 = BytesBlob.parseBlob("0xf00dc0de11223344556677889900aabbccddeeff0123456789abcdef01234567");
    const blob2 = BytesBlob.parseBlob("0xd34db33f11223344556677889900aabbccddeeff0123456789abcdef01234567");
    const input = createInput(
      [
        { requester: tryAsServiceId(0), blob: blob1 },
        { requester: tryAsServiceId(0), blob: blob2 },
      ],
      tryAsTimeSlot(12),
    );

    const result = preimages.integrate(input);

    deepEqual(
      result,
      Result.error(PreimagesErrorCode.PreimagesNotSortedUnique, () => "Preimages not sorted/unique at index 1"),
    );
  });

  it("should reject duplicates", () => {
```
