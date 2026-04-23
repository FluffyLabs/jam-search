---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/test/test-ecalli/info.ts#L1-L30
title: sdk/test/test-ecalli/info.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 46a9956ed9850040f9b57b5013501469c98592ac8a0f6571d2a2cce1e08c29e6
language: typescript
---
`sdk/test/test-ecalli/info.ts` (lines 1–30)

```typescript
// @ts-expect-error: decorator
@external("ecalli", "setInfoData")
declare function _setInfoData(service: u32, ptr: u32, len: u32): void;

// @ts-expect-error: decorator
@external("ecalli", "setDefaultInfoData")
declare function _setDefaultInfoData(ptr: u32, len: u32): void;

/** Configure the info() ecalli stub. */
export class TestInfo {
  /** Set the raw 96-byte info data returned for a specific service ID. */
  static set(service: u32, data: Uint8Array): void {
    _setInfoData(service, u32(data.dataStart), data.byteLength);
  }

  /** Configure info() to return NONE for a specific service ID. */
  static setNone(service: u32): void {
    _setInfoData(service, 0, 0);
  }

  /** Set the default info data returned when no service-specific data is configured. */
  static setDefault(data: Uint8Array): void {
    _setDefaultInfoData(u32(data.dataStart), data.byteLength);
  }

  /** Configure info() to return NONE by default (for unconfigured services). */
  static setDefaultNone(): void {
    _setDefaultInfoData(0, 0);
  }
}
```
