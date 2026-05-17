---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/test/test-ecalli/preimages.ts#L1-L75
title: sdk/test/test-ecalli/preimages.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 1b01a79df06681765cd3591a98e4ff4fe6fc9d232341adbe68b39c97b47c1ef4
language: typescript
---
`sdk/test/test-ecalli/preimages.ts` (lines 1–75)

```typescript
// @ts-expect-error: decorator
@external("ecalli", "setQueryResult")
declare function _setQueryResult(r7: i64, r8: i64): void;

// @ts-expect-error: decorator
@external("ecalli", "setSolicitResult")
declare function _setSolicitResult(result: i64): void;

// @ts-expect-error: decorator
@external("ecalli", "setForgetResult")
declare function _setForgetResult(result: i64): void;

// @ts-expect-error: decorator
@external("ecalli", "setProvideResult")
declare function _setProvideResult(result: i64): void;

// @ts-expect-error: decorator
@external("ecalli", "getSolicitCount")
declare function _getSolicitCount(): i64;

// @ts-expect-error: decorator
@external("ecalli", "getForgetCount")
declare function _getForgetCount(): i64;

// @ts-expect-error: decorator
@external("ecalli", "getProvideCount")
declare function _getProvideCount(): i64;

// @ts-expect-error: decorator
@external("ecalli", "resetPreimageCounters")
declare function _resetPreimageCounters(): void;

/** Configure accumulate preimage ecalli stubs (query, solicit, forget, provide). */
export class TestPreimages {
  /**
   * Configure query() return values.
   *
   * Encoding: r7 = (slot0 << 32) | kind, r8 = (slot2 << 32) | slot1.
   * Set r7 = -1 (NONE) for "not solicited".
   */
  static setQueryResult(r7: i64, r8: i64 = 0): void {
    _setQueryResult(r7, r8);
  }

  /** Configure solicit() return value (0 = OK, -9 = HUH, -5 = FULL). */
  static setSolicitResult(result: i64): void {
    _setSolicitResult(result);
  }

  /** Configure forget() return value (0 = OK, -9 = HUH). */
  static setForgetResult(result: i64): void {
    _setForgetResult(result);
  }

  /** Configure provide() return value (0 = OK, -4 = WHO, -9 = HUH). */
  static setProvideResult(result: i64): void {
    _setProvideResult(result);
  }

  static getSolicitCount(): i64 {
    return _getSolicitCount();
  }

  static getForgetCount(): i64 {
    return _getForgetCount();
  }

  static getProvideCount(): i64 {
    return _getProvideCount();
  }

  static resetCounters(): void {
    _resetPreimageCounters();
  }
}
```
