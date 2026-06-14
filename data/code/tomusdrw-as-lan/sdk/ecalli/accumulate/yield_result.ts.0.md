---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/accumulate/yield_result.ts#L1-L15
title: sdk/ecalli/accumulate/yield_result.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: d72a6badcf05d2cfc26a49dfbcffd28034484d8f0eb13520eec7dc4b184ddd97
language: typescript
---
`sdk/ecalli/accumulate/yield_result.ts` (lines 1–15)

```typescript
/**
 * Ecalli 25: Yield result hash.
 *
 * Provide the accumulation result hash.
 *
 * Registers:
 * - r7 (in)  = h — result hash memory address (32 bytes)
 * - r7 (out)     — OK
 *
 * @param hash_ptr - result hash memory address (32 bytes)
 * @returns OK
 */
// @ts-expect-error: decorator
@external("ecalli", "yield_result")
export declare function yield_result(hash_ptr: u32): i64;
```
