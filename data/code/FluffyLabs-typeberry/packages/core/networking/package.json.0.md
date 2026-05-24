---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/networking/package.json#L1-L26
title: packages/core/networking/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 76327c2f80aa9e77a32ce3376ae6b46c45f9027cf30008c3c895068a7194c49d
language: json
---
`packages/core/networking/package.json` (lines 1–26)

```json
{
  "name": "@typeberry/networking",
  "version": "0.7.0",
  "description": "QUIC-based p2p networking.",
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "bin": "./bin/test.ts",
  "main": "index.ts",
  "type": "module",
  "scripts": {
    "start": "tsx ./bin/test.ts",
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@matrixai/quic": "2.0.9",
    "@opentelemetry/api": "1.9.0",
    "@peculiar/webcrypto": "1.5.0",
    "@peculiar/x509": "1.12.3",
    "@typeberry/bytes": "*",
    "@typeberry/config": "*",
    "@typeberry/crypto": "*",
    "@typeberry/logger": "*",
    "@typeberry/numbers": "*",
    "@typeberry/utils": "*"
  }
}
```
