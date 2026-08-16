---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/misc/benchmark/package.json#L1-L18
title: packages/misc/benchmark/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 0bc3a6b21f9a903d44c5e358239a0fe08fcd957bc6bb7be9162b3f3b2863cd69
language: json
---
`packages/misc/benchmark/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/benchmark",
  "version": "0.11.0",
  "description": "Benchmarks runner for typeberry.",
  "main": "index.ts",
  "scripts": {
    "start": "tsx ./index.ts",
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "dependencies": {
    "@typeberry/logger": "*",
    "benny": "3.7.1",
    "chalk": "4.1.2"
  },
  "type": "module"
}
```
