---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/numbers/package.json#L1-L15
title: packages/core/numbers/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 8af32f12b2eded1f0dba0b15e03e77310df975cb4328ad5fa8a795ec89098d0a
language: json
---
`packages/core/numbers/package.json` (lines 1–15)

```json
{
  "name": "@typeberry/numbers",
  "version": "0.9.0",
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
