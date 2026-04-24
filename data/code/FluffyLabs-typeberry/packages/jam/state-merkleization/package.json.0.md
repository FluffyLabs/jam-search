---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/package.json#L1-L26
title: packages/jam/state-merkleization/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 51daa157b54948d973b53f76bc7b62a1f5419a8e38639087b893dd03ce2e1b9d
language: json
---
`packages/jam/state-merkleization/package.json` (lines 1–26)

```json
{
  "name": "@typeberry/state-merkleization",
  "version": "0.5.11",
  "description": "Serialization and merkleization of the state.",
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/crypto": "*",
    "@typeberry/hash": "*",
    "@typeberry/numbers": "*",
    "@typeberry/ordering": "*",
    "@typeberry/state": "*",
    "@typeberry/trie": "*",
    "@typeberry/utils": "*"
  },
  "type": "module"
}
```
