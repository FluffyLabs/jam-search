---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/portable/index.ts#L1-L7'
title: portable/index.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-24T09:46:09+02:00'
last_modified: '2026-04-24T09:46:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2ee1f2a953a19693ee8e3e038321d862ffab416e815b8811caaf2dab2419192e
language: typescript
---
`portable/index.ts` (lines 1–7)

```typescript
// Portable JS entry point for anan-as
// Imports portable runtime glue before the AS portable runtime.
import "./bootstrap";
import "../assembly/portable";
import "assemblyscript/std/portable/index.js";

export * from "../assembly/index-shared";
```
