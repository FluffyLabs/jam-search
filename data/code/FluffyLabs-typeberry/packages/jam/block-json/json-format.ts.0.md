---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block-json/json-format.ts#L1-L11
title: packages/jam/block-json/json-format.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 889688407c5a4887cefc6464b9ebb92098c07a99d1aef027527d639ad571be3e
language: typescript
---
`packages/jam/block-json/json-format.ts` (lines 1–11)

```typescript
import type { PropertyKeys } from "@typeberry/codec";

type CamelToSnake<S extends string> = S extends `${infer T}${infer U}`
  ? U extends Uncapitalize<U> // Check if U is already lowercase
    ? `${T}${CamelToSnake<U>}` // Continue without adding an underscore
    : `${T}_${CamelToSnake<Uncapitalize<U>>}` // Add underscore and continue
  : S;

export type JsonObject<T> = {
  [K in PropertyKeys<T> as CamelToSnake<K & string>]: T[K];
};
```
