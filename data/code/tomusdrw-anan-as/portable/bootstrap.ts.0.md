---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/portable/bootstrap.ts#L1-L5'
title: portable/bootstrap.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-20T20:20:54Z'
last_modified: '2026-05-20T20:20:54Z'
chunk_index: 0
chunk_total: 1
content_sha: 1329ae2ade4f42488cbdcd8bc052515ea3c6ecbb2292b47c26f66c71de733ecf
language: typescript
---
`portable/bootstrap.ts` (lines 1–5)

```typescript
// Portable bootstrap for globals that must exist before assembly/portable executes.
const g = globalThis as Record<string, unknown>;
if (g.ASC_TARGET === undefined) {
  g.ASC_TARGET = 0;
}
```
