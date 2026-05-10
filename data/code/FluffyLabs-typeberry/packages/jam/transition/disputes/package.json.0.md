---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/package.json#L1-L25
title: packages/jam/transition/disputes/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 1d4f8329e0fa0051a4286371cad52899cd0c93c941fc0af1aad43c03606a9583
language: json
---
`packages/jam/transition/disputes/package.json` (lines 1–25)

```json
{
  "name": "@typeberry/disputes",
  "version": "0.6.0",
  "description": "Disputes implementation based on the Gray Paper.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/crypto": "*",
    "@typeberry/numbers": "*",
    "@typeberry/hash": "*",
    "@typeberry/safrole": "*",
    "@typeberry/state": "*",
    "@typeberry/utils": "*"
  },
  "type": "module"
}
```
