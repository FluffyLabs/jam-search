---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/general/lookup.ts#L1-L23
title: sdk/ecalli/general/lookup.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 1
content_sha: f3744b71384abd2fb6ecb0caa8d6f0d1a511a048496548bd1b0fbf4f0b6b45aa
language: typescript
---
`sdk/ecalli/general/lookup.ts` (lines 1–23)

```typescript
/**
 * Ecalli 2: Lookup preimage.
 *
 * Look up a preimage by its hash for the given (or current) service.
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
@external("ecalli", "lookup")
export declare function lookup(service: u32, hash_ptr: u32, out_ptr: u32, offset: u32, length: u32): i64;
```
