---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/accumulate/new_service.ts#L1-L25
title: sdk/ecalli/accumulate/new_service.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 9958b3057381fa5a080361a51df871370147eedd6a3f045724b7c1b33157f131
language: typescript
---
`sdk/ecalli/accumulate/new_service.ts` (lines 1–25)

```typescript
/**
 * Ecalli 18: New service.
 *
 * Create a new service account.
 *
 * Registers:
 * - r7  (in)  = h — code hash memory address
 * - r7  (out)     — new service ID, CASH, HUH, or FULL
 * - r8  (in)  = z — code length
 * - r9  (in)  = g — minimum accumulate gas
 * - r10 (in)  = a — initial allowance
 * - r11 (in)  = s — gratis storage bytes
 * - r12 (in)  = i — requested service ID (or u32_max for auto-assign)
 *
 * @param code_hash_ptr - code hash memory address
 * @param code_len - code length
 * @param gas - minimum accumulate gas
 * @param allowance - initial allowance
 * @param gratis_storage - gratis storage bytes
 * @param requested_id - requested service ID (u32_max for auto)
 * @returns new service ID, CASH, HUH, or FULL
 */
// @ts-expect-error: decorator
@external("ecalli", "new_service")
export declare function new_service(code_hash_ptr: u32, code_len: u32, gas: u64, allowance: u64, gratis_storage: u32, requested_id: u32): i64;
```
