---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/all-ecalli/assembly/authorize.ts#L122-L129
title: examples/all-ecalli/assembly/authorize.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 8c2b3186139b0a9694186cc0496fde78ada9feb59b2ddedf43a18ab2892ec460
language: typescript
---
`examples/all-ecalli/assembly/authorize.ts` (lines 122–129)

```typescript
function fetchAll(out: Encoder, kind: u32, name: string, param1: u32, param2: u32): u32 {
  const buf = BytesBlob.zero(256);
  const r = fetch(buf.ptr(), 0, buf.length, kind, param1, param2);
  logger.info(`[1] fetch(${name}) = ${r}`);
  out.varU64(1);
  out.u64(r);
  return 1;
}
```
