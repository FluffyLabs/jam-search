---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/asconfig.json#L1-L13'
title: sdk/asconfig.json
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 5e0377e79379c44e0480b663ba8a6d3d3dcfda2408d6b5de426f3dbead61b7b1
language: json
---
`sdk/asconfig.json` (lines 1–13)

```json
{
  "targets": {
    "test": {
      "outFile": "build/test.wasm",
      "textFile": "build/test.wat",
      "sourceMap": true,
      "debug": true
    }
  },
  "options": {
    "bindings": "esm"
  }
}
```
