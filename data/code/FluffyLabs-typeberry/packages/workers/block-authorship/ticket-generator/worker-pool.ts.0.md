---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/ticket-generator/worker-pool.ts#L1-L94
title: packages/workers/block-authorship/ticket-generator/worker-pool.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 2
content_sha: 2f636d5f30e76382c04a60f6b36139244e0693e97da3893719b3ad0b46851ab5
language: typescript
---
`packages/workers/block-authorship/ticket-generator/worker-pool.ts` (lines 1–94)

```typescript
import type { EntropyHash } from "@typeberry/block";
import type { SignedTicket } from "@typeberry/block/tickets.js";
import { BytesBlob } from "@typeberry/bytes";
import { Executor } from "@typeberry/concurrent";
import { type BandersnatchKey, type BandersnatchSecretSeed, SEED_SIZE } from "@typeberry/crypto";
import { Logger } from "@typeberry/logger";
import { buildTicketVrfInputs, parseTicketsBatchOutput } from "@typeberry/safrole/bandersnatch-vrf.js";
import { TicketGenShardParams, type TicketGenShardResult } from "./protocol.js";
import type { ValidatorKey } from "./ticket-generator.js";

const logger = Logger.new(import.meta.filename, "tickets-pool");

/** `.mjs` bootstrap that `tsImport`s the worker entry (worker threads need it under tsx). */
const WORKER_BOOTSTRAP = new URL("./bootstrap-ticket-generator.mjs", import.meta.url);

/**
 * Validators per shard.
 *
 * Kept small so tickets stream into the pool incrementally (and get included in
 * blocks throughout the contest period) rather than arriving in one lump when
 * generation finishes. The prover setup is re-done per shard, but that cost is
 * tiny next to the per-proof time, so finer shards add only ~1-2% overhead.
 */
const TICKET_SHARD_SIZE = 16;

/**
 * A pool of worker threads that generate ring-VRF tickets in parallel.
 *
 * Ring-VRF proof generation is a heavy, synchronous, CPU-bound native call
 * (~0.7s per validator with a large ring). Running it on the authoring thread
 * blocks block production; this pool shards the work across worker threads so
 * the main thread stays free and wall-clock time drops ~linearly with cores.
 *
 * Uses `Executor` from `@typeberry/concurrent`.
 */
export class TicketGeneratorPool {
  private constructor(
    private readonly executor: Executor<TicketGenShardParams, TicketGenShardResult>,
    /** Number of worker threads in the pool. */
    public readonly workerCount: number,
  ) {}

  /** Spawn `workerCount` worker threads (each initialises the native binding). */
  static async create(workerCount: number): Promise<TicketGeneratorPool> {
    const executor = await Executor.initialize<TicketGenShardParams, TicketGenShardResult>(WORKER_BOOTSTRAP, {
      minWorkers: workerCount,
      maxWorkers: workerCount,
    });
    return new TicketGeneratorPool(executor, workerCount);
  }

  /** Terminate all worker threads. */
  async destroy(): Promise<void> {
    await this.executor.destroy();
  }

  /**
   * Generate tickets for `validatorKeys`, sharded evenly across the pool.
   *
   * `onShardTickets` is invoked on the calling (main) thread as each shard's
   * results arrive, so tickets can be pooled/distributed incrementally rather
   * than waiting for the whole batch. Returns once every shard has settled.
   *
   * Validators whose public key is not in `ringKeys` are skipped (they cannot
   * produce valid proofs).
   */
  async generate(
    ringKeys: BandersnatchKey[],
    validatorKeys: ValidatorKey[],
    entropy: EntropyHash,
    ticketsPerValidator: number,
    onShardTickets: (tickets: SignedTicket[]) => Promise<void>,
  ): Promise<void> {
    // Resolve each validator's index within the ring (skip non-members).
    const keyToIndex = new Map<string, number>();
    for (let i = 0; i < ringKeys.length; i++) {
      keyToIndex.set(ringKeys[i].toString(), i);
    }
    const resolved: { index: number; secret: BandersnatchSecretSeed }[] = [];
    for (const vk of validatorKeys) {
      const idx = keyToIndex.get(vk.public.toString());
      if (idx === undefined) {
        continue;
      }
      resolved.push({ index: idx, secret: vk.secret });
    }
    if (resolved.length === 0) {
      return;
    }

    const { inputsData, vrfInputDataLen } = buildTicketVrfInputs(entropy, ticketsPerValidator);
    const ringKeysData = BytesBlob.blobFromParts(ringKeys.map((k) => k.raw)).raw;

    const runShard = (shard: { index: number; secret: BandersnatchSecretSeed }[]) => {
```
