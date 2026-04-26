---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk-ecalli-mocks/src/refine/segments.ts#L1-L21
title: sdk-ecalli-mocks/src/refine/segments.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 781fa44c66be04e5b6b2c1c2bbff584aec7f6c6bad1da8eb2cfe33f42759f1a4
language: typescript
---
`sdk-ecalli-mocks/src/refine/segments.ts` (lines 1–21)

```typescript
// Ecalli 7: export — segment export counter.

let exportCounter = 0;
let overrideResult: bigint | null = null;

export function export_segment(
  _segment_ptr: number,
  _segment_len: number,
): bigint {
  if (overrideResult !== null) return overrideResult;
  return BigInt(exportCounter++);
}

export function setExportSegmentResult(value: bigint): void {
  overrideResult = value;
}

export function resetSegments(): void {
  exportCounter = 0;
  overrideResult = null;
}
```
