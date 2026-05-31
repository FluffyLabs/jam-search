---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-json/dump.test.ts#L1-L29
title: packages/jam/state-json/dump.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2fda3aeb1599a8cceaca6c51b3c8a89d21ddee1668d9e3ae38146f924d995197
language: typescript
---
`packages/jam/state-json/dump.test.ts` (lines 1–29)

```typescript
import { strictEqual } from "node:assert";
import { before, describe, it } from "node:test";
import { tinyChainSpec } from "@typeberry/config";
import { Blake2b } from "@typeberry/hash";
import { parseFromJson } from "@typeberry/json-parser";
import { StateEntries } from "@typeberry/state-merkleization";
import { fullStateDumpFromJson } from "./dump.js";

let blake2b: Blake2b;

before(async () => {
  blake2b = await Blake2b.createHasher();
});

describe("JSON state dump", () => {
  it("should load full JSON state dump", async () => {
    const spec = tinyChainSpec;
    const dumpFile = "./dump.example.json";
    const testState = await import(dumpFile);
    const fromJson = fullStateDumpFromJson(spec);

    const parsedState = parseFromJson(testState.default, fromJson);

    const rootHash = StateEntries.serializeInMemory(spec, blake2b, parsedState).getRootHash(blake2b);

    const expectedRoot = "0xeab8f2d4aebacd4ddcb73d8b5a388e5723aff1d2bc3f4aab40e931addf1862dc";
    strictEqual(rootHash.toString(), expectedRoot);
  });
});
```
