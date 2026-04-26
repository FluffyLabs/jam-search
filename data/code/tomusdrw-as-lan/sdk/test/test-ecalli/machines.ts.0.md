---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/test/test-ecalli/machines.ts#L1-L128
title: sdk/test/test-ecalli/machines.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 1
content_sha: f7af6615c94c5ab203ab7c760e8811b73f6bf8e61e24a68c83e517d6d46bb922
language: typescript
---
`sdk/test/test-ecalli/machines.ts` (lines 1–128)

```typescript
import { BytesBlob } from "../../core/bytes";

// @ts-expect-error: decorator
@external("ecalli", "setMachineResult")
declare function _setMachineResult(result: i64): void;

// @ts-expect-error: decorator
@external("ecalli", "setPeekResult")
declare function _setPeekResult(result: i64): void;

// @ts-expect-error: decorator
@external("ecalli", "setPeekData")
declare function _setPeekData(ptr: u32, len: u32): void;

// @ts-expect-error: decorator
@external("ecalli", "setPokeResult")
declare function _setPokeResult(result: i64): void;

// @ts-expect-error: decorator
@external("ecalli", "setPagesResult")
declare function _setPagesResult(result: i64): void;

// @ts-expect-error: decorator
@external("ecalli", "setInvokeResult")
declare function _setInvokeResult(result: i64, r8: i64): void;

// @ts-expect-error: decorator
@external("ecalli", "setInvokeIoR7")
declare function _setInvokeIoR7(value: i64): void;

// @ts-expect-error: decorator
@external("ecalli", "setExpungeResult")
declare function _setExpungeResult(result: i64): void;

// @ts-expect-error: decorator
@external("ecalli", "getPagesLogLength")
declare function _getPagesLogLength(): i64;

// @ts-expect-error: decorator
@external("ecalli", "getPagesLogField")
declare function _getPagesLogField(index: u32, field: u32): i64;

// @ts-expect-error: decorator
@external("ecalli", "getPokeLogLength")
declare function _getPokeLogLength(): i64;

// @ts-expect-error: decorator
@external("ecalli", "getPokeLogField")
declare function _getPokeLogField(index: u32, field: u32): i64;

// @ts-expect-error: decorator
@external("ecalli", "getPokeLogData")
declare function _getPokeLogData(index: u32, dest_ptr: u32): i64;

/** Configure machine ecalli stub return values from AS tests. */
export class TestMachine {
  static setMachineResult(result: i64): void {
    _setMachineResult(result);
  }

  static setPeekResult(result: i64): void {
    _setPeekResult(result);
  }

  static setPeekData(data: Uint8Array): void {
    _setPeekData(u32(data.dataStart), data.length);
  }

  static setPokeResult(result: i64): void {
    _setPokeResult(result);
  }

  static setPagesResult(result: i64): void {
    _setPagesResult(result);
  }

  static setInvokeResult(result: i64, r8: i64 = 0): void {
    _setInvokeResult(result, r8);
  }

  static setInvokeIoR7(value: i64): void {
    _setInvokeIoR7(value);
  }

  static setExpungeResult(result: i64): void {
    _setExpungeResult(result);
  }

  static pagesLogLength(): u32 {
    return nonNegativeToU32(_getPagesLogLength(), "pagesLogLength");
  }

  /** Field: 0=machineId, 1=startPage, 2=pageCount, 3=accessType. */
  static pagesLogField(index: u32, field: u32): u32 {
    return nonNegativeToU32(_getPagesLogField(index, field), "pagesLogField");
  }

  static pokeLogLength(): u32 {
    return nonNegativeToU32(_getPokeLogLength(), "pokeLogLength");
  }

  /** Field: 0=machineId, 1=dest, 2=dataLength. */
  static pokeLogField(index: u32, field: u32): u32 {
    return nonNegativeToU32(_getPokeLogField(index, field), "pokeLogField");
  }

  /** Copy the i-th poke()'s data into the caller-owned buffer.
   *  The buffer must be sized to fit `pokeLogField(index, 2)` bytes;
   *  the call aborts the test if it isn't, rather than writing past
   *  the AS-side allocation.
   */
  static pokeLogData(index: u32, buffer: BytesBlob): u32 {
    const required = TestMachine.pokeLogField(index, 2);
    assert(u32(buffer.length) >= required, "TestMachine.pokeLogData: buffer too small");
    const written = _getPokeLogData(index, buffer.ptr());
    return u32(written);
  }
}

/**
 * The JS mocks return `-1` (i64) when an index is out of range. A raw
 * `u32(-1)` cast would silently wrap to `0xFFFFFFFF` and feed garbage to
 * test assertions. Assert non-negative here so a buggy index fails loud.
 */
function nonNegativeToU32(raw: i64, label: string): u32 {
  assert(raw >= 0, `TestMachine.${label}: out-of-range index`);
  return u32(raw);
}
```
