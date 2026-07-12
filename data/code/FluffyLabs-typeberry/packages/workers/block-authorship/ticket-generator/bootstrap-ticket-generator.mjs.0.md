---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/ticket-generator/bootstrap-ticket-generator.mjs#L1-L3
title: >-
  packages/workers/block-authorship/ticket-generator/bootstrap-ticket-generator.mjs
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: fcc3312030991915a2d65653e743bbe5a099e284f6b67b3408cab71d802be041
language: javascript
---
`packages/workers/block-authorship/ticket-generator/bootstrap-ticket-generator.mjs` (lines 1–3)

```javascript
import { tsImport } from "tsx/esm/api";

await tsImport("./bootstrap-main.ts", import.meta.url);
```
