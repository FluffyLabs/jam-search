---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/all-ecalli/asconfig.json#L1-L30
title: examples/all-ecalli/asconfig.json
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2244063e2c691912b67d0cc0db4c5014de037b98ba8e10d4f808fa454e244290
language: json
---
`examples/all-ecalli/asconfig.json` (lines 1–30)

```json
{
  "entries": ["assembly/index.ts"],
  "targets": {
    "debug": {
      "outFile": "build/debug.wasm",
      "textFile": "build/debug.wat",
      "sourceMap": true,
      "debug": true
    },
    "release": {
      "outFile": "build/release.wasm",
      "textFile": "build/release.wat",
      "sourceMap": true,
      "optimizeLevel": 3,
      "shrinkLevel": 2,
      "converge": true,
      "noAssert": true
    },
    "test": {
      "outFile": "build/test.wasm",
      "textFile": "build/test.wat",
      "sourceMap": true,
      "debug": true
    }
  },
  "options": {
    "bindings": "esm",
    "maximumMemory": 16
  }
}
```
