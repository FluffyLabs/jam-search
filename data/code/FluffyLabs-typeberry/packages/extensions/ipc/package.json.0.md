---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/extensions/ipc/package.json#L1-L28
title: packages/extensions/ipc/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 80054d21cac87aca56d82dc555cce11fdd12f6fa64b677c8c14d23d442957066
language: json
---
`packages/extensions/ipc/package.json` (lines 1–28)

```json
{
  "name": "@typeberry/ext-ipc",
  "version": "0.9.0",
  "description": "An IPC extension to inspect the node state.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/fuzz-proto": "*",
    "@typeberry/hash": "*",
    "@typeberry/jamnp-s": "*",
    "@typeberry/logger": "*",
    "@typeberry/networking": "*",
    "@typeberry/listener": "*",
    "@typeberry/numbers": "*",
    "@typeberry/state-merkleization": "*",
    "@typeberry/utils": "*"
  },
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
