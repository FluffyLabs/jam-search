---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk-ecalli-mocks/src/general/storage.ts#L1-L51
title: sdk-ecalli-mocks/src/general/storage.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 67a800b3142413d263d5abd3bf1f8088caed41fc0b48e02292205760c1ae786c
language: typescript
---
`sdk-ecalli-mocks/src/general/storage.ts` (lines 1–51)

```typescript
import { readBytes, writeToMem } from "../memory.js";

const DELETE_SENTINEL = 0xffff_ffff;
const storage = new Map<string, Uint8Array>();

export function setStorageEntry(keyPtr: number, keyLen: number, valPtr: number, valLen: number): void {
  const key = readBytes(keyPtr, keyLen);
  const keyStr = new TextDecoder().decode(key);
  if (valLen === DELETE_SENTINEL) {
    storage.delete(keyStr);
  } else if (valLen === 0) {
    storage.set(keyStr, new Uint8Array(0));
  } else {
    storage.set(keyStr, readBytes(valPtr, valLen));
  }
}

export function read(
  _service: number,
  key_ptr: number,
  key_len: number,
  out_ptr: number,
  offset: number,
  length: number,
): bigint {
  const key = readBytes(key_ptr, key_len);
  const keyStr = new TextDecoder().decode(key);
  const value = storage.get(keyStr);
  if (value === undefined) {
    return -1n; // NONE
  }
  writeToMem(out_ptr, value, offset, length);
  return BigInt(value.length);
}

export function write(key_ptr: number, key_len: number, value_ptr: number, value_len: number): bigint {
  const key = readBytes(key_ptr, key_len);
  const keyStr = new TextDecoder().decode(key);
  const prevValue = storage.get(keyStr);
  if (value_len === 0) {
    storage.delete(keyStr);
  } else {
    const value = readBytes(value_ptr, value_len);
    storage.set(keyStr, value);
  }
  return prevValue !== undefined ? BigInt(prevValue.length) : -1n;
}

export function resetStorage(): void {
  storage.clear();
}
```
