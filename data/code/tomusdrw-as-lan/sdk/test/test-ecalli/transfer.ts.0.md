---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/test/test-ecalli/transfer.ts#L1-L12
title: sdk/test/test-ecalli/transfer.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 796897e8a0a63cce093b3a0aac44694d72cf86464bef1f1a48cc2e99b36e4ace
language: typescript
---
`sdk/test/test-ecalli/transfer.ts` (lines 1–12)

```typescript
// @ts-expect-error: decorator
@external("ecalli", "setTransferResult")
declare function _setTransferResult(result: i64): void;

/** Configure transfer mock stub from AS test code. */
export class TestTransfer {
  private constructor() {}

  static setTransferResult(result: i64): void {
    _setTransferResult(result);
  }
}
```
