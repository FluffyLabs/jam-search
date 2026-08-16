---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/merkleization/package.json#L1-L17
title: packages/jam/merkleization/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: edbc4ac9e04c6a8a10e74edb998052734620434e817545161fea3de9d7553464
language: json
---
`packages/jam/merkleization/package.json` (lines 1–17)

```json
{
  "name": "@typeberry/merkleization",
  "version": "0.11.0",
  "description": "General JAM merkleization functions.",
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/bytes": "*",
    "@typeberry/hash": "*",
    "@typeberry/trie": "*"
  },
  "type": "module"
}
```
