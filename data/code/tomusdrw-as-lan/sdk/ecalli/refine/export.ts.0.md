---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/refine/export.ts#L1-L17
title: sdk/ecalli/refine/export.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: ed479a9ce60e22c467835df0b95a450e691a43af25168f2ea0f677e8bc936ff9
language: typescript
---
`sdk/ecalli/refine/export.ts` (lines 1–17)

```typescript
/**
 * Ecalli 7: Export segment.
 *
 * Export a segment of data from the current work item.
 *
 * Registers:
 * - r7 (in)  = o — segment data memory address
 * - r7 (out)     — segment index on success, or FULL if limit reached
 * - r8 (in)  = z — segment data length
 *
 * @param segment_ptr - segment data memory address
 * @param segment_len - segment data length
 * @returns segment index on success, or FULL if limit reached
 */
// @ts-expect-error: decorator
@external("ecalli", "export")
export declare function export_segment(segment_ptr: u32, segment_len: u32): i64;
```
