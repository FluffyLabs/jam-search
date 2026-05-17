---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/in-memory-state.ts#L599-L651
title: packages/jam/state/in-memory-state.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 6
chunk_total: 7
content_sha: 2b26088978a40c4de2b840eb3bb8ca5dadb62b2f8f83409a5dda66ebb0cf2a6c
language: typescript
---
`packages/jam/state/in-memory-state.ts` (lines 599–651)

```typescript
      privilegedServices: PrivilegedServices.create({
        manager: tryAsServiceId(0),
        assigners: tryAsPerCore(new Array(spec.coresCount).fill(tryAsServiceId(0)), spec),
        delegator: tryAsServiceId(0),
        registrar: tryAsServiceId(MAX_VALUE_U32),
        autoAccumulateServices: new Map(),
      }),
      accumulationOutputLog: SortedArray.fromArray(accumulationOutputComparator, []),
      services: new Map(),
    });
  }
}

/** Enumeration of all service-related data. */
export type ServiceEntries = {
  /** Service storage keys. */
  storageKeys: StorageKey[];
  /** Service preimages. */
  preimages: PreimageHash[];
  /** Service lookup history. */
  lookupHistory: { hash: PreimageHash; length: U32 }[];
};

export const serviceEntriesCodec = codec.object<ServiceEntries>({
  storageKeys: codec.sequenceVarLen(
    codec.blob.convert(
      (i) => i,
      (o) => asOpaqueType(o),
    ),
  ),
  preimages: codec.sequenceVarLen(codec.bytes(HASH_SIZE).asOpaque<PreimageHash>()),
  lookupHistory: codec.sequenceVarLen(
    codec.object({
      hash: codec.bytes(HASH_SIZE).asOpaque<PreimageHash>(),
      length: codec.u32,
    }),
  ),
});

/** Enumeration of all services and it's internall data. */
export type ServiceData = Map<ServiceId, ServiceEntries>;

export const serviceDataCodec = codec.dictionary(codec.u32.asOpaque<ServiceId>(), serviceEntriesCodec, {
  sortKeys: (a, b) => a - b,
});

/** All non-function properties of the `InMemoryState`. */
export type InMemoryStateFields = Pick<InMemoryState, FieldNames<InMemoryState>>;

type FieldNames<T> = {
  // biome-ignore lint/complexity/noBannedTypes: We want only non-function fields.
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
```
