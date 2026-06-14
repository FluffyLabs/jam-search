---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/misc/benchmark/package.json#L1-L18
title: packages/misc/benchmark/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 373f7e9a2226b2145774ae1fd7a74c7e4cac6f0d388977884e4829a34a78eda5
language: json
---
`packages/misc/benchmark/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/benchmark",
  "version": "0.9.0",
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
