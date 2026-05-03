---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/ecalli/refine/invoke.ts#L1-L21
title: sdk/ecalli/refine/invoke.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 8a6ee8ffce0a27b32ced81961565edfe209190d5fa60b19399a9f85ab4932937
language: typescript
---
`sdk/ecalli/refine/invoke.ts` (lines 1–21)

```typescript
/**
 * Ecalli 12: Invoke inner machine.
 *
 * Run an inner PVM machine. The io_ptr points to a structure
 * containing gas limit and registers that is read before and
 * written after execution.
 *
 * Registers:
 * - r7 (in)  = m — machine ID
 * - r7 (out)     — exit reason (HALT, PANIC, FAULT, HOST, OOB) or WHO
 * - r8 (in)  = o — I/O structure memory address
 * - r8 (out)     — secondary result (written to out_r8 pointer)
 *
 * @param machine_id - inner machine ID
 * @param io_ptr - pointer to gas+registers I/O structure
 * @param out_r8 - pointer where the r8 output value will be written (i64)
 * @returns exit reason or WHO
 */
// @ts-expect-error: decorator
@external("ecalli", "invoke")
export declare function invoke(machine_id: u32, io_ptr: u32, out_r8: u32): i64;
```
