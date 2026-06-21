---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/bootstrap-importer.mjs#L1-L3
title: packages/workers/importer/bootstrap-importer.mjs
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: fcc3312030991915a2d65653e743bbe5a099e284f6b67b3408cab71d802be041
language: javascript
---
`packages/workers/importer/bootstrap-importer.mjs` (lines 1–3)

```javascript
import { tsImport } from "tsx/esm/api";

await tsImport("./bootstrap-main.ts", import.meta.url);
```
