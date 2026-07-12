---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/package.json#L1-L36
title: packages/workers/block-authorship/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: f22600fe3cc2556d7dae42f029f0d1d6446b0c009bde5677bd85453514f8beed
language: json
---
`packages/workers/block-authorship/package.json` (lines 1–36)

```json
{
  "name": "@typeberry/block-authorship",
  "version": "0.11.0",
  "description": "A test block generator simulating blocks received over the network.",
  "main": "index.ts",
  "dependencies": {
    "@opentelemetry/api": "^1.9.0",
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/comms-authorship-network": "*",
    "@typeberry/collections": "*",
    "@typeberry/concurrent": "*",
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
    "@typeberry/ticket-pool": "*",
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
