---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/test/test-ecalli/gas.ts#L1-L10
title: sdk/test/test-ecalli/gas.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 6fb993e53789f2356ecd6ee658ed9ce6cb80b5670473bd65d273b3d2e0c8966c
language: typescript
---
`sdk/test/test-ecalli/gas.ts` (lines 1–10)

```typescript
// @ts-expect-error: decorator
@external("ecalli", "setGasValue")
declare function _setGasValue(value: i64): void;

/** Configure the gas() stub return value. */
export class TestGas {
  static set(value: i64): void {
    _setGasValue(value);
  }
}
```
