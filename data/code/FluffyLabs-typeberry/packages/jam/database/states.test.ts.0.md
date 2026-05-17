---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database/states.test.ts#L1-L19
title: packages/jam/database/states.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 844d159e73e217794dcb02d4ee1e684dbee2a28d25bd61facb576a7484255297
language: typescript
---
`packages/jam/database/states.test.ts` (lines 1–19)

```typescript
import { describe, it } from "node:test";
import { Bytes } from "@typeberry/bytes";
import { tinyChainSpec } from "@typeberry/config";
import { HASH_SIZE } from "@typeberry/hash";
import { TEST_STATE_ROOT, testState } from "@typeberry/state/test.utils.js";
import { deepEqual } from "@typeberry/utils";
import { InMemoryStates } from "./states.js";

describe("InMemoryState", () => {
  it("should write and read some state", async () => {
    const db = InMemoryStates.new(tinyChainSpec);
    const root = Bytes.parseBytes(TEST_STATE_ROOT, HASH_SIZE).asOpaque();
    deepEqual(db.getState(root), null);

    await db.insertInitialState(root, testState());

    deepEqual(db.getState(root), testState());
  });
});
```
