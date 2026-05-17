---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/accumulate/eject.ts#L1-L17
title: sdk/ecalli/accumulate/eject.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 0
chunk_total: 1
content_sha: f3b9db65501c2f903117ce073fe8df8aaa2af36f8af56d68baaef37acdda114b
language: typescript
---
`sdk/ecalli/accumulate/eject.ts` (lines 1–17)

```typescript
/**
 * Ecalli 21: Eject service.
 *
 * Remove a service from the system and recover its balance.
 *
 * Registers:
 * - r7 (in)  = s — service ID to eject
 * - r7 (out)     — OK, WHO, or HUH
 * - r8 (in)  = h — previous code hash memory address (for verification)
 *
 * @param service - service ID to eject
 * @param prev_code_hash_ptr - previous code hash memory address
 * @returns OK, WHO, or HUH
 */
// @ts-expect-error: decorator
@external("ecalli", "eject")
export declare function eject(service: u32, prev_code_hash_ptr: u32): i64;
```
