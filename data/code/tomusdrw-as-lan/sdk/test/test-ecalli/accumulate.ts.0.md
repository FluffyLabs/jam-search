---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/test/test-ecalli/accumulate.ts#L1-L19
title: sdk/test/test-ecalli/accumulate.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e2234d60dd666da8589d5a6044f40e4f1600e7ff62adb5b1f407956f11837972
language: typescript
---
`sdk/test/test-ecalli/accumulate.ts` (lines 1–19)

```typescript
import { BytesBlob } from "../../core/bytes";

// @ts-expect-error: decorator
@external("ecalli", "setAccumulateItem")
declare function _setAccumulateItem(index: u32, ptr: u32, len: u32): void;

/**
 * Configure accumulate items (operands/transfers) for the fetch mock.
 *
 * Items set here are returned by `fetch(kind=15, index)` during accumulate.
 * Each item must be a pre-encoded TransferOrOperand blob (tag + data).
 * Use `OperandItem` / `TransferItem` builders to construct these blobs.
 */
export class TestAccumulate {
  /** Set a pre-encoded accumulate item at the given index. */
  static setItem(index: u32, encoded: BytesBlob): void {
    _setAccumulateItem(index, encoded.ptr(), encoded.length);
  }
}
```
