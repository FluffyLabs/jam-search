---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/telemetry/index.ts#L111-L129
title: packages/core/telemetry/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 3fbfc3960cbf556bca5771fa1852326f70fedafed6054b0fe4f5f755b76cd021
language: typescript
---
`packages/core/telemetry/index.ts` (lines 111–129)

```typescript
        // Disable specific instrumentations if needed
        "@opentelemetry/instrumentation-fs": {
          enabled: false, // File system instrumentation can be noisy
        },
      }),
    ],
  });

  try {
    sdk.start();
    if (config.isMain) {
      logger.info`📳 OTLP metrics will be exported to ${otlpEndpoint}`;
    }
  } catch (error) {
    logger.error`🔴 Error initializing OpenTelemetry: ${error}`;
  }

  return sdk;
}
```
