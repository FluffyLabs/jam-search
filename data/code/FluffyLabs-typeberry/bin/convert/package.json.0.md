---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/convert/package.json#L1-L45
title: bin/convert/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 204a7a9646da31ee62e22eb1c2fc15e2366afb3170a51d7c1ef9f5a196120d10
language: json
---
`bin/convert/package.json` (lines 1–45)

```json
{
  "name": "@typeberry/convert",
  "version": "0.7.0",
  "description": "Convert JAM-related types between different formats.",
  "repository": {
    "type": "git",
    "url": "https://github.com/FluffyLabs/typeberry"
  },
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "type": "module",
  "main": "index.js",
  "bin": "./index.js",
  "scripts": {
    "start": "NODE_ENV=development tsx ./index.ts",
    "build": "./build-for-npm.sh",
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/block-json": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/config-node": "*",
    "@typeberry/database": "*",
    "@typeberry/fuzz-proto": "*",
    "@typeberry/hash": "*",
    "@typeberry/json-parser": "*",
    "@typeberry/logger": "*",
    "@typeberry/pvm-interpreter": "*",
    "@typeberry/state": "*",
    "@typeberry/state-json": "*",
    "@typeberry/state-merkleization": "*",
    "@typeberry/state-vectors": "*",
    "@typeberry/test-runner": "*",
    "@typeberry/utils": "*",
    "json-bigint-patch": "0.0.8",
    "minimist": "1.2.8"
  },
  "devDependencies": {
    "@types/minimist": "1.2.5"
  }
}
```
