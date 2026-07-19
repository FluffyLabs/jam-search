---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/test/test-ecalli/services.ts#L1-L47
title: sdk/test/test-ecalli/services.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 1
content_sha: bc76ac6d5522f00a736c685591271220ccec870b2dd17acc610bb879c8c98c64
language: typescript
---
`sdk/test/test-ecalli/services.ts` (lines 1–47)

```typescript
// @ts-expect-error: decorator
@external("ecalli", "setNewServiceResult")
declare function _setNewServiceResult(result: i64): void;

// @ts-expect-error: decorator
@external("ecalli", "setEjectResult")
declare function _setEjectResult(result: i64): void;

// @ts-expect-error: decorator
@external("ecalli", "getLastUpgradeCodeHashPtr")
declare function _getLastUpgradeCodeHashPtr(): u32;

// @ts-expect-error: decorator
@external("ecalli", "getLastUpgradeGas")
declare function _getLastUpgradeGas(): i64;

// @ts-expect-error: decorator
@external("ecalli", "getLastUpgradeAllowance")
declare function _getLastUpgradeAllowance(): i64;

/** Configure service lifecycle mock stubs from AS test code. */
export class TestServices {
  private constructor() {}

  static setNewServiceResult(result: i64): void {
    _setNewServiceResult(result);
  }

  static setEjectResult(result: i64): void {
    _setEjectResult(result);
  }

  /** Get the code hash pointer passed to the last upgrade() call. */
  static getLastUpgradeCodeHashPtr(): u32 {
    return _getLastUpgradeCodeHashPtr();
  }

  /** Get the gas passed to the last upgrade() call. */
  static getLastUpgradeGas(): i64 {
    return _getLastUpgradeGas();
  }

  /** Get the allowance passed to the last upgrade() call. */
  static getLastUpgradeAllowance(): i64 {
    return _getLastUpgradeAllowance();
  }
}
```
