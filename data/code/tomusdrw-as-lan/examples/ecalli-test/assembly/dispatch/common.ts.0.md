---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/dispatch/common.ts#L1-L11
title: examples/ecalli-test/assembly/dispatch/common.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 4cbc14a6760d207240d06c10b2647573cc0af682ec07dcd536f77f9c6c09f2d7
language: typescript
---
`examples/ecalli-test/assembly/dispatch/common.ts` (lines 1–11)

```typescript
import { Logger } from "@fluffylabs/as-lan";

export const logger: Logger = Logger.create("ecalli-test");

/** Calculate how many bytes were written to the output buffer. */
export function outputLen(result: i64, offset: u32, maxLen: u32): u32 {
  if (result < 0) return 0;
  const total = u32(result);
  if (total <= offset) return 0;
  return min(maxLen, total - offset);
}
```
