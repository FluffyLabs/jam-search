---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/accumulate/checkpoint.ts#L1-L14
title: sdk/ecalli/accumulate/checkpoint.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2aaa6d513d34bee21f6c773bfc979ca14a08ad03a60c647e405ac8a5d2cd8e33
language: typescript
---
`sdk/ecalli/accumulate/checkpoint.ts` (lines 1–14)

```typescript
/**
 * Ecalli 17: Checkpoint.
 *
 * Create a state checkpoint, committing all changes up to this point.
 * Returns remaining gas after the checkpoint (same semantics as gas).
 *
 * Registers:
 * - r7 (out) = remaining gas
 *
 * @returns remaining gas as i64
 */
// @ts-expect-error: decorator
@external("ecalli", "checkpoint")
export declare function checkpoint(): i64;
```
