---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/telemetry/package.json#L1-L19
title: packages/core/telemetry/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: b7fcb3f9fd1c8ce3610096872299ecb0550f7ff967901f0d51a52b4d20c3a261
language: json
---
`packages/core/telemetry/package.json` (lines 1–19)

```json
{
  "name": "@typeberry/telemetry",
  "version": "0.9.0",
  "description": "OpenTelemetry initialization utilities for Typeberry",
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "main": "index.ts",
  "type": "module",
  "dependencies": {
    "@opentelemetry/auto-instrumentations-node": "0.76.0",
    "@opentelemetry/exporter-metrics-otlp-http": "^0.208.0",
    "@opentelemetry/resources": "^2.2.0",
    "@opentelemetry/sdk-metrics": "^2.2.0",
    "@opentelemetry/sdk-node": "0.218.0",
    "@opentelemetry/semantic-conventions": "^1.38.0",
    "@typeberry/logger": "*",
    "@typeberry/utils": "*"
  }
}
```
