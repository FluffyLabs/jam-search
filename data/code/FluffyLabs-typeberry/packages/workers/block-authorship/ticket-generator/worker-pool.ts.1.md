---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/ticket-generator/worker-pool.ts#L91-L134
title: packages/workers/block-authorship/ticket-generator/worker-pool.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 2
content_sha: 58e5295ecc9a1ca4cb7545195a883a073c5a715ae8dee292244152dfc7126ba4
language: typescript
---
`packages/workers/block-authorship/ticket-generator/worker-pool.ts` (lines 91–134)

```typescript
    const { inputsData, vrfInputDataLen } = buildTicketVrfInputs(entropy, ticketsPerValidator);
    const ringKeysData = BytesBlob.blobFromParts(ringKeys.map((k) => k.raw)).raw;

    const runShard = (shard: { index: number; secret: BandersnatchSecretSeed }[]) => {
      const indices = Uint32Array.from(shard.map((r) => r.index));
      const secretSeedsData = BytesBlob.blobFromParts(shard.map((r) => r.secret.raw)).raw;
      const params = new TicketGenShardParams(
        ringKeysData,
        indices,
        secretSeedsData,
        SEED_SIZE,
        inputsData,
        vrfInputDataLen,
      );
      return this.executor
        .run(params)
        .then((result) => {
          const parsed = parseTicketsBatchOutput(result.signatures, indices.length, ticketsPerValidator);
          if (parsed.isError) {
            logger.warn`A ticket-generation shard returned an invalid proof: ${parsed.error}`;
            return;
          }
          return onShardTickets(parsed.ok.flat());
        })
        .catch((e) => {
          logger.warn`A ticket-generation shard failed: ${e}`;
        });
    };

    // Dispatch small shards in waves of `workerCount` so every worker stays busy
    // and tickets are delivered incrementally (one wave at a time) without
    // over-queuing the executor.
    const shardSize = Math.min(resolved.length, TICKET_SHARD_SIZE);
    const waveSize = shardSize * this.workerCount;
    for (let waveStart = 0; waveStart < resolved.length; waveStart += waveSize) {
      const wave: Promise<void>[] = [];
      const waveEnd = Math.min(waveStart + waveSize, resolved.length);
      for (let start = waveStart; start < waveEnd; start += shardSize) {
        wave.push(runShard(resolved.slice(start, start + shardSize)));
      }
      await Promise.all(wave);
    }
  }
}
```
