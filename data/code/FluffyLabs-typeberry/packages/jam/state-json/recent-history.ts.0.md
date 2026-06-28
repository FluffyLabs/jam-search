---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-json/recent-history.ts#L1-L68
title: packages/jam/state-json/recent-history.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 1a07a678f28988a7cf7cb28e5e0f0ac8bb698cf0a20b6b7a51fcce50ff8f23e2
language: typescript
---
`packages/jam/state-json/recent-history.ts` (lines 1–68)

```typescript
import type { HeaderHash, StateRootHash } from "@typeberry/block";
import { type ExportsRootHash, type WorkPackageHash, WorkPackageInfo } from "@typeberry/block/refine-context.js";
import { fromJson } from "@typeberry/block-json";
import { HashDictionary } from "@typeberry/collections";
import type { KeccakHash } from "@typeberry/hash";
import { json } from "@typeberry/json-parser";
import { BlockState, type BlocksState, RecentBlocks } from "@typeberry/state";

export const reportedWorkPackageFromJson = json.object<JsonReportedWorkPackageInfo, WorkPackageInfo>(
  {
    hash: fromJson.bytes32(),
    exports_root: fromJson.bytes32(),
  },
  ({ hash, exports_root }) => {
    return WorkPackageInfo.create({ workPackageHash: hash, segmentTreeRoot: exports_root });
  },
);

type JsonReportedWorkPackageInfo = {
  hash: WorkPackageHash;
  exports_root: ExportsRootHash;
};

const recentBlockStateFromJson = json.object<JsonRecentBlockState, BlockState>(
  {
    header_hash: fromJson.bytes32(),
    beefy_root: fromJson.bytes32(),
    state_root: fromJson.bytes32(),
    reported: json.array(reportedWorkPackageFromJson),
  },
  ({ header_hash, beefy_root, state_root, reported }) => {
    return BlockState.create({
      headerHash: header_hash,
      accumulationResult: beefy_root,
      postStateRoot: state_root,
      reported: HashDictionary.fromEntries(reported.map((x) => [x.workPackageHash, x])),
    });
  },
);

type JsonRecentBlockState = {
  header_hash: HeaderHash;
  beefy_root: KeccakHash;
  state_root: StateRootHash;
  reported: WorkPackageInfo[];
};

export const recentBlocksHistoryFromJson = json.object<JsonRecentBlocks, RecentBlocks>(
  {
    history: json.array(recentBlockStateFromJson),
    mmr: {
      peaks: json.array(json.nullable(fromJson.bytes32())),
    },
  },
  ({ history, mmr }) => {
    return RecentBlocks.create({
      blocks: history,
      accumulationLog: mmr,
    });
  },
);

type JsonRecentBlocks = {
  history: BlocksState;
  mmr: {
    peaks: Array<KeccakHash | null>;
  };
};
```
