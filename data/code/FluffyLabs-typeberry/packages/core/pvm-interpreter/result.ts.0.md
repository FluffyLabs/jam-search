---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/result.ts#L1-L7
title: packages/core/pvm-interpreter/result.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 5530b0a37eaa69c095364aa63ce1a6f6051bdd1af6a1c9811f5889815b8c2ed4
language: typescript
---
`packages/core/pvm-interpreter/result.ts` (lines 1–7)

```typescript
export enum Result {
  HALT = 0,
  PANIC = 1,
  FAULT_ACCESS = 2,
  FAULT = 3,
  HOST = 4,
}
```
