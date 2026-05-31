---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/extensions/ipc/package.json#L1-L28
title: packages/extensions/ipc/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 9917c0516a6623ccdcf962dc5a755cc3270451daf1fbcf4aeed03783dacf9027
language: json
---
`packages/extensions/ipc/package.json` (lines 1–28)

```json
{
  "name": "@typeberry/ext-ipc",
  "version": "0.8.1",
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
