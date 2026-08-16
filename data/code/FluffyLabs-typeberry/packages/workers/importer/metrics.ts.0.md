---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/metrics.ts#L1-L93
title: packages/workers/importer/metrics.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 317148b65c827d665319d9c1b8a7bcaaebc62884924c51df9ecb11dfcd27f3f7
language: typescript
---
`packages/workers/importer/metrics.ts` (lines 1–93)

```typescript
import { metrics } from "@opentelemetry/api";
import { version } from "@typeberry/utils";

/**
 * Block importer metrics for JAM implementation.
 *
 * https://github.com/polkadot-fellows/JIPs/blob/main/JIP-3.md#block-authoringimporting-events
 */

export function createMetrics() {
  const meter = metrics.getMeter("@typeberry/importer", version);

  const blockVerificationDuration = meter.createHistogram("jam.blockVerificationTime", {
    description: "Duration of block verification",
    unit: "ms",
  });

  const blockExecutionDuration = meter.createHistogram("jam.blockExecutionTime", {
    description: "Duration of block execution",
    unit: "ms",
  });

  const blockExecutionCost = meter.createHistogram("jam.blockExecutionGas", {
    description: "Block execution cost (gas)",
    unit: "gas",
  });

  const blockImportDuration = meter.createHistogram("jam.blockImportTime", {
    description: "Total duration of block import (verification + execution)",
    unit: "ms",
  });

  // JIP-3

  // 43
  const blockImportingCounter = meter.createCounter("jam.jip3.importing", {
    description: "Block importing started",
    unit: "blocks",
  });

  // 44
  const blockVerificationFailedCounter = meter.createCounter("jam.jip3.verification_failed", {
    description: "Block verification failed",
    unit: "errors",
  });

  // 45
  const blockVerifiedCounter = meter.createCounter("jam.jip3.verified", {
    description: "Block verified successfully",
    unit: "blocks",
  });

  // 46
  const blockExecutionFailedCounter = meter.createCounter("jam.jip3.execution_failed", {
    description: "Block execution failed",
    unit: "errors",
  });

  // 47
  const blockExecutedCounter = meter.createCounter("jam.jip3.executed", {
    description: "Block executed successfully",
    unit: "blocks",
  });

  return {
    recordBlockImportComplete(totalDurationMs: number, success: boolean): void {
      blockImportDuration.record(totalDurationMs, { success });
    },

    recordBlockImportingStarted(slot: number): void {
      blockImportingCounter.add(1, { slot });
    },

    recordBlockVerificationFailed(reason: string): void {
      blockVerificationFailedCounter.add(1, { reason });
    },

    recordBlockVerified(durationMs: number): void {
      blockVerifiedCounter.add(1);
      blockVerificationDuration.record(durationMs);
    },

    recordBlockExecutionFailed(reason: string): void {
      blockExecutionFailedCounter.add(1, { reason });
    },

    recordBlockExecuted(durationMs: number, cost: number): void {
      blockExecutedCounter.add(1);
      blockExecutionDuration.record(durationMs);
      blockExecutionCost.record(cost);
    },
  };
}
```
