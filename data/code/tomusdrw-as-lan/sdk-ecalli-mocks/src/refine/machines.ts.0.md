---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk-ecalli-mocks/src/refine/machines.ts#L1-L153
title: sdk-ecalli-mocks/src/refine/machines.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 5c6d2a27e9016b626ba92ddb7fd2aa080c3fbe9cbf7a49bd968392c823032eff
language: typescript
---
`sdk-ecalli-mocks/src/refine/machines.ts` (lines 1–153)

```typescript
// Ecalli 8-13: Inner PVM machine operations.
//
// machine (8), peek (9), poke (10), pages (11), invoke (12), expunge (13)
// are tightly coupled — all operate on inner machines created via machine().

import { readBytes, writeI64, writeToMem } from "../memory.js";

let machineCounter = 0;
let machineResult: bigint | null = null;
let peekResult: bigint | null = null;
let peekData: Uint8Array | null = null;
let pokeResult: bigint | null = null;
let pagesResult: bigint | null = null;
let invokeResult: bigint | null = null;
let invokeR8: bigint = 0n;
let invokeIoR7: bigint | null = null;
let expungeResult: bigint | null = null;

type PagesCall = {
  machineId: number;
  startPage: number;
  pageCount: number;
  accessType: number;
};
type PokeCall = {
  machineId: number;
  dest: number;
  data: Uint8Array;
};
let pagesLog: PagesCall[] = [];
let pokeLog: PokeCall[] = [];

/** Ecalli 8: Create inner PVM machine. */
export function machine(
  _code_ptr: number,
  _code_len: number,
  _entrypoint: number,
): bigint {
  if (machineResult !== null) return machineResult;
  return BigInt(machineCounter++);
}

/** Ecalli 9: Peek inner machine memory — returns OK. */
export function peek(
  _machine_id: number,
  dest_ptr: number,
  _source: number,
  length: number,
): bigint {
  // Skip memory write when the mock is configured with an error sentinel —
  // a real host returning OOB/WHO would not touch the destination buffer.
  if (peekResult !== null && peekResult < 0n) return peekResult;
  if (peekData !== null) {
    writeToMem(dest_ptr, peekData, 0, length);
  }
  if (peekResult !== null) return peekResult;
  return 0n; // OK
}

/** Ecalli 10: Poke inner machine memory — returns OK. */
export function poke(
  machine_id: number,
  source_ptr: number,
  dest: number,
  length: number,
): bigint {
  const data = readBytes(source_ptr, length);
  pokeLog.push({ machineId: machine_id, dest, data });
  if (pokeResult !== null) return pokeResult;
  return 0n; // OK
}

/** Ecalli 11: Set inner machine page access — returns OK. */
export function pages(
  machine_id: number,
  start_page: number,
  page_count: number,
  access_type: number,
): bigint {
  pagesLog.push({
    machineId: machine_id,
    startPage: start_page,
    pageCount: page_count,
    accessType: access_type,
  });
  if (pagesResult !== null) return pagesResult;
  return 0n; // OK
}

/** Ecalli 12: Invoke inner machine — returns HALT (0), writes r8. */
export function invoke(
  _machine_id: number,
  io_ptr: number,
  out_r8: number,
): bigint {
  writeI64(out_r8, invokeR8);
  if (invokeIoR7 !== null) {
    // InvokeIo layout: [gas(8), r0(8), r1(8), ..., r12(8)]. r7 is at offset 8 + 7*8 = 64.
    writeI64(io_ptr + 64, invokeIoR7);
  }
  if (invokeResult !== null) return invokeResult;
  return 0n; // HALT
}

/** Ecalli 13: Expunge inner machine — returns OK. */
export function expunge(
  _machine_id: number,
): bigint {
  if (expungeResult !== null) return expungeResult;
  return 0n; // OK
}

// ─── Configuration functions (called from AS test-ecalli helpers) ───

export function setMachineResult(result: bigint): void {
  machineResult = result;
}

export function setPeekResult(result: bigint): void {
  peekResult = result;
}

/** Configure peek() to copy these bytes into dest_ptr. AS calls via (ptr, len). */
export function setPeekData(ptr: number, len: number): void {
  peekData = readBytes(ptr, len);
}

export function setPokeResult(result: bigint): void {
  pokeResult = result;
}

export function setPagesResult(result: bigint): void {
  pagesResult = result;
}

export function setInvokeResult(result: bigint, r8: bigint = 0n): void {
  invokeResult = result;
  invokeR8 = r8;
}

export function setInvokeIoR7(value: bigint): void {
  invokeIoR7 = value;
}

export function setExpungeResult(result: bigint): void {
  expungeResult = result;
}

export function resetMachines(): void {
  machineCounter = 0;
  machineResult = null;
  peekResult = null;
  peekData = null;
```
