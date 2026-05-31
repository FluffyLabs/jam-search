---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/package.json#L1-L25
title: packages/jam/transition/disputes/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e05444d3193aae1786fc10b473cbeab6afd8994c1572e7c9b844587e6edee304
language: json
---
`packages/jam/transition/disputes/package.json` (lines 1–25)

```json
{
  "name": "@typeberry/disputes",
  "version": "0.8.1",
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
