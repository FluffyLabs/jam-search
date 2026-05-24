---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/metrics.ts#L1-L46
title: packages/jam/node/metrics.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: bede120e462786c25c129322378f0117a2203c7a76b8529af231a34d93c03edf
language: typescript
---
`packages/jam/node/metrics.ts` (lines 1–46)

```typescript
import { metrics } from "@opentelemetry/api";
import { version } from "@typeberry/utils";

/**
 * Node-level metrics for JAM implementation.
 *
 * https://github.com/polkadot-fellows/JIPs/blob/main/JIP-3.md#status-events
 */

export function createMetrics() {
  const meter = metrics.getMeter("@typeberry/node", version);

  // JIP-3

  // 11
  const bestBlockChangedCounter = meter.createCounter("jam.jip3.best_block_changed", {
    description: "Best block changed events",
    unit: "events",
  });

  // 12
  const finalizedBlockChangedCounter = meter.createCounter("jam.jip3.finalized_block_changed", {
    description: "Finalized block changed events",
    unit: "events",
  });

  // 13
  const syncStatusChangedCounter = meter.createCounter("jam.jip3.sync_status_changed", {
    description: "Sync status changed events",
    unit: "events",
  });

  return {
    recordBestBlockChanged(slot: number, headerHash: string): void {
      bestBlockChangedCounter.add(1, { slot, header_hash: headerHash });
    },

    recordFinalizedBlockChanged(slot: number, headerHash: string): void {
      finalizedBlockChangedCounter.add(1, { slot, header_hash: headerHash });
    },

    recordSyncStatusChanged(synced: boolean): void {
      syncStatusChangedCounter.add(1, { synced });
    },
  };
}
```
