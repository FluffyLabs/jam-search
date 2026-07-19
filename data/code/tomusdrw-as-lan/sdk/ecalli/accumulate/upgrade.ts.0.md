---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/accumulate/upgrade.ts#L1-L19
title: sdk/ecalli/accumulate/upgrade.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 36d4a5b53ef201139b3096877c89cf0152dad32675476c064e63d33ce20d4ce5
language: typescript
---
`sdk/ecalli/accumulate/upgrade.ts` (lines 1–19)

```typescript
/**
 * Ecalli 19: Upgrade service code.
 *
 * Upgrade the current service's code.
 *
 * Registers:
 * - r7 (in)  = h — new code hash memory address
 * - r7 (out)     — OK
 * - r8 (in)  = g — new minimum accumulate gas
 * - r9 (in)  = a — new allowance
 *
 * @param code_hash_ptr - new code hash memory address
 * @param gas - new minimum accumulate gas
 * @param allowance - new allowance
 * @returns OK
 */
// @ts-expect-error: decorator
@external("ecalli", "upgrade")
export declare function upgrade(code_hash_ptr: u32, gas: u64, allowance: u64): i64;
```
