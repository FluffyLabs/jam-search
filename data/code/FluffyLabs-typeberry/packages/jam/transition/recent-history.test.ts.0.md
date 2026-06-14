---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/recent-history.test.ts#L1-L104
title: packages/jam/transition/recent-history.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 2
content_sha: 5867c35722301968451f343a86975d6c02568b600050fa0d908c0a6cc17779c1
language: typescript
---
`packages/jam/transition/recent-history.test.ts` (lines 1–104)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import type { WorkPackageHash, WorkPackageInfo } from "@typeberry/block/refine-context.js";
import { Bytes } from "@typeberry/bytes";
import { HashDictionary } from "@typeberry/collections";
import { HASH_SIZE, type KeccakHash, keccak } from "@typeberry/hash";
import type { MmrHasher, MmrPeaks } from "@typeberry/mmr";
import { BlockState, type BlocksState, MAX_RECENT_HISTORY, RecentBlocks } from "@typeberry/state";
import { asOpaqueType, check } from "@typeberry/utils";
import {
  RecentHistory,
  type RecentHistoryInput,
  type RecentHistoryPartialInput,
  type RecentHistoryState,
} from "./recent-history.js";
import { copyAndUpdateState } from "./test.utils.js";

const hasher: Promise<MmrHasher<KeccakHash>> = keccak.KeccakHasher.create().then((hasher) => {
  return {
    hashConcat: (a, b) => keccak.hashBlobs(hasher, [a, b]),
    hashConcatPrepend: (id, a, b) => keccak.hashBlobs(hasher, [id, a, b]),
  };
});

const asRecentHistory = (arr: BlocksState, accumulationLog?: MmrPeaks<KeccakHash>): RecentHistoryState => {
  check`${arr.length <= MAX_RECENT_HISTORY} Invalid size of the state input.`;

  return {
    recentBlocks: RecentBlocks.create({
      blocks: arr,
      accumulationLog: accumulationLog ?? {
        peaks: [],
      },
    }),
  };
};

describe("Recent History", () => {
  it("should perform a transition with empty state", async () => {
    const initialState: BlocksState = asOpaqueType([]);
    const recentHistory = new RecentHistory(await hasher, asRecentHistory(initialState));
    const partialInput: RecentHistoryPartialInput = {
      priorStateRoot: Bytes.fill(HASH_SIZE, 3).asOpaque(),
    };
    const partialUpdate = recentHistory.partialTransition(partialInput);
    const input: RecentHistoryInput = {
      partial: partialUpdate,
      headerHash: Bytes.fill(HASH_SIZE, 2).asOpaque(),
      accumulateRoot: Bytes.fill(HASH_SIZE, 1).asOpaque(),
      workPackages: HashDictionary.new(),
    };
    const stateUpdate = recentHistory.transition(input);
    const state = copyAndUpdateState(recentHistory.state, stateUpdate);

    assert.deepStrictEqual(
      state.recentBlocks,
      RecentBlocks.create({
        blocks: asOpaqueType([
          BlockState.create({
            headerHash: input.headerHash,
            accumulationResult: Bytes.fill(HASH_SIZE, 1),
            postStateRoot: Bytes.zero(HASH_SIZE).asOpaque(),
            reported: HashDictionary.new(),
          }),
        ]),
        accumulationLog: {
          peaks: [Bytes.fill(HASH_SIZE, 1)],
        },
      }),
    );
  });

  it("should perform a transition with some state", async () => {
    const firstBlock = BlockState.create({
      headerHash: Bytes.fill(HASH_SIZE, 3).asOpaque(),
      accumulationResult: Bytes.fill(HASH_SIZE, 2),
      postStateRoot: Bytes.zero(HASH_SIZE).asOpaque(),
      reported: HashDictionary.new<WorkPackageHash, WorkPackageInfo>(),
    });
    const recentHistory = new RecentHistory(
      await hasher,
      asRecentHistory(asOpaqueType([firstBlock]), { peaks: [Bytes.fill(HASH_SIZE, 1)] }),
    );
    const partialInput: RecentHistoryPartialInput = {
      priorStateRoot: Bytes.fill(HASH_SIZE, 4).asOpaque(),
    };
    const partialUpdate = recentHistory.partialTransition(partialInput);
    const input: RecentHistoryInput = {
      partial: partialUpdate,
      headerHash: Bytes.fill(HASH_SIZE, 5).asOpaque(),
      accumulateRoot: Bytes.fill(HASH_SIZE, 6).asOpaque(),
      workPackages: HashDictionary.fromEntries(
        [
          {
            workPackageHash: Bytes.fill(HASH_SIZE, 7).asOpaque(),
            segmentTreeRoot: Bytes.fill(HASH_SIZE, 8).asOpaque(),
          },
        ].map((x) => [x.workPackageHash, x]),
      ),
    };
    const stateUpdate = recentHistory.transition(input);
    const state = copyAndUpdateState(recentHistory.state, stateUpdate);

    const recentBlocks = state.recentBlocks;
```
