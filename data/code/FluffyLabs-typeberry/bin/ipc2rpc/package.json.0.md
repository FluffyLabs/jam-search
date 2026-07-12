---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/ipc2rpc/package.json#L1-L24
title: bin/ipc2rpc/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: d5d6da6fa630f2a82c22daf9386e790999798e35bc6032538c864e7cc3196008
language: json
---
`bin/ipc2rpc/package.json` (lines 1–24)

```json
{
  "name": "@typeberry/ipc2rpc",
  "version": "0.11.0",
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
