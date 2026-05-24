---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/importer.ts#L1-L104
title: packages/workers/importer/importer.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 1b4ddeb00e11937ed445b0cc232bd3ac27d1c9718cff75361cc4c72c6cda7614
language: typescript
---
`packages/workers/importer/importer.ts` (lines 1–104)

```typescript
import { type BlockView, type HeaderHash, type HeaderView, type StateRootHash, tryAsTimeSlot } from "@typeberry/block";
import type { ChainSpec, PvmBackend } from "@typeberry/config";
import type { BlocksDb, LeafDb, StatesDb, StateUpdateError } from "@typeberry/database";
import { WithHash } from "@typeberry/hash";
import type { Logger } from "@typeberry/logger";
import type { SerializedState } from "@typeberry/state-merkleization";
import type { TransitionHasher } from "@typeberry/transition";
import { BlockVerifier, BlockVerifierError } from "@typeberry/transition/block-verifier.js";
import { DbHeaderChain, OnChain, type StfError } from "@typeberry/transition/chain-stf.js";
import { type ErrorResult, measure, now, Result, resultToString, type TaggedError } from "@typeberry/utils";
import type { Finalizer } from "./finality.js";
import * as metrics from "./metrics.js";

export enum ImporterErrorKind {
  Verifier = 0,
  Stf = 1,
  Update = 2,
}

export type ImporterError =
  | TaggedError<ImporterErrorKind.Verifier, BlockVerifierError>
  | TaggedError<ImporterErrorKind.Stf, StfError>
  | TaggedError<ImporterErrorKind.Update, StateUpdateError>;

const importerError = <Kind extends ImporterErrorKind, Err extends ImporterError["error"]>(
  kind: Kind,
  nested: ErrorResult<Err>,
) => Result.taggedError<WithHash<HeaderHash, HeaderView>, Kind, Err>(ImporterErrorKind, kind, nested);

export type ImporterOptions = {
  initGenesisFromAncestry?: boolean;
  finalizer?: Finalizer;
  pruneBlocks?: boolean;
};

/** Construction arguments for {@link Importer}. */
export type ImporterArgs = {
  spec: ChainSpec;
  pvm: PvmBackend;
  hasher: TransitionHasher;
  logger: Logger;
  blocks: BlocksDb;
  states: StatesDb<SerializedState<LeafDb>>;
  options?: ImporterOptions;
};

export class Importer {
  private readonly verifier: BlockVerifier;
  private readonly stf: OnChain;

  // TODO [ToDr] we cannot assume state reference does not change.
  private readonly state: SerializedState<LeafDb>;
  // Hash of the block that we have the posterior state for in `state`.
  private currentHash: HeaderHash;
  private readonly metrics: ReturnType<typeof metrics.createMetrics>;

  private readonly hasher: TransitionHasher;
  private readonly logger: Logger;
  private readonly blocks: BlocksDb;
  private readonly states: StatesDb<SerializedState<LeafDb>>;
  private readonly options: ImporterOptions;

  /**
   * Build an {@link Importer} connected to the best state loaded from `states`.
   *
   * Throws if the best state cannot be loaded — callers are expected to treat that
   * as a programmer error (the DB should be initialized before reaching here).
   */
  static open(args: ImporterArgs): Importer {
    const currentBestHeaderHash = args.blocks.getBestHeaderHash();
    const state = args.states.getState(currentBestHeaderHash);
    if (state === null) {
      throw new Error(`Unable to load best state from header hash: ${currentBestHeaderHash}.`);
    }
    return new Importer(args, state, currentBestHeaderHash);
  }

  private constructor(args: ImporterArgs, state: SerializedState<LeafDb>, currentBestHeaderHash: HeaderHash) {
    this.hasher = args.hasher;
    this.logger = args.logger;
    this.blocks = args.blocks;
    this.states = args.states;
    this.options = args.options ?? {};

    this.metrics = metrics.createMetrics();

    this.verifier = BlockVerifier.new(args.hasher, args.blocks);
    this.stf = OnChain.assemble({
      chainSpec: args.spec,
      state,
      hasher: args.hasher,
      options: { pvm: args.pvm, accumulateSequentially: false },
      headerChain: DbHeaderChain.new(args.blocks),
    });
    this.state = state;
    this.currentHash = currentBestHeaderHash;
    this.prepareForNextEpoch();

    args.logger.info`😎 Best time slot: ${state.timeslot} (header hash: ${currentBestHeaderHash})`;
  }

  /** Do some extra work for preparation for the next epoch. */
  public async prepareForNextEpoch() {
    try {
```
