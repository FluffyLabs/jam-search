---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-json/accounts.ts#L1-L142
title: packages/jam/state-json/accounts.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 1030a83eb89e4273c6d28d8c0f84d2fb065ea854d4c0a8cdb4aa0880d51d292c
language: typescript
---
`packages/jam/state-json/accounts.ts` (lines 1–142)

```typescript
import {
  type CodeHash,
  type ServiceGas,
  type ServiceId,
  type TimeSlot,
  tryAsServiceGas,
  tryAsServiceId,
  tryAsTimeSlot,
} from "@typeberry/block";
import type { PreimageHash } from "@typeberry/block/preimage.js";
import { fromJson } from "@typeberry/block-json";
import { BytesBlob } from "@typeberry/bytes";
import { HashDictionary } from "@typeberry/collections";
import { json } from "@typeberry/json-parser";
import { tryAsU32, tryAsU64, type U32, type U64 } from "@typeberry/numbers";
import {
  InMemoryService,
  LookupHistoryItem,
  type LookupHistorySlots,
  PreimageItem,
  ServiceAccountInfo,
  StorageItem,
  type StorageKey,
} from "@typeberry/state";
import { asOpaqueType } from "@typeberry/utils";

class JsonServiceInfo {
  static fromJson = json.object<JsonServiceInfo, ServiceAccountInfo>(
    {
      version: "number",
      code_hash: fromJson.bytes32(),
      balance: json.fromNumber((x) => tryAsU64(x)),
      min_item_gas: json.fromNumber((x) => tryAsServiceGas(x)),
      min_memo_gas: json.fromNumber((x) => tryAsServiceGas(x)),
      bytes: json.fromNumber((x) => tryAsU64(x)),
      items: "number",
      creation_slot: json.fromNumber((x) => tryAsTimeSlot(x)),
      deposit_offset: json.fromNumber((x) => tryAsU64(x)),
      last_accumulation_slot: json.fromNumber((x) => tryAsTimeSlot(x)),
      parent_service: json.fromNumber((x) => tryAsServiceId(x)),
    },
    ({
      code_hash,
      balance,
      min_item_gas,
      min_memo_gas,
      bytes,
      items,
      deposit_offset,
      creation_slot,
      last_accumulation_slot,
      parent_service,
    }) => {
      return ServiceAccountInfo.create({
        codeHash: code_hash,
        balance,
        accumulateMinGas: min_item_gas,
        onTransferMinGas: min_memo_gas,
        storageUtilisationBytes: bytes,
        storageUtilisationCount: items,
        gratisStorage: deposit_offset,
        created: creation_slot,
        lastAccumulation: last_accumulation_slot,
        parentService: parent_service,
      });
    },
  );

  version!: number;
  code_hash!: CodeHash;
  balance!: U64;
  min_item_gas!: ServiceGas;
  min_memo_gas!: ServiceGas;
  bytes!: U64;
  items!: U32;
  creation_slot!: TimeSlot;
  deposit_offset!: U64;
  last_accumulation_slot!: TimeSlot;
  parent_service!: ServiceId;
}

class JsonPreimageItem {
  static fromJson = json.object<JsonPreimageItem, PreimageItem>(
    {
      hash: fromJson.bytes32(),
      blob: json.fromString(BytesBlob.parseBlob),
    },
    ({ hash, blob }) => PreimageItem.create({ hash, blob }),
  );

  hash!: PreimageHash;
  blob!: BytesBlob;
}

class JsonStorageItem {
  static fromJson = {
    key: json.fromString(BytesBlob.parseBlob),
    value: json.fromString(BytesBlob.parseBlob),
  };

  key!: BytesBlob;
  value!: BytesBlob;
}

type JsonPreimageStatus = {
  key: {
    hash: PreimageHash;
    length: number;
  };
  value: LookupHistorySlots;
};

const preimageStatusFromJson = json.object<JsonPreimageStatus, LookupHistoryItem>(
  {
    key: {
      hash: fromJson.bytes32(),
      length: "number",
    },
    value: json.array("number"),
  },
  ({ key, value }) => LookupHistoryItem.new(key.hash, tryAsU32(key.length), value),
);

export class JsonService {
  static fromJson = json.object<JsonService, InMemoryService>(
    {
      id: "number",
      data: {
        service: JsonServiceInfo.fromJson,
        storage: json.optional(json.array(JsonStorageItem.fromJson)),
        preimage_blobs: json.optional(json.array(JsonPreimageItem.fromJson)),
        preimage_requests: json.optional(json.array(preimageStatusFromJson)),
      },
    },
    ({ id, data }) => {
      const preimages = HashDictionary.fromEntries((data.preimage_blobs ?? []).map((x) => [x.hash, x]));

      const lookupHistory = HashDictionary.new<PreimageHash, LookupHistoryItem[]>();

      for (const item of data.preimage_requests ?? []) {
        const data = lookupHistory.get(item.hash) ?? [];
        data.push(item);
```
