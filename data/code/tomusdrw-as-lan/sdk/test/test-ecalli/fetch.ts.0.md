---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/test/test-ecalli/fetch.ts#L1-L20
title: sdk/test/test-ecalli/fetch.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 6853881d82259389cb4b8e88d8d7744fac32eaf6575be6556f3580b69bb69ecc
language: typescript
---
`sdk/test/test-ecalli/fetch.ts` (lines 1–20)

```typescript
// @ts-expect-error: decorator
@external("ecalli", "setFetchData")
declare function _setFetchData(ptr: u32, len: u32): void;

// @ts-expect-error: decorator
@external("ecalli", "setFetchDataForKind")
declare function _setFetchDataForKind(kind: u32, ptr: u32, len: u32): void;

/** Configure the fetch() stub to return fixed data. */
export class TestFetch {
  /** Set data returned for all fetch kinds (fallback). */
  static setData(data: Uint8Array): void {
    _setFetchData(u32(data.dataStart), data.byteLength);
  }

  /** Set data returned for a specific fetch kind. */
  static setDataForKind(kind: u32, data: Uint8Array): void {
    _setFetchDataForKind(kind, u32(data.dataStart), data.byteLength);
  }
}
```
