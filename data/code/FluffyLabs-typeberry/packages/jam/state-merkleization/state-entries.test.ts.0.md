---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/state-entries.test.ts#L1-L72
title: packages/jam/state-merkleization/state-entries.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 444d99ba9382f8c9e56135a230235b399033af53957ac688b7d1a378d7cc450b
language: typescript
---
`packages/jam/state-merkleization/state-entries.test.ts` (lines 1–72)

```typescript
import assert, { deepEqual } from "node:assert";
import { before, describe, it } from "node:test";
import { Bytes } from "@typeberry/bytes";
import { asKnownSize } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import { Blake2b, HASH_SIZE, TRUNCATED_HASH_SIZE } from "@typeberry/hash";
import type { State } from "@typeberry/state";
import { tryAsPerCore } from "@typeberry/state/common.js";
import { TEST_STATE, TEST_STATE_ROOT, testState } from "@typeberry/state/test.utils.js";
import { serializeStateUpdate } from "./serialize-state-update.js";
import { SerializedState } from "./serialized-state.js";
import { StateEntries } from "./state-entries.js";

const spec = tinyChainSpec;

let blake2b: Blake2b;

before(async () => {
  blake2b = await Blake2b.createHasher();
});

describe("State Serialization", () => {
  it("should load and serialize the test state", () => {
    const state = testState();
    const serialized = StateEntries.serializeInMemory(spec, blake2b, state);
    for (const [actualKey, actualValue] of serialized) {
      let foundKey = false;
      for (const [expectedKey, expectedValue, details] of TEST_STATE) {
        if (actualKey.isEqualTo(Bytes.parseBytes(expectedKey.substring(0, 64), TRUNCATED_HASH_SIZE))) {
          deepEqual(actualValue.toString(), expectedValue, `Error while in test state at ${actualKey}: ${details}`);
          foundKey = true;
          break;
        }
      }
      if (!foundKey) {
        throw new Error(`Unexpected key: ${actualKey} not found in the test state!`);
      }
    }
  });

  it("should update the state", () => {
    const serialized = StateEntries.serializeInMemory(spec, blake2b, testState());
    assert.strictEqual(serialized.getRootHash(blake2b).toString(), TEST_STATE_ROOT);

    const authPools: State["authPools"] = tryAsPerCore(
      [asKnownSize([Bytes.fill(HASH_SIZE, 12).asOpaque()]), asKnownSize([Bytes.fill(HASH_SIZE, 15).asOpaque()])],
      spec,
    );
    const update = serializeStateUpdate(spec, blake2b, { authPools });

    // when
    serialized.applyUpdate(update);

    // check the value
    const state = SerializedState.fromStateEntries(spec, blake2b, serialized);
    assert.deepStrictEqual(state.authPools, authPools);

    const expectedRoot = "0xf1dff0f8d8d5470aa6fc381d07e644f5b2f7a32bf06a7cf1dc664fe4b6298402";

    assert.strictEqual(serialized.getRootHash(blake2b).toString(), expectedRoot);
  });
});

describe("State Merkleization", () => {
  it("should load and merkelize the test state", () => {
    const state = testState();
    const serialized = StateEntries.serializeInMemory(spec, blake2b, state);
    const stateRoot = serialized.getRootHash(blake2b);

    assert.strictEqual(stateRoot.toString(), TEST_STATE_ROOT);
  });
});
```
