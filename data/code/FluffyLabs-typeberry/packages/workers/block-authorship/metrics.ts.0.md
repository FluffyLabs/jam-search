---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/metrics.ts#L1-L52
title: packages/workers/block-authorship/metrics.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 7c6cccc026dbdcfebd7f8d67efb987412917de6b3093f9ae737f973cadeba67d
language: typescript
---
`packages/workers/block-authorship/metrics.ts` (lines 1–52)

```typescript
import { metrics } from "@opentelemetry/api";
import { version } from "@typeberry/utils";

/**
 * Block authoring metrics for JAM implementation.
 *
 * https://github.com/polkadot-fellows/JIPs/blob/main/JIP-3.md#block-authoringimporting-events
 */

export function createMetrics() {
  const meter = metrics.getMeter("@typeberry/block-authorship", version);

  const blockAuthoringDuration = meter.createHistogram("jam.blockAuthoringTime", {
    description: "Duration of block authoring process",
    unit: "ms",
  });

  // JIP-3

  // 40
  const blockAuthoringCounter = meter.createCounter("jam.jip3.authoring", {
    description: "Block authoring started",
    unit: "blocks",
  });

  // 41
  const blockAuthoringFailedCounter = meter.createCounter("jam.jip3.authoring_failed", {
    description: "Block authoring failed",
    unit: "errors",
  });

  // 42
  const blockAuthoredCounter = meter.createCounter("jam.jip3.authored", {
    description: "Block authored successfully",
    unit: "blocks",
  });

  return {
    recordBlockAuthoringStarted(slot: number): void {
      blockAuthoringCounter.add(1, { slot });
    },

    recordBlockAuthoringFailed(reason: string): void {
      blockAuthoringFailedCounter.add(1, { reason });
    },

    recordBlockAuthored(slot: number, durationMs: number): void {
      blockAuthoredCounter.add(1, { slot });
      blockAuthoringDuration.record(durationMs);
    },
  };
}
```
