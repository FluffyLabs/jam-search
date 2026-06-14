---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/package.json#L1-L26
title: packages/jam/database-fjall/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 41050550271af18229504a9cd701e4c79ab6461b3bf8df1c5288ebd235049c02
language: json
---
`packages/jam/database-fjall/package.json` (lines 1–26)

```json
{
  "name": "@typeberry/database-fjall",
  "version": "0.9.0",
  "description": "Fjall (LSM-tree) backed database for typeberry.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "dependencies": {
    "@fjall-js/fjall": "0.1.3",
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/database": "*",
    "@typeberry/hash": "*",
    "@typeberry/logger": "*",
    "@typeberry/state": "*",
    "@typeberry/state-merkleization": "*",
    "@typeberry/trie": "*",
    "@typeberry/utils": "*"
  },
  "type": "module"
}
```
