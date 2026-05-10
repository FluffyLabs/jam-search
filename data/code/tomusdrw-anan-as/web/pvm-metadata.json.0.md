---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/web/pvm-metadata.json#L1-L12'
title: web/pvm-metadata.json
site: github.com/tomusdrw/anan-as
created_at: '2026-05-08T13:25:50+02:00'
last_modified: '2026-05-08T13:25:50+02:00'
chunk_index: 0
chunk_total: 1
content_sha: c03dd99a741f4024876d784c2c9dda22dc1d6f0f7d743c33a048a3656dddef8b
language: json
---
`web/pvm-metadata.json` (lines 1–12)

```json
{
  "name": "ananas",
  "version": "1.0.0-xxxxxx",
  "capabilities": {
    "resetJAM": true,
    "resetGeneric": true,
    "resetGenericWithMemory": true,
    "resetPolkaVM": false
  },
  "wasmBlobUrl": "./build/release.wasm",
  "wasmBlobUrl32": "./32bit/release.wasm"
}
```
