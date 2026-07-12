---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/package.json#L1-L28
title: packages/jam/database-fjall/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 5b81475ffc68aa87663695a14123e48afba2bda98c74baf61354de8351eba446
language: json
---
`packages/jam/database-fjall/package.json` (lines 1–28)

```json
{
  "name": "@typeberry/database-fjall",
  "version": "0.11.0",
  "description": "Fjall (LSM-tree) backed database for typeberry.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "dependencies": {
    "@fjall-js/fjall": "0.5.0",
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/collections": "*",
    "@typeberry/codec": "*",
    "@typeberry/config": "*",
    "@typeberry/database": "*",
    "@typeberry/hash": "*",
    "@typeberry/logger": "*",
    "@typeberry/numbers": "*",
    "@typeberry/state": "*",
    "@typeberry/state-merkleization": "*",
    "@typeberry/trie": "*",
    "@typeberry/utils": "*"
  },
  "type": "module"
}
```
