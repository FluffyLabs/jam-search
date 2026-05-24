---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/trie.ts#L1-L60
title: bin/test-runner/w3f/trie.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e2c6ec579fe9497b52c33a5ad0fc71329afb3021ec7fa702481fb676b1573e0c
language: typescript
---
`bin/test-runner/w3f/trie.ts` (lines 1–60)

```typescript
import assert from "node:assert";
import { test } from "node:test";

import { Bytes, BytesBlob } from "@typeberry/bytes";
import { SortedSet } from "@typeberry/collections";
import { Blake2b } from "@typeberry/hash";
import { type FromJson, json } from "@typeberry/json-parser";
import { InMemoryTrie, leafComparator, type StateKey, type TrieNodeHash } from "@typeberry/trie";
import { getBlake2bTrieHasher } from "@typeberry/trie/hasher.js";

export class TrieTest {
  static fromJson: FromJson<TrieTest> = {
    input: json.fromAny((input: unknown, context?: string): Map<StateKey, BytesBlob> => {
      if (input === null) {
        throw new Error(`[${context}] Unexpected 'null'`);
      }
      if (typeof input !== "object") {
        throw new Error(`[${context}] Expected an object.`);
      }

      const output: Map<StateKey, BytesBlob> = new Map();
      for (const [k, v] of Object.entries(input)) {
        const key = Bytes.parseBytesNoPrefix(k, 32).asOpaque<StateKey>();
        const value = BytesBlob.parseBlobNoPrefix(v);
        output.set(key, value);
      }

      return output;
    }),
    output: json.fromString((v) => Bytes.parseBytesNoPrefix(v, 32).asOpaque()),
  };
  input!: Map<StateKey, BytesBlob>;
  output!: TrieNodeHash;
}

export type TrieTestSuite = [TrieTest];
export const trieTestSuiteFromJson: FromJson<TrieTestSuite> = ["array", TrieTest.fromJson];

export async function runTrieTest(testContent: TrieTestSuite) {
  const blake2bTrieHasher = getBlake2bTrieHasher(await Blake2b.createHasher());
  for (const [id, testData] of testContent.entries()) {
    await test(`Trie test ${id}`, () => {
      const trie = InMemoryTrie.empty(blake2bTrieHasher);

      for (const [key, value] of testData.input.entries()) {
        trie.set(key, value);
      }
      assert.deepStrictEqual(trie.getRootHash(), testData.output);

      const leaves = Array.from(testData.input.entries()).map(([key, value]) => {
        return InMemoryTrie.constructLeaf(blake2bTrieHasher, key, value);
      });
      const quickStateRoot = InMemoryTrie.computeStateRoot(
        blake2bTrieHasher,
        SortedSet.fromArray(leafComparator, leaves),
      );
      assert.deepStrictEqual(quickStateRoot, testData.output);
    });
  }
}
```
