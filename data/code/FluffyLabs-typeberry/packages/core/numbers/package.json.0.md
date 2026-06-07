---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/numbers/package.json#L1-L15
title: packages/core/numbers/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 7a51c14945ab4d1b08974b3aee1c07b145727d31d377219a1f8e7426907801b4
language: json
---
`packages/core/numbers/package.json` (lines 1–15)

```json
{
  "name": "@typeberry/numbers",
  "version": "0.8.4",
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
