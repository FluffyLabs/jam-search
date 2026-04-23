---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/telemetry/package.json#L1-L19
title: packages/core/telemetry/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 6ed55fd57d5c87c3af6e41482ff569a974055fdc36ae4628e40c4fdbb7833cdc
language: json
---
`packages/core/telemetry/package.json` (lines 1–19)

```json
{
  "name": "@typeberry/telemetry",
  "version": "0.5.11",
  "description": "OpenTelemetry initialization utilities for Typeberry",
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "main": "index.ts",
  "type": "module",
  "dependencies": {
    "@opentelemetry/auto-instrumentations-node": "^0.67.0",
    "@opentelemetry/exporter-metrics-otlp-http": "^0.208.0",
    "@opentelemetry/resources": "^2.2.0",
    "@opentelemetry/sdk-metrics": "^2.2.0",
    "@opentelemetry/sdk-node": "^0.208.0",
    "@opentelemetry/semantic-conventions": "^1.38.0",
    "@typeberry/logger": "*",
    "@typeberry/utils": "*"
  }
}
```
