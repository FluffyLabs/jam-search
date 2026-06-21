---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/refine/machine.ts#L1-L19
title: sdk/ecalli/refine/machine.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 680732deca793a096fdb7ae2cd5e866e0e677d6b9be107ba94a0623af0c2179c
language: typescript
---
`sdk/ecalli/refine/machine.ts` (lines 1–19)

```typescript
/**
 * Ecalli 8: Create inner PVM machine.
 *
 * Create a new inner PVM for nested execution.
 *
 * Registers:
 * - r7 (in)  = p — code memory address
 * - r7 (out)     — machine ID on success, or HUH on failure
 * - r8 (in)  = z — code length
 * - r9 (in)  = e — entrypoint offset
 *
 * @param code_ptr - code memory address
 * @param code_len - code length
 * @param entrypoint - entrypoint offset within code
 * @returns machine ID on success, or HUH on failure
 */
// @ts-expect-error: decorator
@external("ecalli", "machine")
export declare function machine(code_ptr: u32, code_len: u32, entrypoint: u32): i64;
```
