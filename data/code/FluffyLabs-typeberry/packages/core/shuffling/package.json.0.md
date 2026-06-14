---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/shuffling/package.json#L1-L18
title: packages/core/shuffling/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 612633fee0de82309966480a66f48c2ebca1c7689772f10dd857e72028f38bda
language: json
---
`packages/core/shuffling/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/shuffling",
  "version": "0.9.0",
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
