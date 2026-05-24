---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/shuffling/package.json#L1-L18
title: packages/core/shuffling/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 353881263dd60ce902166706caaa6c89e3f9bfa388022f34a122c5617af833dd
language: json
---
`packages/core/shuffling/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/shuffling",
  "version": "0.7.0",
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
