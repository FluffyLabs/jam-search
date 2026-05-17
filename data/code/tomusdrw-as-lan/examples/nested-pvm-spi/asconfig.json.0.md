---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/nested-pvm-spi/asconfig.json#L1-L30
title: examples/nested-pvm-spi/asconfig.json
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 0
chunk_total: 1
content_sha: cb54ea83b29a8f4c80dda1a2c3babee4320e23de3c9beaa7573718036c9b7e61
language: json
---
`examples/nested-pvm-spi/asconfig.json` (lines 1–30)

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
      "shrinkLevel": 1,
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
