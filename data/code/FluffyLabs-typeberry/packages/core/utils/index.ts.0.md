---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/utils/index.ts#L1-L22
title: packages/core/utils/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: a0a4ad09252f988f3350467cec77b330c36a24bcb3e8513aab63555f362eb7b3
language: typescript
---
`packages/core/utils/index.ts` (lines 1–22)

```typescript
/**
 * Utilities that are widely used across typeberry.
 *
 * BIG FAT NOTE: Please think twice or thrice before adding something here.
 * The package should really contain only things that are pretty much essential
 * and used everywhere.
 *
 * It might be much better to create a small package just for the thing you
 * are thinking about adding here. It's easier to later consolide smaller
 * things into this `utils` package than to split it into separate parts
 * as an afterthought.
 */

export * from "./compatibility.js";
export * from "./debug.js";
export * from "./dev.js";
export * from "./env.js";
export * from "./opaque.js";
export { name, version } from "./package.js";
export * from "./result.js";
export * from "./safe-alloc-uint8array.js";
export * from "./test.js";
```
