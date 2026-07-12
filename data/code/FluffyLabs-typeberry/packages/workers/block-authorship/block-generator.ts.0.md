---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/block-generator.ts#L1-L112
title: packages/workers/block-authorship/block-generator.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 3
content_sha: d1c669631aaffe31500789f1cea0ad530f68606d0eedf5a90b42b7b733e96170
language: typescript
---
`packages/workers/block-authorship/block-generator.ts` (lines 1–112)

```typescript
import {
  Block,
  type EntropyHash,
  encodeUnsealedHeader,
  Header,
  reencodeAsView,
  type TimeSlot,
  type ValidatorIndex,
} from "@typeberry/block";
import { type BlockView, Extrinsic } from "@typeberry/block/block.js";
import { DisputesExtrinsic } from "@typeberry/block/disputes.js";
import type { SignedTicket } from "@typeberry/block/tickets.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { HashSet } from "@typeberry/collections/hash-set.js";
import type { ChainSpec } from "@typeberry/config";
import { BANDERSNATCH_VRF_SIGNATURE_BYTES, type BandersnatchSecretSeed } from "@typeberry/crypto";
import type { BlocksDb, StatesDb } from "@typeberry/database";
import type { Blake2b, keccak } from "@typeberry/hash";
import { Logger } from "@typeberry/logger";
import { Safrole } from "@typeberry/safrole";
import bandersnatchVrf, { type VrfOutputHash } from "@typeberry/safrole/bandersnatch-vrf.js";
import type { BandernsatchWasm } from "@typeberry/safrole/bandersnatch-wasm.js";
import { JAM_ENTROPY } from "@typeberry/safrole/constants.js";
import { TransitionHasher } from "@typeberry/transition";
import { asOpaqueType, now, type Opaque, Result } from "@typeberry/utils";
import * as metrics from "./metrics.js";

const EMPTY_AUX_DATA = BytesBlob.empty();
const logger = Logger.new(import.meta.filename, "author");

/**
 * Either Ticket (Safrole) or Key (fallback) seal input data.
 *
 * Passed to function V, either:
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/0e46010e4601?v=0.7.2
 * or:
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/0eac010eac01?v=0.7.2
 *
 */
export type BlockSealInput = Opaque<BytesBlob, "Seal">;

/** Construction arguments for `BlockGenerator`. */
export type GeneratorArgs = {
  chainSpec: ChainSpec;
  bandersnatch: BandernsatchWasm;
  keccakHasher: keccak.KeccakHasher;
  blake2b: Blake2b;
  blocks: BlocksDb;
  states: StatesDb;
};

export class BlockGenerator {
  private readonly metrics: ReturnType<typeof metrics.createMetrics>;

  public readonly chainSpec: ChainSpec;
  public readonly bandersnatch: BandernsatchWasm;
  public readonly keccakHasher: keccak.KeccakHasher;
  public readonly blake2b: Blake2b;
  private readonly blocks: BlocksDb;
  private readonly states: StatesDb;

  /** Build a block generator from its collaborators. */
  static new(args: GeneratorArgs) {
    return new BlockGenerator(args);
  }

  private constructor(args: GeneratorArgs) {
    this.chainSpec = args.chainSpec;
    this.bandersnatch = args.bandersnatch;
    this.keccakHasher = args.keccakHasher;
    this.blake2b = args.blake2b;
    this.blocks = args.blocks;
    this.states = args.states;
    this.metrics = metrics.createMetrics();
  }

  private getLastHeaderAndState() {
    const headerHash = this.blocks.getBestHeaderHash();
    const lastState = this.states.getState(headerHash);
    if (lastState === null) {
      throw new Error(`Missing last state at ${headerHash}! Make sure DB is initialized.`);
    }
    return {
      lastHeaderHash: headerHash,
      lastState,
    };
  }

  async nextBlockView(
    validatorIndex: ValidatorIndex,
    bandersnatchSecret: BandersnatchSecretSeed,
    sealPayload: BlockSealInput,
    timeSlot: TimeSlot,
    pendingTickets: { ticket: SignedTicket; id: EntropyHash }[] = [],
  ): Promise<BlockView> {
    const newBlock = await this.nextBlock(validatorIndex, bandersnatchSecret, sealPayload, timeSlot, pendingTickets);
    return reencodeAsView(Block.Codec, newBlock, this.chainSpec);
  }

  /**
   * Returns y(H_S) part of the VRF signature.
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/0ec7010ece01?v=0.7.2
   *
   * Note that in case of Ticket-sealing this is going to be the ticket value.
   *
   * In either case (Tickets or Keys) the value returned here DOES not depend on the header
   * data (i.e. the `aux_data`) so we are able to compute it beforehand.
   */
  private async getEntropyHash(
    sealPayload: BytesBlob,
    bandersnatchSecret: BandersnatchSecretSeed,
```
