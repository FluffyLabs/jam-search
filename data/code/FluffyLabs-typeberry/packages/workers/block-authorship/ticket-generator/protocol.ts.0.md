---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/ticket-generator/protocol.ts#L1-L45
title: packages/workers/block-authorship/ticket-generator/protocol.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 727554c659f2af2cfe33b47744e4e4b4eae2fa6611ccc84e0a99352ee3ff7dc7
language: typescript
---
`packages/workers/block-authorship/ticket-generator/protocol.ts` (lines 1–45)

```typescript
import type { Transferable } from "node:worker_threads";

/**
 * Parameters for a single ticket-generation shard sent to a worker thread.
 */
export class TicketGenShardParams {
  constructor(
    /** Concatenated ring public keys (`ringSize * 32` bytes). */
    readonly ringKeysData: Uint8Array,
    /** Index within the ring for each validator in this shard. */
    readonly proverKeyIndices: Uint32Array,
    /** Concatenated validator secret seeds (`count * secretSeedDataLen` bytes). */
    readonly secretSeedsData: Uint8Array,
    /** Length of each secret seed in `secretSeedsData`. */
    readonly secretSeedDataLen: number,
    /** Concatenated VRF inputs, one per attempt. */
    readonly inputsData: Uint8Array,
    /** Length of each VRF input in `inputsData`. */
    readonly vrfInputDataLen: number,
  ) {}

  /**
   * No transfers: `ringKeysData` and `inputsData` are shared across all shards,
   * so transferring would detach them for the other shards.
   */
  getTransferList(): Transferable[] {
    return [];
  }
}

/** Result of a ticket-generation shard: the raw `batchGenerateRingVrfForValidators` output. */
export class TicketGenShardResult {
  constructor(
    /** Raw output: validator-major, attempt-major records of `status || signature`. */
    readonly signatures: Uint8Array,
  ) {}

  /**
   * No transfers: the native binding returns a view backed by external/WASM
   * memory that cannot be detached, so transferring it throws inside the worker.
   */
  getTransferList(): Transferable[] {
    return [];
  }
}
```
