---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/package.json#L1-L34
title: packages/jam/transition/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: fef8aef1ceac4cf75709a17abd70055ba7dd2ba8285fb2721ba1f45d072201a3
language: json
---
`packages/jam/transition/package.json` (lines 1–34)

```json
{
  "name": "@typeberry/transition",
  "version": "0.11.0",
  "description": "JAM state transition.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/crypto": "*",
    "@typeberry/database": "*",
    "@typeberry/disputes": "*",
    "@typeberry/executor": "*",
    "@typeberry/hash": "*",
    "@typeberry/jam-host-calls": "*",
    "@typeberry/logger": "*",
    "@typeberry/mmr": "*",
    "@typeberry/numbers": "*",
    "@typeberry/safrole": "*",
    "@typeberry/shuffling": "*",
    "@typeberry/state": "*",
    "@typeberry/state-merkleization": "*",
    "@typeberry/trie": "*",
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
