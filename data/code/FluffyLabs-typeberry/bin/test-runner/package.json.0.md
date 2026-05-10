---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/package.json#L1-L49
title: bin/test-runner/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: dbf8616c29f2e2652a2f29052f6e4c595e7918326699bb1bd1744be2817812b0
language: json
---
`bin/test-runner/package.json` (lines 1–49)

```json
{
  "name": "@typeberry/test-runner",
  "version": "0.6.0",
  "description": "JAM-test-vectors runner.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/block-json": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/config-node": "*",
    "@typeberry/crypto": "*",
    "@typeberry/database": "*",
    "@typeberry/disputes": "*",
    "@typeberry/erasure-coding": "*",
    "@typeberry/hash": "*",
    "@typeberry/json-parser": "*",
    "@typeberry/logger": "*",
    "@typeberry/numbers": "*",
    "@typeberry/pvm-interface": "*",
    "@typeberry/pvm-interpreter": "*",
    "@typeberry/safrole": "*",
    "@typeberry/shuffling": "*",
    "@typeberry/state": "*",
    "@typeberry/state-json": "*",
    "@typeberry/state-merkleization": "*",
    "@typeberry/state-vectors": "*",
    "@typeberry/transition": "*",
    "@typeberry/trie": "*",
    "@typeberry/utils": "*",
    "json-bigint-patch": "0.0.8",
    "minimist": "^1.2.8"
  },
  "scripts": {
    "start": "tsx --test-timeout=900000 ./index.ts",
    "w3f:0.7.2": "GP_VERSION=0.7.2 tsx ./w3f-072.ts",
    "w3f-davxy:0.7.1": "GP_VERSION=0.7.1 tsx ./w3f-davxy-071.ts",
    "w3f-davxy:0.7.2": "GP_VERSION=0.7.2 tsx ./w3f-davxy-072.ts",
    "jam-conformance:0.7.1": "GP_VERSION=0.7.1 tsx ./jam-conformance-071.ts",
    "jam-conformance:0.7.2": "GP_VERSION=0.7.2 tsx ./jam-conformance-072.ts",
    "javajam:0.7.1": "GP_VERSION=0.7.1 tsx ./javajam-071.ts",
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
