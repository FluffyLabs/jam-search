---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/index.ts#L1-L12
title: packages/core/codec/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: d6408c765ee1c7164b3119e80f306082d0c3c0baacf386206041eb1d35e31643
language: typescript
---
`packages/core/codec/index.ts` (lines 1–12)

```typescript
export * from "./decoder.js";
export * from "./descriptor.js";
export * from "./descriptors.js";
export * from "./encoder.js";
export * from "./validation.js";
export * from "./view.js";

// additional re-export of descriptors namespace under `codec`
// note we export descriptors in top level as well,
// because writing `codec.codec.u32` when using the library looks weird
import * as descriptors from "./descriptors.js";
export const codec = descriptors;
```
