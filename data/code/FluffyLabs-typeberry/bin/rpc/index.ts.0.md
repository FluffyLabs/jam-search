---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/index.ts#L1-L7'
title: bin/rpc/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 4aff4cc2ba3020eecfb2bab016348d76fb058d625cf7ab44a63332f56eb21ded
language: typescript
---
`bin/rpc/index.ts` (lines 1–7)

```typescript
import { main } from "./main.js";

main(process.argv.slice(2)).catch((e) => {
  // biome-ignore lint/suspicious/noConsole: bin file
  console.error(e);
  process.exit(-1);
});
```
