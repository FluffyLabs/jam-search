---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/logger.ts#L1-L3
title: packages/jam/jam-host-calls/logger.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 531f80b04eab848f85ec7f391df02079b5d337ca1fdc8830bcff244c7ab1c6f3
language: typescript
---
`packages/jam/jam-host-calls/logger.ts` (lines 1–3)

```typescript
import { Logger } from "@typeberry/logger";

export const logger = Logger.new(import.meta.filename, "host-calls");
```
