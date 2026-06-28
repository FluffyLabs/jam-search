---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database/value-refs.ts#L1-L90
title: packages/jam/database/value-refs.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 3
content_sha: 7ac398943a5b9e9f9f2de57205079f0eb005b8c8ae49cf102de9855fd21fd613
language: typescript
---
`packages/jam/database/value-refs.ts` (lines 1–90)

```typescript
import type { HeaderHash } from "@typeberry/block";
import { HashDictionary } from "@typeberry/collections";
import type { ValueHash } from "@typeberry/trie";

/** The value hashes a single block introduced and stopped referencing. */
export interface ValueDelta {
  /** Value hashes (non-embedded) that the block started referencing. */
  inserted: ValueHash[];
  /** Value hashes (non-embedded) that the block stopped referencing. */
  removed: ValueHash[];
}

/**
 * Synchronous, read-only view of the persisted refcounting state.
 *
 * Both LMDB and fjall offer synchronous reads, so reads can go straight
 * to the backing store. All writes go through `ValueRefsUpdate` batches
 * instead, since persistent backends can only write asynchronously
 * (LMDB transactions, fjall inserts + persist).
 */
export interface ValueRefsReader {
  /** How many leaves of the finalized-tip state reference the value. Missing keys read as `0`. */
  getFinalizedCount(hash: ValueHash): number;
  /** How many surviving, not-yet-finalized blocks inserted the value. Missing keys read as `0`. */
  getPendingCount(hash: ValueHash): number;
  /** The value delta of a not-yet-finalized block, if known. */
  getDelta(header: HeaderHash): ValueDelta | undefined;
}

/**
 * A batch of refcounting mutations produced by a single `ValueRefs` operation.
 *
 * The backend is responsible for applying the batch using its own write
 * primitive - ideally atomically with the state write that triggered it
 * (one LMDB transaction, one fjall persist).
 *
 * Counts are absolute values rather than increments, so applying the same
 * update more than once (e.g. on crash-replay) is harmless.
 *
 * When atomicity is not available, apply in field order and `removeValues`
 * strictly last: a crash after counts are persisted but before values are
 * removed only leaks values, while the opposite order could drop a value
 * the persisted counts still consider referencd.
 */
export interface ValueRefsUpdate {
  /** New absolute finalized counts. Count `0` means the entry should be removed. */
  finalizedCounts: [ValueHash, number][];
  /** New absolute pending counts. Count `0` means the entry should be removed. */
  pendingCounts: [ValueHash, number][];
  /** Deltas of freshly imported blocks to persist. */
  setDeltas: [HeaderHash, ValueDelta][];
  /** Deltas consumed by finalization or fork pruning. */
  removeDeltas: HeaderHash[];
  /** Values that are no longer referenced and can be removed from the values DB. */
  removeValues: ValueHash[];
}

/** `true` if applying the update would not change anything. */
export function isEmptyUpdate(update: ValueRefsUpdate): boolean {
  return (
    update.finalizedCounts.length === 0 &&
    update.pendingCounts.length === 0 &&
    update.setDeltas.length === 0 &&
    update.removeDeltas.length === 0 &&
    update.removeValues.length === 0
  );
}

/**
 * Decides when a content-addressed value can be removed from the values DB.
 *
 * A value is needed as long as some surviving state references it. Surviving
 * states are the finalized tip plus its unfinalized descendants, so we track:
 * - `finalized`: how many leaves in the current finalized-tip state reference V,
 *   advanced strictly by replaying finalized blocks' deltas (never on prune);
 * - `pending`: how many surviving, not-yet-finalized blocks inserted V (an
 *   over-approximation of unfinalized references).
 *
 * A value is removable exactly when both counts reach zero.
 *
 * This class only makes decisions: every operation reads the current state
 * through `ValueRefsReader` and returns a `ValueRefsUpdate` describing what
 * should change. Nothing is written here - the owning backend applies the
 * update with whatever consistency guarantees it can provide.
 */
export class ValueRefs {
  constructor(private readonly reader: ValueRefsReader) {}

  /** Record values referenced by the genesis / initial finalized state. */
  onInitial(inserted: ValueHash[]): ValueRefsUpdate {
```
