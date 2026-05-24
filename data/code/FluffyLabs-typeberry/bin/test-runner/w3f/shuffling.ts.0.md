---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/shuffling.ts#L1-L36
title: bin/test-runner/w3f/shuffling.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 3a1f5ca84807c60479362c0293c2fdc8f1140b31ba0bcdc25e80b01804db71aa
language: typescript
---
`bin/test-runner/w3f/shuffling.ts` (lines 1–36)

```typescript
import assert from "node:assert";
import { it } from "node:test";
import { Bytes } from "@typeberry/bytes";
import { Blake2b } from "@typeberry/hash";
import { type FromJson, json } from "@typeberry/json-parser";
import { fisherYatesShuffle } from "@typeberry/shuffling";

const bytes32NoPrefix = <T extends Bytes<32>>() =>
  json.fromString<T>((v) => Bytes.parseBytesNoPrefix(v, 32).asOpaque());

class ShufflingTest {
  static fromJson: FromJson<ShufflingTest> = {
    input: "number",
    entropy: bytes32NoPrefix(),
    output: ["array", "number"],
  };

  input!: number;
  entropy!: Bytes<32>;
  output!: number[];
}

export const shufflingTestsFromJson = json.array(ShufflingTest.fromJson);

export async function runShufflingTests(testContents: ShufflingTest[]) {
  const blake2b = await Blake2b.createHasher();
  for (const testContent of testContents) {
    it(`should correctly shuffle input of length ${testContent.input}`, () => {
      const input = Array.from({ length: testContent.input }, (_, i) => i);

      const result = fisherYatesShuffle(blake2b, input, testContent.entropy);

      assert.deepStrictEqual(result, testContent.output);
    });
  }
}
```
