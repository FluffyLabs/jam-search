---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/pastebin/assembly/index.ts#L1-L10
title: examples/pastebin/assembly/index.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: c936dff6ae10d31ebad7220668136edcae61be56b400c303a5b7fdfe64be8412
language: typescript
---
`examples/pastebin/assembly/index.ts` (lines 1–10)

```typescript
export { accumulate } from "./accumulate";

import { isRefineArgs } from "@fluffylabs/as-lan";
import { is_authorized } from "./authorize";
import { refine as refine_ } from "./refine";

export function refine(ptr: u32, len: u32): u64 {
  if (isRefineArgs(len)) return refine_(ptr, len);
  return is_authorized(ptr, len);
}
```
