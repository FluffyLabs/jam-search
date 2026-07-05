---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/utils/index.ts#L1-L23
title: packages/core/utils/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 788695afae0f24ae0da91a06c0367783b6fed74c3a42d8731c9f250fc7505399
language: typescript
---
`packages/core/utils/index.ts` (lines 1–23)

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
export * from "./shutdown.js";
export * from "./test.js";
```
