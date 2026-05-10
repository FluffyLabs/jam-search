---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk-ecalli-mocks/src/general/info.ts#L1-L40
title: sdk-ecalli-mocks/src/general/info.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 51e795461df1e856c2ea086eb0b96969166dabdcf583cf8394977c4efd761e99
language: typescript
---
`sdk-ecalli-mocks/src/general/info.ts` (lines 1–40)

```typescript
import { readBytes, writeToMem } from "../memory.js";

function buildDefaultInfoData(): Uint8Array {
  const data = new Uint8Array(96);
  for (let i = 0; i < 32; i++) data[i] = 0xaa;
  data[32] = 0xe8;
  data[33] = 0x03;
  return data;
}

const infoByService = new Map<number, Uint8Array | null>();
let defaultInfoData: Uint8Array | null = buildDefaultInfoData();

export function setInfoData(service: number, ptr: number, len: number): void {
  if (len === 0) {
    infoByService.set(service, null);
  } else {
    infoByService.set(service, readBytes(ptr, len));
  }
}

export function setDefaultInfoData(ptr: number, len: number): void {
  if (len === 0) {
    defaultInfoData = null;
  } else {
    defaultInfoData = readBytes(ptr, len);
  }
}

export function info(service: number, out_ptr: number, offset: number, length: number): bigint {
  const data = infoByService.has(service) ? infoByService.get(service)! : defaultInfoData;
  if (data === null || data === undefined) return -1n; // NONE
  writeToMem(out_ptr, data, offset, length);
  return BigInt(data.length);
}

export function resetInfo(): void {
  infoByService.clear();
  defaultInfoData = buildDefaultInfoData();
}
```
