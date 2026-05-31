---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config/pvm-backend.ts#L1-L10
title: packages/jam/config/pvm-backend.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 4f06dfe84eda07221b060ae3e248466f6e7ce9386604fcdb7836c8ae223d8b63
language: typescript
---
`packages/jam/config/pvm-backend.ts` (lines 1–10)

```typescript
/** Implemented PVM Backends names in THE SAME ORDER as enum. */
export const PvmBackendNames = ["built-in", "ananas"];

/** Implemented PVM Backends to choose from. */
export enum PvmBackend {
  /** Built-in aka. Typeberry 🫐 interpreter. */
  BuiltIn = 0,
  /** Ananas 🍍 interpreter. */
  Ananas = 1,
}
```
