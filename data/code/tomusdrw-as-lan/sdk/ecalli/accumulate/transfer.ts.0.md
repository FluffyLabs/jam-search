---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/accumulate/transfer.ts#L1-L21
title: sdk/ecalli/accumulate/transfer.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 659f7bed4e4c6043cb53b9c7875032793efc629f53d2c7d27f72dfe42f5daaba
language: typescript
---
`sdk/ecalli/accumulate/transfer.ts` (lines 1–21)

```typescript
/**
 * Ecalli 20: Transfer funds.
 *
 * Transfer balance to another service and optionally attach a memo.
 *
 * Registers:
 * - r7 (in)  = d — destination service ID
 * - r7 (out)     — OK, WHO, LOW, or CASH
 * - r8 (in)  = a — amount
 * - r9 (in)  = g — gas fee limit
 * - r10 (in) = m — memo memory address (128 bytes)
 *
 * @param dest - destination service ID
 * @param amount - transfer amount
 * @param gas_fee - gas fee limit
 * @param memo_ptr - memo memory address (128 bytes)
 * @returns OK, WHO, LOW, or CASH
 */
// @ts-expect-error: decorator
@external("ecalli", "transfer")
export declare function transfer(dest: u32, amount: u64, gas_fee: u64, memo_ptr: u32): i64;
```
