---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/erasure-coding/index.ts#L1-L6
title: packages/core/erasure-coding/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 653fdc06a54081e6219a6ad06f565064dcc4f6b9f447f5d3aceec715be3ced0a
language: typescript
---
`packages/core/erasure-coding/index.ts` (lines 1–6)

```typescript
import { init } from "@typeberry/native";

export * from "./erasure-coding.js";
export const initEc = async () => {
  await init.reedSolomon();
};
```
