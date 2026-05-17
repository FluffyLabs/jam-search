---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/state.ts#L212-L231
title: packages/jam/state/state.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 2
chunk_total: 3
content_sha: e31cab6116cff4de76d9df1f027f8286f28cff69fda9df990f23217ee1c2b753
language: typescript
---
`packages/jam/state/state.ts` (lines 212–231)

```typescript
/** Service details. */
export interface Service {
  /** Service id. */
  readonly serviceId: ServiceId;

  /** Retrieve service account info. */
  getInfo(): ServiceAccountInfo;

  /** Read one particular storage item. */
  getStorage(storage: StorageKey): BytesBlob | null;

  /** Check if preimage is present without retrieving the blob. */
  hasPreimage(hash: PreimageHash): boolean;

  /** Retrieve a preimage. */
  getPreimage(hash: PreimageHash): BytesBlob | null;

  /** Retrieve lookup history of a preimage. */
  getLookupHistory(hash: PreimageHash, len: U32): LookupHistorySlots | null;
}
```
