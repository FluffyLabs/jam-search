---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/utils/package.ts#L1-L5
title: packages/core/utils/package.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 3e2e293907d0ee0f0557372da14b88097caae0adb8e315e934d7dca87b6bb58c
language: typescript
---
`packages/core/utils/package.ts` (lines 1–5)

```typescript
// eslint-disable-next-line import/no-relative-packages
import pkg from "../../../package.json" with { type: "json" };

export const name = pkg.name;
export const version = pkg.version;
```
