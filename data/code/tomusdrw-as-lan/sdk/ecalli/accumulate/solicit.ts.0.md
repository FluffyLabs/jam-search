---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/accumulate/solicit.ts#L1-L17
title: sdk/ecalli/accumulate/solicit.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 0
chunk_total: 1
content_sha: ce13d2aed206bfae9afa2a9360bd1b2afcbc9a1de1b3770b91f61c1beaeda3b1
language: typescript
---
`sdk/ecalli/accumulate/solicit.ts` (lines 1–17)

```typescript
/**
 * Ecalli 23: Solicit preimage.
 *
 * Request that a preimage be made available.
 *
 * Registers:
 * - r7 (in)  = h — hash memory address
 * - r7 (out)     — OK, HUH, or FULL
 * - r8 (in)  = z — preimage length
 *
 * @param hash_ptr - hash memory address
 * @param length - preimage length
 * @returns OK, HUH, or FULL
 */
// @ts-expect-error: decorator
@external("ecalli", "solicit")
export declare function solicit(hash_ptr: u32, length: u32): i64;
```
