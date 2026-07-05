---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/configs/index.ts#L1-L9
title: packages/configs/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 9e2e4422a126af658846c24dae6bf228651f5c3c1cd230e4f099adb3fc73ddb9
language: typescript
---
`packages/configs/index.ts` (lines 1–9)

```typescript
import defaultConfig from "./typeberry-default.json" with { type: "json" };
import devFullConfig from "./typeberry-dev-full.json" with { type: "json" };
import devTinyConfig from "./typeberry-dev-tiny.json" with { type: "json" };

export const configs = {
  default: defaultConfig,
  devTiny: devTinyConfig,
  devFull: devFullConfig,
};
```
