---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database/root.ts#L1-L14
title: packages/jam/database/root.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: d8b99158473bcfb597aa36b79b037c6a38982c3e1e746a292e1c9759130f6f4b
language: typescript
---
`packages/jam/database/root.ts` (lines 1–14)

```typescript
import type { BlocksDb } from "./blocks.js";
import type { StatesDb } from "./states.js";

/** Root database. */
export interface RootDb<TBlocks = BlocksDb, TStates = StatesDb> {
  /** Blocks DB. */
  getBlocksDb(): TBlocks;

  /** States DB. */
  getStatesDb(): TStates;

  /** Close access to the DB. */
  close(): Promise<void>;
}
```
