---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/core/mem.ts#L1-L6'
title: sdk/core/mem.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 55d2b503223588683ad6fccbba1d68f5340ed3a08af93a76560cf82be00d9bca
language: typescript
---
`sdk/core/mem.ts` (lines 1–6)

```typescript
/** Read bytes from raw WASM linear memory into a managed Uint8Array. */
export function readFromMemory(ptr: u32, len: u32): Uint8Array {
  const data = new Uint8Array(len);
  memory.copy(data.dataStart, ptr, len);
  return data;
}
```
