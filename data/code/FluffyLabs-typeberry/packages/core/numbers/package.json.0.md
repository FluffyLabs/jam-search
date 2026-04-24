---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/numbers/package.json#L1-L15
title: packages/core/numbers/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 51597eef7ce991837aa543955559468dd61e10e722c6080b725fb3bccac7a3f4
language: json
---
`packages/core/numbers/package.json` (lines 1–15)

```json
{
  "name": "@typeberry/numbers",
  "version": "0.5.11",
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
