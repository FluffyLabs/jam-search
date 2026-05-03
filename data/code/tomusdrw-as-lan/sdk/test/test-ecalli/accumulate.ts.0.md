---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/test/test-ecalli/accumulate.ts#L1-L17
title: sdk/test/test-ecalli/accumulate.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 692c8a3ebebfc078745f26a1f526f4fe15ddd452f6fc090ec9de7a427c687407
language: typescript
---
`sdk/test/test-ecalli/accumulate.ts` (lines 1–17)

```typescript
// @ts-expect-error: decorator
@external("ecalli", "setAccumulateItem")
declare function _setAccumulateItem(index: u32, ptr: u32, len: u32): void;

/**
 * Configure accumulate items (operands/transfers) for the fetch mock.
 *
 * Items set here are returned by `fetch(kind=15, index)` during accumulate.
 * Each item must be a pre-encoded TransferOrOperand blob (tag + data).
 * Use the Encoder to build these blobs in test code.
 */
export class TestAccumulate {
  /** Set a pre-encoded accumulate item at the given index. */
  static setItem(index: u32, encoded: Uint8Array): void {
    _setAccumulateItem(index, u32(encoded.dataStart), encoded.byteLength);
  }
}
```
