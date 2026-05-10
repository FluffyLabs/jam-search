---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/trie/trie.test.ts#L1-L108
title: packages/core/trie/trie.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 5
content_sha: 9939f3791af353f1ca223caec1e89f15ca9d1a74439784029147858e98a246b0
language: typescript
---
`packages/core/trie/trie.test.ts` (lines 1–108)

```typescript
import assert from "node:assert";
import { before, describe, it } from "node:test";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { SortedSet } from "@typeberry/collections";
import { Blake2b, HASH_SIZE, type OpaqueHash, TRUNCATED_HASH_SIZE } from "@typeberry/hash";
import { deepEqual } from "@typeberry/utils";
import { getBlake2bTrieHasher } from "./hasher.js";
import { type InputKey, LeafNode, parseInputKey } from "./nodes.js";
import type { TrieHasher } from "./nodesDb.js";
import { findSharedPrefix, InMemoryTrie, leafComparator } from "./trie.js";

let blake2bTrieHasher: TrieHasher;

before(async () => {
  const blake2b = await Blake2b.createHasher();
  blake2bTrieHasher = getBlake2bTrieHasher(blake2b);
});

describe("Root hash", () => {
  it("should compute state root hash that is equal to the trie one (complex)", () => {
    const data: [InputKey, BytesBlob][] = Object.entries(testVector10.input).map(([key, val]) => {
      return [parseInputKey(key), BytesBlob.parseBlobNoPrefix(val)];
    });

    const trie = InMemoryTrie.empty(blake2bTrieHasher);
    for (const [key, val] of data) {
      trie.set(key.asOpaque(), val);
    }
    const expected = trie.getRootHash();

    const leaves = SortedSet.fromArray(
      leafComparator,
      data.map(([key, value]) => {
        return InMemoryTrie.constructLeaf(blake2bTrieHasher, key.asOpaque(), value);
      }),
    );

    deepEqual(InMemoryTrie.computeStateRoot(blake2bTrieHasher, leaves), expected);
    deepEqual(`0x${testVector10.output}`, expected.toString());
  });

  it("should compute state root hash that is equal to the trie one (simple)", () => {
    const data: [OpaqueHash, BytesBlob][] = [
      [Bytes.fill(HASH_SIZE, 5), BytesBlob.blobFromString("five")],
      [Bytes.fill(HASH_SIZE, 1), BytesBlob.blobFromString("one")],
      [Bytes.fill(HASH_SIZE, 3), BytesBlob.blobFromString("three")],
    ];

    const trie = InMemoryTrie.empty(blake2bTrieHasher);
    for (const [key, val] of data) {
      trie.set(key.asOpaque(), val);
    }
    const expected = trie.getRootHash();

    const leaves = SortedSet.fromArray(
      leafComparator,
      data.map(([key, value]) => {
        return InMemoryTrie.constructLeaf(blake2bTrieHasher, key.asOpaque(), value);
      }),
    );

    deepEqual(InMemoryTrie.computeStateRoot(blake2bTrieHasher, leaves), expected);
  });

  it("should find shared prefix bits number", () => {
    const examples: [string, string, number][] = [
      [
        "0x03345958f90731bce89d07c2722dc693425a541b5230f99a6867882993576a",
        "0x3e7d409b9037b1fd870120de92ebb7285219ce4526c54701b888c5a13995f7",
        2,
      ],
      [
        "0x3e7d409b9037b1fd870120de92ebb7285219ce4526c54701b888c5a13995f7",
        "0x5dffe0e2c9f089d30e50b04ee562445cf2c0e7e7d677580ef0ccf2c6fa3522",
        1,
      ],
      [
        "0x5dffe0e2c9f089d30e50b04ee562445cf2c0e7e7d677580ef0ccf2c6fa3522",
        "0x6bf8460545baf5b0af874ebbbd56ae09ee73cd24926b4549238b797b447e05",
        2,
      ],
      [
        "0x6bf8460545baf5b0af874ebbbd56ae09ee73cd24926b4549238b797b447e05",
        "0x7723a8383e43a1713eb920bae44880b2ae9225ea2d38c031cf3b22434b4507",
        3,
      ],
      [
        "0x7723a8383e43a1713eb920bae44880b2ae9225ea2d38c031cf3b22434b4507",
        "0xc2d3bda8f77cc483d2f4368cf998203097230fd353d2223e5a333eb58f76a4",
        0,
      ],
      [
        "0xc2d3bda8f77cc483d2f4368cf998203097230fd353d2223e5a333eb58f76a4",
        "0xc7a04effd2c0cede0279747f58bd210d0cc9d65c2eba265c6b4dfbc058a704",
        5,
      ],
    ];

    for (const [left, right, len] of examples) {
      const a = Bytes.parseBytes(left, TRUNCATED_HASH_SIZE).asOpaque();
      const b = Bytes.parseBytes(right, TRUNCATED_HASH_SIZE).asOpaque();
      const actual = findSharedPrefix(a, b);
      assert.strictEqual(actual, len, `Expected shared prefix of ${len}, got: ${actual}. Values:\n${a}\n${b}.`);
    }
  });
});

describe("Root hash", () => {
```
