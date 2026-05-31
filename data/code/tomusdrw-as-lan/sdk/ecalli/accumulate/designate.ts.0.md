---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/accumulate/designate.ts#L1-L15
title: sdk/ecalli/accumulate/designate.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 50d691dc301d0f077ccc0610e867cccca5f3948a350bd5c450fbd477a8fb40c7
language: typescript
---
`sdk/ecalli/accumulate/designate.ts` (lines 1–15)

```typescript
/**
 * Ecalli 16: Designate validators.
 *
 * Set the next epoch's validator keys.
 *
 * Registers:
 * - r7 (in)  = v — validators data memory address
 * - r7 (out)     — OK or HUH
 *
 * @param validators_ptr - validators data memory address
 * @returns OK or HUH
 */
// @ts-expect-error: decorator
@external("ecalli", "designate")
export declare function designate(validators_ptr: u32): i64;
```
