---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/test/e2e.ts#L1-L104'
title: bin/jam/test/e2e.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 3
content_sha: ce372fe556382bd95a91c42f918779b3b64af188960eef93d72afdba072994f7
language: typescript
---
`bin/jam/test/e2e.ts` (lines 1–104)

```typescript
import { type ChildProcess, spawn } from "node:child_process";
import { rmSync } from "node:fs";
import { test } from "node:test";
import { promises, setTimeout } from "node:timers";
import { tinyChainSpec } from "@typeberry/config";
import { Logger } from "@typeberry/logger";

const TEST_TIMEOUT = 60_000;
const SHUTDOWN_GRACE_PERIOD = 5_000;
const TARGET_BLOCK = 6;
const LOG_TAIL_LINES = 40;

const logger = Logger.new(import.meta.filename, "jam:e2e");

const bestBlockPattern = /🧊 Best:.+#(\d+)/;

test("JAM Node dev blocks with In Memory", { timeout: TEST_TIMEOUT }, async () => {
  let jamProcess: ChildProcess | null = null;
  try {
    // enable In Memory storage
    jamProcess = await start();

    // wait for specific output on the console
    await listenForBestBlocks("dev", jamProcess, (blockNum) => blockNum > TARGET_BLOCK);
  } finally {
    await terminate(jamProcess);
  }
});

test("JAM Node dev blocks with Fjall", { timeout: TEST_TIMEOUT }, async () => {
  const dbPath = "./test-db";
  let jamProcess: ChildProcess | null = null;
  try {
    // enable persistent storage (fjall by default)
    jamProcess = await start({ devIndex: "all", args: [`--config=.database_base_path="${dbPath}"`] });

    // wait for specific output on the console
    await listenForBestBlocks("dev-fjall", jamProcess, (blockNum) => blockNum > TARGET_BLOCK);
  } finally {
    await terminate(jamProcess);
    // clean up test database
    rmSync(dbPath, { recursive: true, force: true });
  }
});

test("JAM Node network connection", { timeout: TEST_TIMEOUT }, async () => {
  let jamProcess1: ChildProcess | null = null;
  let jamProcess2: ChildProcess | null = null;
  try {
    jamProcess1 = await start({ devIndex: "all" });
    // introducing some timeout, due to networking issues when started at the same time
    await promises.setTimeout(1_000);
    jamProcess2 = await start({ devIndex: null });

    // wait for the dev-mode one to start
    const proc1 = listenForBestBlocks("dev-all", jamProcess1, () => true);

    // wait for specific output on the console of the second node (should sync)
    const proc2 = listenForBestBlocks("test", jamProcess2, (blockNum) => blockNum > TARGET_BLOCK);

    await proc1;
    await proc2;
  } finally {
    await terminate(jamProcess1);
    await terminate(jamProcess2);
  }
});

test("JAM Node ticket distribution with Fjall and worker threads", { timeout: 120_000 }, async () => {
  const VALIDATOR_COUNT = tinyChainSpec.validatorsCount;
  const TICKETS_PER_VALIDATOR = tinyChainSpec.ticketsPerValidator;
  const TICKET_TEST_TIMEOUT = 110_000; // Shorter than test timeout (120s) to allow cleanup
  const processes: ChildProcess[] = [];
  const testDbParentPath = "./test-db-e2e-ticket-distribution";

  try {
    // Start 6 individual validator nodes, each with its own persistent fjall database and worker threads.
    for (let i = 0; i < VALIDATOR_COUNT; i++) {
      const dbPath = `${testDbParentPath}/validator-${i}`;
      const proc = await start({
        devIndex: i,
        args: [`--config=.database_base_path="${dbPath}"`],
        timeout: TICKET_TEST_TIMEOUT,
      });
      processes.push(proc);
      // stagger startup to avoid networking issues
      if (i < VALIDATOR_COUNT - 1) {
        await promises.setTimeout(1_000);
      }
    }

    // Tiny chain spec: 6 validators, 3 tickets per validator = 18 tickets per epoch.
    // Each validator should have all 18 tickets (their own 3 + 15 from peers via network)
    const EXPECTED_TICKETS = VALIDATOR_COUNT * TICKETS_PER_VALIDATOR;

    // Collect addTicket logs from each validator until the ticket pool is complete.
    const validatorLogPromises = processes.map((proc, i) =>
      collectTicketLogs(`validator-${i}`, proc, EXPECTED_TICKETS),
    );

    const validatorLogs = await Promise.all(validatorLogPromises);

    // Verify each validator has expected number of tickets
    for (let i = 0; i < VALIDATOR_COUNT; i++) {
```
