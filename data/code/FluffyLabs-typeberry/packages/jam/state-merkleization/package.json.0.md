---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/package.json#L1-L26
title: packages/jam/state-merkleization/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 6f2719bf4392aff8589ad02d0197a7642dbac88e9389ad367de0e0741e313281
language: json
---
`packages/jam/state-merkleization/package.json` (lines 1–26)

```json
{
  "name": "@typeberry/state-merkleization",
  "version": "0.8.4",
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
