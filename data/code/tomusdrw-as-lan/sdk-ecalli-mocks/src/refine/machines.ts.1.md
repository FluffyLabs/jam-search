---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk-ecalli-mocks/src/refine/machines.ts#L145-L207
title: sdk-ecalli-mocks/src/refine/machines.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 1
chunk_total: 2
content_sha: e56a3679f0f6f3736cc7820106911865a6c38955f4c6cd079366b7734791d8f6
language: typescript
---
`sdk-ecalli-mocks/src/refine/machines.ts` (lines 145–207)

```typescript
export function setExpungeResult(result: bigint): void {
  expungeResult = result;
}

export function resetMachines(): void {
  machineCounter = 0;
  machineResult = null;
  peekResult = null;
  peekData = null;
  pokeResult = null;
  pagesResult = null;
  invokeResult = null;
  invokeR8 = 0n;
  invokeIoR7 = null;
  expungeResult = null;
  pagesLog = [];
  pokeLog = [];
}

/** Return the number of logged pages() calls since last reset. */
export function getPagesLogLength(): bigint {
  return BigInt(pagesLog.length);
}

/** Return a field from the i-th logged pages() call.
 *  field 0 = machineId, 1 = startPage, 2 = pageCount, 3 = accessType.
 */
export function getPagesLogField(index: number, field: number): bigint {
  const call = pagesLog[index];
  if (!call) return -1n;
  if (field === 0) return BigInt(call.machineId);
  if (field === 1) return BigInt(call.startPage);
  if (field === 2) return BigInt(call.pageCount);
  if (field === 3) return BigInt(call.accessType);
  return -1n;
}

/** Return the number of logged poke() calls since last reset. */
export function getPokeLogLength(): bigint {
  return BigInt(pokeLog.length);
}

/** Return a scalar field from the i-th logged poke() call.
 *  field 0 = machineId, 1 = dest, 2 = dataLength.
 */
export function getPokeLogField(index: number, field: number): bigint {
  const call = pokeLog[index];
  if (!call) return -1n;
  if (field === 0) return BigInt(call.machineId);
  if (field === 1) return BigInt(call.dest);
  if (field === 2) return BigInt(call.data.length);
  return -1n;
}

/** Copy the i-th poke()'s data bytes into AS memory at dest_ptr.
 *  Caller must ensure the destination buffer has at least getPokeLogField(i, 2) bytes.
 */
export function getPokeLogData(index: number, dest_ptr: number): bigint {
  const call = pokeLog[index];
  if (!call) return -1n;
  writeToMem(dest_ptr, call.data, 0, call.data.length);
  return BigInt(call.data.length);
}
```
