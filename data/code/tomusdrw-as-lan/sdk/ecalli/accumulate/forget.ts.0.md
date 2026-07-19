---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/accumulate/forget.ts#L1-L17
title: sdk/ecalli/accumulate/forget.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 293ed2b5e9d19628132c7fc53a315e923d1c9ddb9898787792237695b7bfb405
language: typescript
---
`sdk/ecalli/accumulate/forget.ts` (lines 1–17)

```typescript
/**
 * Ecalli 24: Forget preimage.
 *
 * Cancel a previous preimage solicitation.
 *
 * Registers:
 * - r7 (in)  = h — hash memory address
 * - r7 (out)     — OK or HUH
 * - r8 (in)  = z — preimage length
 *
 * @param hash_ptr - hash memory address
 * @param length - preimage length
 * @returns OK or HUH
 */
// @ts-expect-error: decorator
@external("ecalli", "forget")
export declare function forget(hash_ptr: u32, length: u32): i64;
```
