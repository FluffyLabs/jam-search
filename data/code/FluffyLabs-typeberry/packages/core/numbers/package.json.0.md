---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/numbers/package.json#L1-L15
title: packages/core/numbers/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 1573ea2fecb95975df03533fed0b74da919d7d86cc71d8204cb422fb494357ba
language: json
---
`packages/core/numbers/package.json` (lines 1–15)

```json
{
  "name": "@typeberry/numbers",
  "version": "0.10.0",
  "description": "Number types for typeberry data structures.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/utils": "*"
  },
  "scripts": {
    "test": "tsx --test $(find . -type f -o -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
