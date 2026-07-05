---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/telemetry/package.json#L1-L19
title: packages/core/telemetry/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 0d2317da2bf2bfae70144d1f82fd7a1fbc9359206ca5495e8b7f22b5e082b35c
language: json
---
`packages/core/telemetry/package.json` (lines 1–19)

```json
{
  "name": "@typeberry/telemetry",
  "version": "0.10.0",
  "description": "OpenTelemetry initialization utilities for Typeberry",
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "main": "index.ts",
  "type": "module",
  "dependencies": {
    "@opentelemetry/auto-instrumentations-node": "^0.77.0",
    "@opentelemetry/exporter-metrics-otlp-http": "^0.219.0",
    "@opentelemetry/resources": "^2.2.0",
    "@opentelemetry/sdk-metrics": "^2.2.0",
    "@opentelemetry/sdk-node": "^0.219.0",
    "@opentelemetry/semantic-conventions": "^1.38.0",
    "@typeberry/logger": "*",
    "@typeberry/utils": "*"
  }
}
```
