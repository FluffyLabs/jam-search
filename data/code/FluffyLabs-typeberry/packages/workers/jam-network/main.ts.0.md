---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/jam-network/main.ts#L1-L78
title: packages/workers/jam-network/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: f33086ab223d64e9af6ef9e6f74ff83bee4607f361212ea8ff07a3a40ccd6e3a
language: typescript
---
`packages/workers/jam-network/main.ts` (lines 1–78)

```typescript
import type { AuthorshipComms } from "@typeberry/comms-authorship-network";
import { parseBootnode } from "@typeberry/config-node";
import { ed25519, initWasm } from "@typeberry/crypto";
import { setup } from "@typeberry/jamnp-s";
import { Logger } from "@typeberry/logger";
import type { WorkerConfig } from "@typeberry/workers-api";
import type { NetworkingConfig, NetworkingInternal } from "./protocol.js";

const logger = Logger.new(import.meta.filename, "net");

/**
 * JAM networking worker.
 *
 * The worker is responsible for setting up the UDP networking socket
 * (using `typeberry/networking` package) and adding relevant JAMNP-s
 * stream handlers.
 */
export async function main(
  config: WorkerConfig<NetworkingConfig>,
  comms: NetworkingInternal,
  authorshipComms: AuthorshipComms,
) {
  await initWasm();
  logger.trace`🛜 Network starting`;

  // Await the configuration object
  const chainSpec = config.chainSpec;
  const db = config.openDatabase();
  const blocks = db.getBlocksDb();
  const params = config.workerParams;
  const key = await ed25519.privateKey(params.key);

  logger.info`🛜 Listening at ${params.host}:${params.port}`;
  const network = await setup(
    {
      host: params.host,
      port: params.port,
    },
    params.genesisHeaderHash,
    key,
    params.bootnodes.map(parseBootnode).filter((node) => node.host !== params.host || node.port !== params.port),
    chainSpec,
    blocks,
    async (blocks) => await comms.sendBlocks(blocks),
  );

  const waitForFinish = new Promise<void>((resolve) => {
    comms.setOnFinish(async () => resolve());
  });

  // send notifications about imported headers
  comms.setOnNewHeader(async (header) => {
    network.syncTask.broadcastHeader(header);
  });

  // Handle tickets received directly from block-authorship (bypasses main thread)
  authorshipComms.setOnTickets(async ({ epochIndex, tickets }) => {
    logger.log`Received ${tickets.length} tickets directly from block-authorship for epoch ${epochIndex}`;
    for (const ticket of tickets) {
      network.ticketTask.addTicket(epochIndex, ticket);
    }
  });

  // Relay tickets received from peers back to block-authorship (one ticket at a time).
  // Returns the validation result so ticket-distribution knows whether to redistribute.
  network.ticketTask.setOnTicketReceived(async (epochIndex, ticket) => {
    return await authorshipComms.sendReceivedTickets({ epochIndex, ticket });
  });

  await network.network.start();

  // stop the network when the worker is finishing.
  await waitForFinish;
  await network.network.stop();
  await db.close();

  logger.info`🛜 Network worker finished. Closing channel.`;
}
```
