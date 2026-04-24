---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/accumulate/query.ts#L1-L19
title: sdk/ecalli/accumulate/query.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 0
chunk_total: 1
content_sha: f7a17a09f3ea36ffe7ecca32b374d6e28cf4517f64a336d6c74d1f546ddf5840
language: typescript
---
`sdk/ecalli/accumulate/query.ts` (lines 1–19)

```typescript
/**
 * Ecalli 22: Query preimage status.
 *
 * Check whether a preimage is available and its status.
 *
 * Registers:
 * - r7 (in)  = h — hash memory address
 * - r7 (out)     — NONE, or preimage length
 * - r8 (in)  = z — preimage length
 * - r8 (out)     — slot info (written to out_r8 pointer)
 *
 * @param hash_ptr - hash memory address
 * @param length - preimage length
 * @param out_r8 - pointer where the r8 output value will be written (i64)
 * @returns NONE if not found, or preimage length
 */
// @ts-expect-error: decorator
@external("ecalli", "query")
export declare function query(hash_ptr: u32, length: u32, out_r8: u32): i64;
```
