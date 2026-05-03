---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk-ecalli-mocks/src/memory.ts#L1-L33
title: sdk-ecalli-mocks/src/memory.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2690a1387d95d90f80afbb7f3b6da9870f3627eb6c539d85eab5e07f45a7561f
language: typescript
---
`sdk-ecalli-mocks/src/memory.ts` (lines 1–33)

```typescript
let wasmMemory: WebAssembly.Memory | null = null;

export function setMemory(memory: WebAssembly.Memory): void {
  wasmMemory = memory;
}

export function readUtf8(ptr: number, len: number): string | null {
  if (!wasmMemory) return null;
  if (!len) return "";
  const bytes = new Uint8Array(wasmMemory.buffer, ptr, len);
  return new TextDecoder().decode(bytes);
}

export function readBytes(ptr: number, len: number): Uint8Array {
  if (!wasmMemory || !len) return new Uint8Array(0);
  return new Uint8Array(wasmMemory.buffer).slice(ptr, ptr + len);
}

export function writeToMem(ptr: number, data: Uint8Array, offset: number, maxLen: number): void {
  if (!wasmMemory) return;
  const len = Math.min(maxLen, data.length - offset);
  if (len > 0) {
    const view = new Uint8Array(wasmMemory.buffer);
    for (let i = 0; i < len; i++) {
      view[ptr + i] = data[offset + i];
    }
  }
}

export function writeI64(ptr: number, value: bigint): void {
  if (!wasmMemory || ptr < 0 || ptr + 8 > wasmMemory.buffer.byteLength) return;
  new DataView(wasmMemory.buffer).setBigInt64(ptr, value, true);
}
```
