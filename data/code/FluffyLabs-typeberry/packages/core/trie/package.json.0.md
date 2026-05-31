---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/trie/package.json#L1-L18
title: packages/core/trie/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 866ab2124991723a05968d9d80f8c0cf01d77ff5114a51caea099f872e4d4963
language: json
---
`packages/core/trie/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/trie",
  "version": "0.8.1",
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
