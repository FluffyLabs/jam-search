---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/test.utils.ts#L316-L353
title: packages/jam/transition/reports/test.utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 3
chunk_total: 4
content_sha: cc2ea0942570722261e938df3f5447ef9b68712f604e5cc73fc80fad34afe115
language: typescript
---
`packages/jam/transition/reports/test.utils.ts` (lines 316–353)

```typescript
      ed25519: "0x5c7f34a4bd4f2d04076a8c6f9060a0c8d2c6bdd082ceb3eda7df381cb260faff",
    },
    {
      bandersnatch: "0xf16e5352840afb47e206b5c89f560f2611835855cf2e6ebad1acc9520a72591d",
      ed25519: "0x837ce344bc9defceb0d7de7e9e9925096768b7adb4dad932e532eb6551e0ea02",
    },
  ].map(intoValidatorData);

export const initialServices = ({ withDummyCodeHash = false } = {}): Map<ServiceId, InMemoryService> => {
  const m = new Map();
  const id = tryAsServiceId(129);
  m.set(
    id,
    InMemoryService.new(tryAsServiceId(129), {
      preimages: HashDictionary.new(),
      storage: new Map(),
      lookupHistory: HashDictionary.new(),
      info: ServiceAccountInfo.create({
        codeHash: withDummyCodeHash
          ? Bytes.fill(HASH_SIZE, 1).asOpaque()
          : Bytes.parseBytes(
              "0x8178abf4f459e8ed591be1f7f629168213a5ac2a487c28c0ef1a806198096c7a",
              HASH_SIZE,
            ).asOpaque(),
        balance: tryAsU64(0),
        accumulateMinGas: tryAsServiceGas(10_000),
        onTransferMinGas: tryAsServiceGas(0),
        storageUtilisationBytes: tryAsU64(1),
        storageUtilisationCount: tryAsU32(1),
        gratisStorage: tryAsU64(0),
        created: tryAsTimeSlot(0),
        lastAccumulation: tryAsTimeSlot(0),
        parentService: tryAsServiceId(0),
      }),
    }),
  );
  return m;
};
```
