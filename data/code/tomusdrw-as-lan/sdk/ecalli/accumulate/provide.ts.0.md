---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/accumulate/provide.ts#L1-L19
title: sdk/ecalli/accumulate/provide.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 955a75d4fde2de4c53ca8893602be8dde14451c9c8b6973b5208625603deca34
language: typescript
---
`sdk/ecalli/accumulate/provide.ts` (lines 1–19)

```typescript
/**
 * Ecalli 26: Provide preimage.
 *
 * Supply a preimage for a previously solicited hash.
 *
 * Registers:
 * - r7 (in)  = s — service ID
 * - r7 (out)     — OK, WHO, or HUH
 * - r8 (in)  = o — preimage memory address
 * - r9 (in)  = z — preimage length
 *
 * @param service - service ID
 * @param preimage_ptr - preimage memory address
 * @param preimage_len - preimage length
 * @returns OK, WHO, or HUH
 */
// @ts-expect-error: decorator
@external("ecalli", "provide")
export declare function provide(service: u32, preimage_ptr: u32, preimage_len: u32): i64;
```
