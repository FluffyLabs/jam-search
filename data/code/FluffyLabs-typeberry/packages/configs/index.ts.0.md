---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/configs/index.ts#L1-L7
title: packages/configs/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 9e7a48c34e9eec7c6cdb52be4064378b765c193a6a98206d70386711d1628e8b
language: typescript
---
`packages/configs/index.ts` (lines 1–7)

```typescript
import defaultConfig from "./typeberry-default.json" with { type: "json" };
import devConfig from "./typeberry-dev.json" with { type: "json" };

export const configs = {
  default: defaultConfig,
  dev: devConfig,
};
```
