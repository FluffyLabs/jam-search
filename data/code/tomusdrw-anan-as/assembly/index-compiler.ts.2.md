---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/index-compiler.ts#L254-L278
title: assembly/index-compiler.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-24T09:46:09+02:00'
last_modified: '2026-04-24T09:46:09+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 9f21745cc66cd76d71a9186c2e9a5d6a6b3ab9f012f08002b9da436cc3be9876
language: typescript
---
`assembly/index-compiler.ts` (lines 254–278)

```typescript
 * @param addr Address in inner program's memory space
 * @param dataPtr Pointer to data in interpreter/WASM memory
 * @param dataLen Number of bytes to write
 * @returns 1 on success, 0 on page fault
 */
export function host_write_memory(addr: u32, dataPtr: u32, dataLen: u32): u32 {
  if (dataLen === 0) {
    return 1;
  }
  const int = interpreter;
  if (int === null) {
    return 0;
  }

  // Read data from interpreter memory
  const data = new Uint8Array(dataLen);
  for (let i: u32 = 0; i < dataLen; i++) {
    data[i] = load<u8>(dataPtr + i);
  }

  const faultRes = new MaybePageFault();
  int.memory.bytesWrite(faultRes, addr, data, 0);

  return faultRes.isFault ? 0 : 1;
}
```
