---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/ticket-generator/bootstrap-main.ts#L1-L38
title: packages/workers/block-authorship/ticket-generator/bootstrap-main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: bc7f7b0e4178a722aa71173b85e29ad482b06a703bd28733368f2713ea9e6a7b
language: typescript
---
`packages/workers/block-authorship/ticket-generator/bootstrap-main.ts` (lines 1–38)

```typescript
// biome-ignore-all lint/suspicious/noConsole: worker bootstrap
//
// Worker-thread entry point for parallel ticket generation. Spawned by
// `TicketGeneratorPool` (via the `.mjs` bootstrap), it initialises the native
// bandersnatch binding once and then answers shard requests by running
// `batchGenerateRingVrfForValidators` and returning the raw signature bytes.

import { ConcurrentWorker } from "@typeberry/concurrent";
import { initWasm } from "@typeberry/crypto";
import { BandernsatchWasm } from "@typeberry/safrole/bandersnatch-wasm.js";
import { type TicketGenShardParams, TicketGenShardResult } from "./protocol.js";

async function main() {
  await initWasm();
  const bandersnatch = await BandernsatchWasm.new();

  const worker = ConcurrentWorker.new<TicketGenShardParams, TicketGenShardResult, BandernsatchWasm>(
    async (params, bs) => {
      const signatures = await bs.batchGenerateRingVrfForValidators(
        params.ringKeysData,
        params.proverKeyIndices,
        params.secretSeedsData,
        params.secretSeedDataLen,
        params.inputsData,
        params.vrfInputDataLen,
      );
      return new TicketGenShardResult(signatures);
    },
    bandersnatch,
  );

  worker.listenToParentPort();
}

main().catch((e) => {
  console.error("ticket-generator worker failed to start:", e);
  process.exit(1);
});
```
