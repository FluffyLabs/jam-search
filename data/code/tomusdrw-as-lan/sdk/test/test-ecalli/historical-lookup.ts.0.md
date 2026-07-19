---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/test/test-ecalli/historical-lookup.ts#L1-L20
title: sdk/test/test-ecalli/historical-lookup.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 1d33b3ff8627c5a8da42537d8d7f48c5b2366aa8e35c7e6eab3836690814db9d
language: typescript
---
`sdk/test/test-ecalli/historical-lookup.ts` (lines 1–20)

```typescript
// @ts-expect-error: decorator
@external("ecalli", "setHistoricalPreimage")
declare function _setHistoricalPreimage(ptr: u32, len: u32): void;

// @ts-expect-error: decorator
@external("ecalli", "setHistoricalLookupNone")
declare function _setHistoricalLookupNone(): void;

/** Configure the historical_lookup() stub. */
export class TestHistoricalLookup {
  /** Set preimage data returned by historical_lookup(). */
  static setPreimage(data: Uint8Array): void {
    _setHistoricalPreimage(u32(data.dataStart), data.byteLength);
  }

  /** Make historical_lookup() return NONE. */
  static setNone(): void {
    _setHistoricalLookupNone();
  }
}
```
