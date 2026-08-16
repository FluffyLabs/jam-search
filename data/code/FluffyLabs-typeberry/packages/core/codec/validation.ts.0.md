---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/validation.ts#L1-L16
title: packages/core/codec/validation.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 6fe7957a4ec928b132858356e9dc8e987e5458fdd356dc44a34580137e4ec819
language: typescript
---
`packages/core/codec/validation.ts` (lines 1–16)

```typescript
export type LengthRange = {
  /** Inclusive value of minimal length of the sequence. */
  minLength: number;
  /** Inclusive value of maximal length of the sequence. */
  maxLength: number;
};

/** Validate that given sequence length is within expected range. */
export function validateLength(range: LengthRange, length: number, context: string) {
  if (length < range.minLength) {
    throw new Error(`${context}: length is below minimal. ${length} < ${range.minLength}`);
  }
  if (length > range.maxLength) {
    throw new Error(`${context}: length is above maximal. ${length} > ${range.maxLength}`);
  }
}
```
