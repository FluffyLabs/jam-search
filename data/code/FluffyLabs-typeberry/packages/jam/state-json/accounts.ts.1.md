---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-json/accounts.ts#L138-L242
title: packages/jam/state-json/accounts.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: edd9acf4707001c86b15018c564c9c210048b6ebb2d7b3a067ab2f051bb25404
language: typescript
---
`packages/jam/state-json/accounts.ts` (lines 138–242)

```typescript
      const lookupHistory = HashDictionary.new<PreimageHash, LookupHistoryItem[]>();

      for (const item of data.preimage_requests ?? []) {
        const data = lookupHistory.get(item.hash) ?? [];
        data.push(item);
        lookupHistory.set(item.hash, data);
      }

      const storage = new Map<string, StorageItem>();

      const entries = (data.storage ?? []).map(({ key, value }) => {
        const opaqueKey: StorageKey = asOpaqueType(key);
        return [opaqueKey, StorageItem.create({ key: opaqueKey, value })] as const;
      });

      for (const [key, item] of entries) {
        storage.set(key.toString(), item);
      }

      return InMemoryService.new(id, {
        info: data.service,
        preimages,
        storage,
        lookupHistory,
      });
    },
  );

  id!: ServiceId;
  data!: {
    service: ServiceAccountInfo;
    storage?: JsonStorageItem[];
    preimage_blobs?: JsonPreimageItem[];
    preimage_requests?: LookupHistoryItem[];
  };
}

const preimageStatusFromJson072 = json.object<JsonPreimageStatusPre072, LookupHistoryItem>(
  {
    hash: fromJson.bytes32(),
    status: json.array("number"),
  },
  ({ hash, status }) => LookupHistoryItem.new(hash, tryAsU32(0), status),
);

type JsonPreimageStatusPre072 = {
  hash: PreimageHash;
  status: LookupHistorySlots;
};

export class JsonServicePre072 {
  static fromJson = json.object<JsonServicePre072, InMemoryService>(
    {
      id: "number",
      data: {
        service: JsonServiceInfo.fromJson,
        storage: json.optional(json.array(JsonStorageItem.fromJson)),
        preimages_blob: json.optional(json.array(JsonPreimageItem.fromJson)),
        preimages_status: json.optional(json.array(preimageStatusFromJson072)),
      },
    },
    ({ id, data }) => {
      const preimages = HashDictionary.fromEntries(
        (data.preimages ?? data.preimages_blob ?? []).map((x) => [x.hash, x]),
      );

      const lookupHistory = HashDictionary.new<PreimageHash, LookupHistoryItem[]>();

      for (const item of data.lookup_meta ?? data.preimages_status ?? []) {
        const data = lookupHistory.get(item.hash) ?? [];
        const length = tryAsU32(preimages.get(item.hash)?.blob.length ?? item.length);
        data.push(LookupHistoryItem.new(item.hash, length, item.slots));
        lookupHistory.set(item.hash, data);
      }

      const storage = new Map<string, StorageItem>();

      const entries = (data.storage ?? []).map(({ key, value }) => {
        const opaqueKey: StorageKey = asOpaqueType(key);
        return [opaqueKey, StorageItem.create({ key: opaqueKey, value })] as const;
      });

      for (const [key, item] of entries) {
        storage.set(key.toString(), item);
      }

      return InMemoryService.new(id, {
        info: data.service,
        preimages,
        storage,
        lookupHistory,
      });
    },
  );

  id!: ServiceId;
  data!: {
    service: ServiceAccountInfo;
    preimages?: JsonPreimageItem[];
    storage?: JsonStorageItem[];
    lookup_meta?: LookupHistoryItem[];
    preimages_blob?: JsonPreimageItem[];
    preimages_status?: LookupHistoryItem[];
  };
}
```
