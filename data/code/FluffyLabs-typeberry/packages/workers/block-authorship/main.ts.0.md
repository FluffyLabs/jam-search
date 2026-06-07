---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/main.ts#L1-L110
title: packages/workers/block-authorship/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 6
content_sha: e11e273dc9f3e522ff0fa895acd3c7e9f56f244d2f25d05d544da115a8e0039e
language: typescript
---
`packages/workers/block-authorship/main.ts` (lines 1–110)

```typescript
import { setTimeout } from "node:timers/promises";
import {
  type EntropyHash,
  type Epoch,
  type PerValidator,
  type TimeSlot,
  tryAsEpoch,
  tryAsTimeSlot,
  tryAsValidatorIndex,
} from "@typeberry/block";
import type { SignedTicket } from "@typeberry/block/tickets.js";
import { BytesBlob } from "@typeberry/bytes";
import { HashDictionary } from "@typeberry/collections/hash-dictionary.js";
import { HashSet } from "@typeberry/collections/hash-set.js";
import type { NetworkingComms } from "@typeberry/comms-authorship-network";
import { type BandersnatchKey, type Ed25519Key, initWasm } from "@typeberry/crypto";
import {
  type BandersnatchSecretSeed,
  deriveBandersnatchPublicKey,
  deriveEd25519PublicKey,
  type Ed25519SecretSeed,
} from "@typeberry/crypto/key-derivation.js";
import { Blake2b, keccak } from "@typeberry/hash";
import { Logger } from "@typeberry/logger";
import { tryAsU64 } from "@typeberry/numbers";
import { Safrole } from "@typeberry/safrole";
import bandersnatchVrf from "@typeberry/safrole/bandersnatch-vrf.js";
import { BandernsatchWasm } from "@typeberry/safrole/bandersnatch-wasm.js";
import { JAM_FALLBACK_SEAL, JAM_TICKET_SEAL } from "@typeberry/safrole/constants.js";
import { type SafroleSealingKeys, SafroleSealingKeysKind, type State, type ValidatorData } from "@typeberry/state";
import { asOpaqueType, Result } from "@typeberry/utils";
import type { WorkerConfig } from "@typeberry/workers-api";
import { type BlockSealInput, Generator } from "./generator.js";
import type { BlockAuthorshipConfig, GeneratorInternal } from "./protocol.js";
import { generateTickets } from "./ticket-generator.js";

const logger = Logger.new(import.meta.filename, "author");

type Config = WorkerConfig<BlockAuthorshipConfig>;

/**
 * The `BlockAuthorship` should create new blocks and send them as signals to the main thread.
 */

type ValidatorPrivateKeys = {
  bandersnatchSecret: BandersnatchSecretSeed;
  ed25519Secret: Ed25519SecretSeed;
};

type ValidatorPublicKeys = {
  bandersnatchPublic: BandersnatchKey;
  ed25519Public: Ed25519Key;
};

type SealData = {
  key: ValidatorKeys;
  sealPayload: BlockSealInput;
  logId?: string;
};

type ValidatorKeys = ValidatorPrivateKeys & ValidatorPublicKeys;

export async function main(config: Config, comms: GeneratorInternal, networkingComms: NetworkingComms) {
  await initWasm();
  logger.info`🎁 Block Authorship running`;
  const chainSpec = config.chainSpec;
  const db = config.openDatabase();
  const blocks = db.getBlocksDb();
  const states = db.getStatesDb();

  let isFinished = false;
  comms.setOnFinish(async () => {
    isFinished = true;
  });

  // Generate blocks until the close signal is received.
  let counter = 0;
  const blake2bHasher = await Blake2b.createHasher();
  const bandersnatch = await BandernsatchWasm.new();
  const keccakHasher = await keccak.KeccakHasher.create();

  const hash = blocks.getBestHeaderHash();
  const startTime = tryAsU64(process.hrtime.bigint() / 1_000_000n);
  const startTimeSlot = states.getState(hash)?.timeslot ?? tryAsTimeSlot(0);

  const generator = Generator.new({
    chainSpec,
    bandersnatch,
    keccakHasher,
    blake2b: blake2bHasher,
    blocks,
    states,
  });

  const keys = await Promise.all(
    config.workerParams.keys.map(async (secrets) => ({
      bandersnatchSecret: secrets.bandersnatch,
      bandersnatchPublic: deriveBandersnatchPublicKey(secrets.bandersnatch),
      ed25519Secret: secrets.ed25519,
      ed25519Public: await deriveEd25519PublicKey(secrets.ed25519),
    })),
  );

  const initialHash = blocks.getBestHeaderHash();
  const initialState = states.getState(initialHash);

  logger.info`Block authorship validator keys: ${keys.map(({ bandersnatchPublic }, index) => `\n ${index}: ${bandersnatchPublic.toString()}`)}`;

  // Per-epoch cache for Tickets mode: index corresponds to position in sealingKeySeries.tickets.
  // null entry means none of our keys match that slot.
```
