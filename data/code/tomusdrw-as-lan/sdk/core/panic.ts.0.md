---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/core/panic.ts#L1-L15'
title: sdk/core/panic.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2cbac91ad09a390306152ab13ac53a31236fe22417acc99745314c18a94341e3
language: typescript
---
`sdk/core/panic.ts` (lines 1–15)

```typescript
import { log } from "../ecalli";
import { BytesBlob } from "./bytes";

/**
 * Terminate execution with a message.
 *
 * Use for host-contract violations and other "should never happen" conditions
 * where continuing execution is meaningless (e.g. the host returned malformed data).
 */
export function panic(msg: string): void {
  const targetBuf = BytesBlob.encodeAscii("panic");
  const msgBuf = BytesBlob.encodeAscii(msg);
  log(0, targetBuf.ptr(), targetBuf.length, msgBuf.ptr(), msgBuf.length);
  abort(msg);
}
```
