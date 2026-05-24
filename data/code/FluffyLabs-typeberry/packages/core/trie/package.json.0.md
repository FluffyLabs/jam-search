---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/trie/package.json#L1-L18
title: packages/core/trie/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e521d752605bfc2e54af8530bb2e6ffff80516edbb3cdd2e2f34c5750110014a
language: json
---
`packages/core/trie/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/trie",
  "version": "0.7.0",
  "description": "Trie implementation for Typeberry JAM.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/bytes": "*",
    "@typeberry/hash": "*",
    "@typeberry/collections": "*",
    "@typeberry/utils": "*"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
