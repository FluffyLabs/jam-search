---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/accumulate/assign.ts#L1-L21
title: sdk/ecalli/accumulate/assign.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 0
chunk_total: 1
content_sha: a804501ec04a8772e4db573f0cf7e4690c4b634768a9bee5d15033f8821bfce9
language: typescript
---
`sdk/ecalli/accumulate/assign.ts` (lines 1–21)

```typescript
/**
 * Ecalli 15: Assign core.
 *
 * Assign an auth queue for a specific core. Only callable by that core's
 * assigner service (set via bless). The new_assigner parameter allows
 * transferring the assigner permission to another service.
 *
 * Registers:
 * - r7 (in)  = c — core index
 * - r7 (out)     — OK, CORE, HUH, or WHO
 * - r8 (in)  = a — auth queue memory address
 * - r9 (in)  = s — new assigner service ID
 *
 * @param core - core index
 * @param auth_queue_ptr - auth queue memory address
 * @param new_assigner - new assigner service ID (for permission transfer)
 * @returns OK, CORE, HUH, or WHO
 */
// @ts-expect-error: decorator
@external("ecalli", "assign")
export declare function assign(core: u32, auth_queue_ptr: u32, new_assigner: u32): i64;
```
