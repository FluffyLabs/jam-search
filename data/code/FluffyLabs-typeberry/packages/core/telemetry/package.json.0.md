---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/telemetry/package.json#L1-L19
title: packages/core/telemetry/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 423f172ff2d9c5b3436630a12e1b9396960b10de2b4a4db8397418de544fa09d
language: json
---
`packages/core/telemetry/package.json` (lines 1–19)

```json
{
  "name": "@typeberry/telemetry",
  "version": "0.7.0",
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
