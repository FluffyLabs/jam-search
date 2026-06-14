---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/main.ts#L1-L104
title: packages/workers/block-authorship/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 4
content_sha: bde22415b2df0cda789ec23c3db3aee21bea19cd68588ff0bd4092f7a15e39fb
language: typescript
---
`packages/workers/block-authorship/main.ts` (lines 1–104)

```typescript
import { setTimeout } from "node:timers/promises";
import {
  type Epoch,
  type PerValidator,
  type SignedTicket,
  type TimeSlot,
  tryAsTimeSlot,
  tryAsValidatorIndex,
} from "@typeberry/block";
import type { NetworkingComms } from "@typeberry/comms-authorship-network";
import type { ChainSpec } from "@typeberry/config";
import { type BandersnatchKey, initWasm } from "@typeberry/crypto";
import { Blake2b, keccak } from "@typeberry/hash";
import { Logger } from "@typeberry/logger";
import { tryAsU64, type U32 } from "@typeberry/numbers";
import { BandernsatchWasm } from "@typeberry/safrole/bandersnatch-wasm.js";
import type { ValidatorData } from "@typeberry/state";
import { VerifiedTicketPool } from "@typeberry/ticket-pool";
import type { WorkerConfig } from "@typeberry/workers-api";
import { BlockGenerator } from "./block-generator.js";
import { type EpochData, EpochTracker } from "./epoch-tracker.js";
import type { BlockAuthorshipConfig, GeneratorInternal } from "./protocol.js";
import { TicketGenerator } from "./ticket-generator/index.js";
import { BandersnatchTicketValidator } from "./ticket-validator.js";

const logger = Logger.new(import.meta.filename, "author");

type Config = WorkerConfig<BlockAuthorshipConfig>;

/**
 * The `BlockAuthorship` should create new blocks and send them as signals to the main thread.
 */

export async function main(config: Config, comms: GeneratorInternal, networkingComms: NetworkingComms) {
  await initWasm();
  logger.info`🎁 Block Authorship running`;
  const chainSpec = config.chainSpec;
  const db = config.openDatabase();
  const blocks = db.getBlocksDb();
  const states = db.getStatesDb();

  const getBestState = () => {
    const state = states.getState(blocks.getBestHeaderHash());
    if (state === null) {
      throw new Error("Authorship: State for the best block is missing. Terminating.");
    }
    return state;
  };

  const blake2bHasher = await Blake2b.createHasher();
  const bandersnatch = await BandernsatchWasm.new();
  const keccakHasher = await keccak.KeccakHasher.create();

  const epochTracker = await EpochTracker.new(chainSpec, bandersnatch, blake2bHasher, config.workerParams.keys);

  logger.info`👛 Authoring with: ${epochTracker.authoring.getBandersnatchPublicKeys().map((bandersnatchPublic, index) => `\n ${index}: ${bandersnatchPublic}`)}`;

  const generator = BlockGenerator.new({
    chainSpec,
    bandersnatch,
    keccakHasher,
    blake2b: blake2bHasher,
    blocks,
    states,
  });

  // Verified tickets for the next epoch, keyed by entropy hash (ticket id).
  const verifiedPool = VerifiedTicketPool.new();
  const ticketValidator = BandersnatchTicketValidator.new(chainSpec, bandersnatch, getBestState);
  const keys = epochTracker.authoring.getValidatorKeys().map((x) => ({
    public: x.bandersnatchPublic,
    secret: x.bandersnatchSecret,
  }));
  const ticketGenerator = await TicketGenerator.new(chainSpec, keys);

  // handling incoming tickets
  const onEpochTickets = async (epochIndex: Epoch, tickets: SignedTicket[], source: string) => {
    logger.log`[E${epochIndex}] Received (${tickets.length}) tickets from ${source}`;
    const result = await ticketValidator.validate(epochIndex, tickets);
    // add to our pool as well
    if (result.isOk) {
      verifiedPool.add(epochIndex, result.ok);
    }
    return result.isOk;
  };
  // Receive tickets from networking.
  networkingComms.setOnReceivedTickets(async ({ epochIndex, tickets }) => {
    return await onEpochTickets(epochIndex, tickets, "network");
  });

  const state = getBestState();
  const timeSlotHandler = TimeSlotHandler.new(config.workerParams.isFastForward, chainSpec, state.timeslot);
  // per-epoch cached data
  let epochData: EpochData | null = null;

  // Generate blocks until the close signal is received.
  let isFinished = false;
  comms.setOnFinish(async () => {
    isFinished = true;
  });

  let ticketGeneratorDone = Promise.resolve();

  while (!isFinished) {
```
