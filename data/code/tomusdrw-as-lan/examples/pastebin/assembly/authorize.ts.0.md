---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/pastebin/assembly/authorize.ts#L1-L11
title: examples/pastebin/assembly/authorize.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 0
chunk_total: 1
content_sha: b864d819a87f3226088f870a7422f970d47f5f7cd3aca341ecce5d7fefbd9194
language: typescript
---
`examples/pastebin/assembly/authorize.ts` (lines 1–11)

```typescript
import { AuthorizeContext, Response } from "@fluffylabs/as-lan";

/**
 * is_authorized: accept any payload unconditionally. Pastebin is open to all.
 */
export function is_authorized(ptr: u32, len: u32): u64 {
  const ctx = AuthorizeContext.create();
  // Validates input size (panics if < 2 bytes). CoreIndex is unused — pastebin accepts all cores.
  ctx.parseCoreIndex(ptr, len);
  return Response.with(0);
}
```
