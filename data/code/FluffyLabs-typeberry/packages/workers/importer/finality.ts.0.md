---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/finality.ts#L1-L107
title: packages/workers/importer/finality.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 2
content_sha: f3bb3c47723f002b16a9ec484d0968b54947588f80c7e1f7c913cbebcc0b0d0d
language: typescript
---
`packages/workers/importer/finality.ts` (lines 1–107)

```typescript
import type { HeaderHash } from "@typeberry/block";
import type { BlocksDb } from "@typeberry/database";
import { Logger } from "@typeberry/logger";

const logger = Logger.new(import.meta.filename, "finality");

/** Result returned when a new block is finalized. */
export interface FinalityResult {
  /** The newly finalized block hash. */
  finalizedHash: HeaderHash;
  /** All newly finalized block hashes, ancestor-first, ending at `finalizedHash`. */
  finalizedChain: HeaderHash[];
  /** Blocks that became finalized in this round, ancestor-first. */
  newlyFinalizedHeaders: HeaderHash[];
  /** Block hashes whose states are no longer needed and can be pruned. */
  prunableStateHashes: HeaderHash[];
}

/** An abstraction for deciding which blocks are finalized. */
export interface Finalizer {
  /** Called after block import. Returns finality info if a new block was finalized, or null. */
  onBlockImported(headerHash: HeaderHash): FinalityResult | null;
}

/** An ordered sequence of block hashes forming a chain segment. */
type Chain = HeaderHash[];

/**
 * A simple finalizer that considers a block finalized when N blocks
 * have been built on top of it.
 *
 * Maintains an array of fork chains starting from the last finalized block.
 * When any chain reaches `depth`, the earliest blocks are finalized and
 * dead forks (branching from before the finalized point) are discarded.
 */
export class DummyFinalizer implements Finalizer {
  private lastFinalizedHash: HeaderHash;
  private unfinalized: Chain[] = [];

  static create(blocks: BlocksDb, depth: number): DummyFinalizer {
    return new DummyFinalizer(blocks, depth);
  }

  private constructor(
    private readonly blocks: BlocksDb,
    private readonly depth: number,
  ) {
    this.lastFinalizedHash = blocks.getBestHeaderHash();
    logger.info`🦭 Dummy Finalizer running with depth=${depth}`;
  }

  onBlockImported(headerHash: HeaderHash): FinalityResult | null {
    const header = this.blocks.getHeader(headerHash);
    if (header === null) {
      return null;
    }

    const parentHash = header.parentHeaderHash.materialize();

    // Try to attach the block to an existing chain at its tip.
    let extendedChain: Chain | null = null;
    for (const chain of this.unfinalized) {
      if (chain.length > 0 && chain[chain.length - 1].isEqualTo(parentHash)) {
        chain.push(headerHash);
        extendedChain = chain;
        break;
      }
    }

    if (extendedChain === null) {
      if (this.lastFinalizedHash.isEqualTo(parentHash)) {
        // Parent is the finalized block — start a new chain.
        const newChain: Chain = [headerHash];
        this.unfinalized.push(newChain);
        extendedChain = newChain;
      } else {
        // Fork from the middle of an existing chain — copy the prefix and branch.
        for (const chain of this.unfinalized) {
          const forkIdx = chain.findIndex((h) => h.isEqualTo(parentHash));
          if (forkIdx !== -1) {
            const newChain: Chain = [...chain.slice(0, forkIdx + 1), headerHash];
            this.unfinalized.push(newChain);
            extendedChain = newChain;
            break;
          }
        }
      }
    }

    if (extendedChain === null) {
      // Orphan block — cannot attach to any known chain.
      return null;
    }

    // Check if the extended chain is long enough to trigger finality.
    // We use a hysteresis of `depth`: pruning only fires when the chain
    // reaches `2 * depth`, at which point we remove `depth` blocks/states
    // at once. This avoids pruning on every single block import.
    if (extendedChain.length <= 2 * this.depth) {
      return null;
    }

    // The newly finalized block sits at index (length - 1 - depth).
    const finalizedIdx = extendedChain.length - 1 - this.depth;
    const finalizedHash = extendedChain[finalizedIdx];
    // Everything up to (and including) that index becomes finalized now.
    const finalizedChain = extendedChain.slice(0, finalizedIdx + 1);
```
