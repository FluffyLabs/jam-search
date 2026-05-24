---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/misc/benchmark/package.json#L1-L18
title: packages/misc/benchmark/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 725f2e3e3ce93598e157bcb936786e7a0e222e3f737e88145ae7a2c427d49a15
language: json
---
`packages/misc/benchmark/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/benchmark",
  "version": "0.7.0",
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
