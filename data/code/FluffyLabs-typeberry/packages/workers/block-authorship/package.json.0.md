---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/package.json#L1-L34
title: packages/workers/block-authorship/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: aa59cfcd89c2b420951fbaef294df51bb05ec45b29b34c61413a42d2e1ec221d
language: json
---
`packages/workers/block-authorship/package.json` (lines 1–34)

```json
{
  "name": "@typeberry/block-authorship",
  "version": "0.8.4",
  "description": "A test block generator simulating blocks received over the network.",
  "main": "index.ts",
  "dependencies": {
    "@opentelemetry/api": "^1.9.0",
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/comms-authorship-network": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/crypto": "*",
    "@typeberry/database": "*",
    "@typeberry/hash": "*",
    "@typeberry/logger": "*",
    "@typeberry/numbers": "*",
    "@typeberry/safrole": "*",
    "@typeberry/state": "*",
    "@typeberry/state-merkleization": "*",
    "@typeberry/telemetry": "*",
    "@typeberry/transition": "*",
    "@typeberry/utils": "*",
    "@typeberry/workers-api": "*",
    "@typeberry/workers-api-node": "*"
  },
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```
