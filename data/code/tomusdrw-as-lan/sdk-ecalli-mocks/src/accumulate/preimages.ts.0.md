---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk-ecalli-mocks/src/accumulate/preimages.ts#L1-L120
title: sdk-ecalli-mocks/src/accumulate/preimages.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: b98d1bbcb4fa87b76876e177c12b802be792315266c75e97866598eca2be1e30
language: typescript
---
`sdk-ecalli-mocks/src/accumulate/preimages.ts` (lines 1–120)

```typescript
// Ecalli 22-26: Preimage management operations.
//
// query (22), solicit (23), forget (24), yield_result (25), provide (26)
// — manage preimage availability and solicitation.

import { clearPreimageAttachments } from "../general/lookup.js";
import { writeI64 } from "../memory.js";

// ─── Configurable state ──────────────────────────────────────────────────

let queryR7: bigint = -1n; // NONE by default
let queryR8: bigint = 0n;
let solicitResult: bigint = 0n; // OK
let forgetResult: bigint = 0n; // OK
let provideResult: bigint = 0n; // OK

let solicitCount = 0;
let forgetCount = 0;
let provideCount = 0;

/** Configure the query ecalli return values (r7, r8). */
export function setQueryResult(r7: bigint, r8: bigint): void {
  queryR7 = r7;
  queryR8 = r8;
}

/** Configure the solicit ecalli return value. */
export function setSolicitResult(result: bigint): void {
  solicitResult = result;
}

/** Configure the forget ecalli return value. */
export function setForgetResult(result: bigint): void {
  forgetResult = result;
}

/** Configure the provide ecalli return value. */
export function setProvideResult(result: bigint): void {
  provideResult = result;
}

export function getSolicitCount(): bigint {
  return BigInt(solicitCount);
}

export function getForgetCount(): bigint {
  return BigInt(forgetCount);
}

export function getProvideCount(): bigint {
  return BigInt(provideCount);
}

export function resetPreimageCounters(): void {
  solicitCount = 0;
  forgetCount = 0;
  provideCount = 0;
}

export function resetPreimages(): void {
  queryR7 = -1n;
  queryR8 = 0n;
  solicitResult = 0n;
  forgetResult = 0n;
  provideResult = 0n;
  solicitCount = 0;
  forgetCount = 0;
  provideCount = 0;
  // Attached preimages are a lookup-mock concern, but we also clear them
  // here so that resetAccumulate() (which calls resetPreimages without
  // resetLookup) leaves no cross-test leakage.
  clearPreimageAttachments();
}

// ─── Ecalli stubs ────────────────────────────────────────────────────────

/** Ecalli 22: Query preimage status. */
export function query(
  _hash_ptr: number,
  _length: number,
  out_r8: number,
): bigint {
  writeI64(out_r8, queryR8);
  return queryR7;
}

/** Ecalli 23: Solicit preimage — returns configured result. */
export function solicit(
  _hash_ptr: number,
  _length: number,
): bigint {
  solicitCount++;
  return solicitResult;
}

/** Ecalli 24: Forget preimage solicitation — returns configured result. */
export function forget(
  _hash_ptr: number,
  _length: number,
): bigint {
  forgetCount++;
  return forgetResult;
}

/** Ecalli 25: Yield accumulation result hash — returns OK. */
export function yield_result(
  _hash_ptr: number,
): bigint {
  return 0n; // OK
}

/** Ecalli 26: Provide preimage for solicited hash — returns configured result. */
export function provide(
  _service: number,
  _preimage_ptr: number,
  _preimage_len: number,
): bigint {
  provideCount++;
  return provideResult;
}
```
