---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/index.ts#L1-L4
title: packages/workers/importer/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 70b5ee74483c3336d4f88bfc930ac19c13672482758571d755dddfabc8a3aabb
language: typescript
---
`packages/workers/importer/index.ts` (lines 1–4)

```typescript
export * from "./main.js";
export * from "./metrics.js";
export * from "./protocol.js";
export const WORKER = new URL("./bootstrap-importer.mjs", import.meta.url);
```
