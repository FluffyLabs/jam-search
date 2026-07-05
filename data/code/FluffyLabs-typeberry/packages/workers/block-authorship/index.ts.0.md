---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/index.ts#L1-L4
title: packages/workers/block-authorship/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: f76cd5d980c04e99ae1724aca8340298918ee6f842983e7eadcaa8a60234a6ea
language: typescript
---
`packages/workers/block-authorship/index.ts` (lines 1–4)

```typescript
export * from "./main.js";
export * from "./metrics.js";
export * from "./protocol.js";
export const WORKER = new URL("./bootstrap-authorship.mjs", import.meta.url);
```
