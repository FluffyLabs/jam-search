---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/refine/poke.ts#L1-L21'
title: sdk/ecalli/refine/poke.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 09754b6b539ec8dd334783139e1d6bf4102b2e7b58a2c21a7cbccd0e6a679227
language: typescript
---
`sdk/ecalli/refine/poke.ts` (lines 1–21)

```typescript
/**
 * Ecalli 10: Poke inner machine memory.
 *
 * Write data into an inner PVM machine's memory.
 *
 * Registers:
 * - r7 (in)  = m — machine ID
 * - r7 (out)     — OK, WHO (unknown machine), or OOB (out of bounds)
 * - r8 (in)  = o — source memory address in host
 * - r9 (in)  = d — destination address in machine
 * - r10 (in) = z — number of bytes to write
 *
 * @param machine_id - inner machine ID
 * @param source_ptr - source memory address in host
 * @param dest - destination address in inner machine
 * @param length - number of bytes to write
 * @returns OK, WHO, or OOB
 */
// @ts-expect-error: decorator
@external("ecalli", "poke")
export declare function poke(machine_id: u32, source_ptr: u32, dest: u32, length: u32): i64;
```
