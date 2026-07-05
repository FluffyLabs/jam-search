---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/extensions.ts#L1-L8
title: packages/jam/node/extensions.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 1cc829c3fc858cb74d323dcc55d8c93ab6742dda901abf47de8c3893c57fe4bd
language: typescript
---
`packages/jam/node/extensions.ts` (lines 1–8)

```typescript
import * as ipc from "@typeberry/ext-ipc";

export function initializeExtensions(api: ipc.ExtensionApi) {
  const closeIpc = ipc.startExtension(api);
  return () => {
    closeIpc();
  };
}
```
