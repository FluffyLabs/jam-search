---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/test/test-ecalli/export-segment.ts#L1-L11
title: sdk/test/test-ecalli/export-segment.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: a7aec0719c9423c028c642db23a1fce84fff59a31cac847d2ed089d1cdd391b0
language: typescript
---
`sdk/test/test-ecalli/export-segment.ts` (lines 1–11)

```typescript
// @ts-expect-error: decorator
@external("ecalli", "setExportSegmentResult")
declare function _setExportSegmentResult(result: i64): void;

/** Configure the export_segment() stub return value. */
export class TestExportSegment {
  /** Override export_segment() to return a specific value (e.g. EcalliResult.FULL). */
  static setResult(result: i64): void {
    _setExportSegmentResult(result);
  }
}
```
