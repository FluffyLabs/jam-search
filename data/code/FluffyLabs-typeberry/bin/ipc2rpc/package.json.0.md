---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/ipc2rpc/package.json#L1-L24
title: bin/ipc2rpc/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: fdf5d15e0376415272b6d6b8717913ffb7e61c745b742b69706222ddbccb449b
language: json
---
`bin/ipc2rpc/package.json` (lines 1–24)

```json
{
  "name": "@typeberry/ipc2rpc",
  "version": "0.6.0",
  "description": "JSON-RPC adapter for the JAMCODEC-IPC interface.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/config": "*",
    "@typeberry/ext-ipc": "*",
    "@typeberry/hash": "*",
    "@typeberry/jamnp-s": "*",
    "@typeberry/logger": "*",
    "@typeberry/networking": "*",
    "json-rpc-2.0": "1.7.0"
  },
  "scripts": {
    "start": "tsx index.ts",
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
