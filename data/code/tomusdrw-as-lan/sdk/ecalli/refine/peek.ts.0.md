---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/refine/peek.ts#L1-L21'
title: sdk/ecalli/refine/peek.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: f87d3f59db9742276c7e8c3c392717bd586c905d6e77504e052f551809a21009
language: typescript
---
`sdk/ecalli/refine/peek.ts` (lines 1–21)

```typescript
/**
 * Ecalli 9: Peek inner machine memory.
 *
 * Read data from an inner PVM machine's memory.
 *
 * Registers:
 * - r7 (in)  = m — machine ID
 * - r7 (out)     — OK, WHO (unknown machine), or OOB (out of bounds)
 * - r8 (in)  = o — destination memory address in host
 * - r9 (in)  = s — source address in machine
 * - r10 (in) = z — number of bytes to read
 *
 * @param machine_id - inner machine ID
 * @param dest_ptr - destination memory address in host
 * @param source - source address in inner machine
 * @param length - number of bytes to read
 * @returns OK, WHO, or OOB
 */
// @ts-expect-error: decorator
@external("ecalli", "peek")
export declare function peek(machine_id: u32, dest_ptr: u32, source: u32, length: u32): i64;
```
