---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/refine/historical_lookup.ts#L1-L24
title: sdk/ecalli/refine/historical_lookup.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 93d5f3afb399b1affda6398f15ac23469b9b91a833778efae978f20843136dd3
language: typescript
---
`sdk/ecalli/refine/historical_lookup.ts` (lines 1–24)

```typescript
/**
 * Ecalli 6: Historical lookup preimage.
 *
 * Look up a preimage by its hash for a given service in a historical context.
 * Same signature as `lookup` but uses the historical state.
 *
 * Registers:
 * - r7  (in)  = a — service ID (u32_max = current service)
 * - r7  (out)     — total preimage length, or NONE if not found
 * - r8  (in)  = h — memory address of 32-byte hash
 * - r9  (in)  = o — destination memory address
 * - r10 (in)  = f — offset within preimage
 * - r11 (in)  = l — max length to write
 *
 * @param service - service ID (u32_max for current service)
 * @param hash_ptr - pointer to 32-byte blake2b hash
 * @param out_ptr - destination memory address
 * @param offset - offset within preimage blob
 * @param length - max bytes to write
 * @returns total preimage length, or NONE if not found
 */
// @ts-expect-error: decorator
@external("ecalli", "historical_lookup")
export declare function historical_lookup(service: u32, hash_ptr: u32, out_ptr: u32, offset: u32, length: u32): i64;
```
