---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/package.json#L1-L25
title: packages/jam/transition/disputes/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 87b4c9c141755a76f57172b6e211312d03790a6685c0cc386a67d21f05f44702
language: json
---
`packages/jam/transition/disputes/package.json` (lines 1–25)

```json
{
  "name": "@typeberry/disputes",
  "version": "0.11.0",
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
