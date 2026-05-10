---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/test/test-ecalli/privileged.ts#L1-L108
title: sdk/test/test-ecalli/privileged.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 42cea4ad4986b113b2db195f29981b008f5d746c1ef235c1ff98fdada49d9a25
language: typescript
---
`sdk/test/test-ecalli/privileged.ts` (lines 1–108)

```typescript
// @ts-expect-error: decorator
@external("ecalli", "setBlessResult")
declare function _setBlessResult(result: i64): void;

// @ts-expect-error: decorator
@external("ecalli", "setAssignResult")
declare function _setAssignResult(result: i64): void;

// @ts-expect-error: decorator
@external("ecalli", "setDesignateResult")
declare function _setDesignateResult(result: i64): void;

// @ts-expect-error: decorator
@external("ecalli", "getLastBlessManager")
declare function _getLastBlessManager(): u32;

// @ts-expect-error: decorator
@external("ecalli", "getLastBlessAssignersPtr")
declare function _getLastBlessAssignersPtr(): u32;

// @ts-expect-error: decorator
@external("ecalli", "getLastBlessDelegator")
declare function _getLastBlessDelegator(): u32;

// @ts-expect-error: decorator
@external("ecalli", "getLastBlessRegistrar")
declare function _getLastBlessRegistrar(): u32;

// @ts-expect-error: decorator
@external("ecalli", "getLastBlessAutoAccumPtr")
declare function _getLastBlessAutoAccumPtr(): u32;

// @ts-expect-error: decorator
@external("ecalli", "getLastBlessAutoAccumCount")
declare function _getLastBlessAutoAccumCount(): u32;

// @ts-expect-error: decorator
@external("ecalli", "getLastAssignCore")
declare function _getLastAssignCore(): u32;

// @ts-expect-error: decorator
@external("ecalli", "getLastAssignAuthQueuePtr")
declare function _getLastAssignAuthQueuePtr(): u32;

// @ts-expect-error: decorator
@external("ecalli", "getLastAssignNewAssigner")
declare function _getLastAssignNewAssigner(): u32;

// @ts-expect-error: decorator
@external("ecalli", "getLastDesignateValidatorsPtr")
declare function _getLastDesignateValidatorsPtr(): u32;

/** Configure privileged governance mock stubs from AS test code. */
export class TestPrivileged {
  private constructor() {}

  static setBlessResult(result: i64): void {
    _setBlessResult(result);
  }

  static setAssignResult(result: i64): void {
    _setAssignResult(result);
  }

  static setDesignateResult(result: i64): void {
    _setDesignateResult(result);
  }

  static getLastBlessManager(): u32 {
    return _getLastBlessManager();
  }

  static getLastBlessAssignersPtr(): u32 {
    return _getLastBlessAssignersPtr();
  }

  static getLastBlessDelegator(): u32 {
    return _getLastBlessDelegator();
  }

  static getLastBlessRegistrar(): u32 {
    return _getLastBlessRegistrar();
  }

  static getLastBlessAutoAccumPtr(): u32 {
    return _getLastBlessAutoAccumPtr();
  }

  static getLastBlessAutoAccumCount(): u32 {
    return _getLastBlessAutoAccumCount();
  }

  static getLastAssignCore(): u32 {
    return _getLastAssignCore();
  }

  static getLastAssignAuthQueuePtr(): u32 {
    return _getLastAssignAuthQueuePtr();
  }

  static getLastAssignNewAssigner(): u32 {
    return _getLastAssignNewAssigner();
  }

  static getLastDesignateValidatorsPtr(): u32 {
    return _getLastDesignateValidatorsPtr();
  }
}
```
