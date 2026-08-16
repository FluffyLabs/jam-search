---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/shuffling/package.json#L1-L18
title: packages/core/shuffling/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 19e7c3d710283cf8e00a41bc69cd81234d560c1b311beb1ebadd5dc9ebd68a7e
language: json
---
`packages/core/shuffling/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/shuffling",
  "version": "0.11.0",
  "description": "The Fisher-Yates shuffle function based on GP",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/bytes": "*",
    "@typeberry/hash": "*",
    "@typeberry/numbers": "*",
    "@typeberry/utils": "*"
  },
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
