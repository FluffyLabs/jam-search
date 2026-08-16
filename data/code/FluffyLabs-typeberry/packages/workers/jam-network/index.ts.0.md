---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/jam-network/index.ts#L1-L3
title: packages/workers/jam-network/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 71a37027169d71d900019805257e18903db870a962e12d58ca8f133aebd7d4fa
language: typescript
---
`packages/workers/jam-network/index.ts` (lines 1–3)

```typescript
export * from "./main.js";
export * from "./protocol.js";
export const WORKER = new URL("./bootstrap-network.mjs", import.meta.url);
```
