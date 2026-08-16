---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/merkleization/binary-merkleization.test.ts#L1-L60
title: packages/jam/merkleization/binary-merkleization.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 14299155d270693119f85fc6e63e3b19f4543702557a84abc9c55db024e50b5a
language: typescript
---
`packages/jam/merkleization/binary-merkleization.test.ts` (lines 1–60)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { Bytes, type BytesBlob } from "@typeberry/bytes";
import { KeccakHasher } from "@typeberry/hash/keccak.js";
import { getKeccakTrieHasher } from "@typeberry/trie/hasher.js";
import { binaryMerkleization, binaryMerkleTreeRoot } from "./binary-merkleization.js";

describe("binaryMerkleTreeRoot", () => {
  it("should return the zero value for empty input", () => {
    assert.strictEqual(
      binaryMerkleTreeRoot<string>([], "zero", (left, right) => `(${left}+${right})`),
      "zero",
    );
  });

  it("should build tree in-place", () => {
    const input = ["a", "b", "c", "d", "e"];

    const result = binaryMerkleTreeRoot(input, "zero", (left, right) => `(${left}+${right})`);

    assert.strictEqual(result, "(((a+b)+c)+(d+e))");
    assert.strictEqual(input[0], result);
  });

  it("should build a balanced tree in-place", () => {
    const input = ["a", "b", "c", "d", "e", "f", "g", "h"];

    const result = binaryMerkleTreeRoot(input, "zero", (left, right) => `(${left}+${right})`);

    assert.strictEqual(result, "(((a+b)+(c+d))+((e+f)+(g+h)))");
    assert.strictEqual(input[0], result);
  });
});

describe("binaryMerkleization", () => {
  it("should correctly calculate merkle root for empty data", async () => {
    const keccakHasher = await KeccakHasher.create();
    const trieHasher = getKeccakTrieHasher(keccakHasher);
    const expectedResult = Bytes.parseBlob("0x0000000000000000000000000000000000000000000000000000000000000000");
    const input: BytesBlob[] = [];

    const result = binaryMerkleization(input, trieHasher);

    assert.deepStrictEqual(result.raw, expectedResult.raw);
  });

  it("should correctly calculate merkle root for not empty data", async () => {
    const keccakHasher = await KeccakHasher.create();
    const trieHasher = getKeccakTrieHasher(keccakHasher);
    const expectedResult = Bytes.parseBlob("0xa2a767f02df7e04b48f5cefc5c9fd9a1997ddf14e7e49ea9c9cf72a2c24be91e");
    const input = [
      "0x03f9883f0b27478648cd19b4f812f897a26976ecf312eac28508b4368d0c63ea949c7cb0",
      "0x549611b00200000002000000010000000000000000000000000000000000000000000000",
    ].map((x) => Bytes.parseBlob(x));

    const result = binaryMerkleization(input, trieHasher);

    assert.deepStrictEqual(result.raw, expectedResult.raw);
  });
});
```
