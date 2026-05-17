---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/index.ts#L1-L4
title: packages/workers/block-authorship/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: c15aee6e8ed30b9ce00f20ccc201ad6ee112a456123cbd6fe9ea1bbb8f153218
language: typescript
---
`packages/workers/block-authorship/index.ts` (lines 1–4)

```typescript
export * from "./main.js";
export * from "./metrics.js";
export * from "./protocol.js";
export const WORKER = new URL("./bootstrap-generator.mjs", import.meta.url);
```
