---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/test/test-ecalli/storage.ts#L1-L22
title: sdk/test/test-ecalli/storage.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 3659a822d4a032c2b247bf866196854cf8996c15b0eb63150088792f63dc4434
language: typescript
---
`sdk/test/test-ecalli/storage.ts` (lines 1–22)

```typescript
import { BytesBlob } from "../../core/bytes";

// @ts-expect-error: decorator
@external("ecalli", "setStorageEntry")
declare function _setStorageEntry(keyPtr: u32, keyLen: u32, valPtr: u32, valLen: u32): void;

/** Configure the read()/write() stub storage. */
export class TestStorage {
  /** Set or delete a storage entry. Pass null to delete. */
  static set(key: BytesBlob, value: BytesBlob | null): void {
    if (value === null) {
      _setStorageEntry(u32(key.raw.dataStart), key.raw.byteLength, 0, u32.MAX_VALUE);
    } else {
      _setStorageEntry(
        u32(key.raw.dataStart),
        key.raw.byteLength,
        u32(value.raw.dataStart),
        value.raw.byteLength,
      );
    }
  }
}
```
