---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/serialized-state.ts#L217-L258
title: packages/jam/state-merkleization/serialized-state.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 7bafe4471f24437970623f9875e7dc7e0ae13283957c53f3e04df9358d83ced4
language: typescript
---
`packages/jam/state-merkleization/serialized-state.ts` (lines 217–258)

```typescript
    private readonly retrieveOptional: <T>(key: KeyAndCodec<T>) => T | undefined,
  ) {}

  /** Service account info. */
  getInfo(): ServiceAccountInfo {
    return this.accountInfo;
  }

  /** Retrieve a storage item. */
  getStorage(rawKey: StorageKey): BytesBlob | null {
    return this.retrieveOptional(serialize.serviceStorage(this.blake2b, this.serviceId, rawKey)) ?? null;
  }

  /**
   * Check if preimage is present in the DB.
   *
   * NOTE: it DOES NOT mean that the preimage is available.
   */
  hasPreimage(hash: PreimageHash): boolean {
    // TODO [ToDr] consider optimizing to avoid fetching the whole data.
    return this.retrieveOptional(serialize.servicePreimages(this.blake2b, this.serviceId, hash)) !== undefined;
  }

  /** Retrieve preimage from the DB. */
  getPreimage(hash: PreimageHash): BytesBlob | null {
    return this.retrieveOptional(serialize.servicePreimages(this.blake2b, this.serviceId, hash)) ?? null;
  }

  /** Retrieve preimage lookup history. */
  getLookupHistory(hash: PreimageHash, len: U32): LookupHistorySlots | null {
    const rawSlots = this.retrieveOptional(serialize.serviceLookupHistory(this.blake2b, this.serviceId, hash, len));
    if (rawSlots === undefined) {
      return null;
    }
    return tryAsLookupHistorySlots(rawSlots.map(tryAsTimeSlot));
  }
}

type KeyAndCodec<T> = {
  key: StateKey;
  Codec: Decode<T>;
};
```
