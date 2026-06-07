---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/trie/trie.test.ts#L102-L212
title: packages/core/trie/trie.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 1
chunk_total: 5
content_sha: e83c7aa3e19add0388c7f69a12f77b7a26a37cb9f8b25bb1021ad42cdd1f436f
language: typescript
---
`packages/core/trie/trie.test.ts` (lines 102–212)

```typescript
      const actual = findSharedPrefix(a, b);
      assert.strictEqual(actual, len, `Expected shared prefix of ${len}, got: ${actual}. Values:\n${a}\n${b}.`);
    }
  });
});

describe("Root hash", () => {
  it("should compute state root hash that is equal to the trie one", () => {
    const data: [OpaqueHash, BytesBlob][] = [
      [Bytes.fill(HASH_SIZE, 5), BytesBlob.blobFromString("five")],
      [Bytes.fill(HASH_SIZE, 1), BytesBlob.blobFromString("one")],
      [Bytes.fill(HASH_SIZE, 3), BytesBlob.blobFromString("three")],
      [Bytes.fill(HASH_SIZE, 4), BytesBlob.blobFromString("four")],
      [Bytes.fill(HASH_SIZE, 2), BytesBlob.blobFromString("two")],
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
});

describe("Trie", () => {
  it("Empty trie", () => {
    const trie = InMemoryTrie.empty(blake2bTrieHasher);

    assert.deepStrictEqual(
      trie.getRootHash(),
      Bytes.parseBytesNoPrefix("0000000000000000000000000000000000000000000000000000000000000000", 32),
    );
  });

  it("Leaf Node", () => {
    const key = parseInputKey("16c72e0c2e0b78157e3a116d86d90461a199e439325317aea160b30347adb8ec");
    const value = BytesBlob.parseBlob("0x4227b4a465084852cd87d8f23bec0db6fa7766b9685ab5e095ef9cda9e15e49dff");
    const valueHash = () => blake2bTrieHasher.hashConcat(value.raw).asOpaque();
    const node = LeafNode.fromValue(key, value, valueHash);

    assert.deepStrictEqual(
      node.getKey(),
      Bytes.parseBytes("0x16c72e0c2e0b78157e3a116d86d90461a199e439325317aea160b30347adb8", 31),
    );
    assert.deepStrictEqual(node.getValueLength(), 0);
    assert.deepStrictEqual(node.getValue().raw, Bytes.zero(0).raw);
    assert.deepStrictEqual(node.getValueHash(), valueHash());
  });

  it("Empty value", () => {
    const trie = InMemoryTrie.empty(blake2bTrieHasher);

    trie.set(
      parseInputKey("16c72e0c2e0b78157e3a116d86d90461a199e439325317aea160b30347adb8ec"),
      BytesBlob.blobFromNumbers([]),
    );

    assert.deepStrictEqual(
      trie.getRootHash().toString(),
      Bytes.parseBytesNoPrefix("99ecb1509d2cbc16bab389714e5933932977e742472fcd9277d67f45699e076a", 32).toString(),
    );
  });

  it("Should import some keys", () => {
    const trie = InMemoryTrie.empty(blake2bTrieHasher);

    trie.set(
      parseInputKey("645eece27fdce6fd3852790131a50dc5b2dd655a855421b88700e6eb43279ad9"),
      BytesBlob.blobFromNumbers([0x72]),
    );

    assert.deepStrictEqual(
      trie.getRootHash().toString(),
      Bytes.parseBytesNoPrefix("e9a89ab2f10d45a46d47127110e8353d6443b635b08e989a743c27bb82740d7d", 32).toString(),
    );
  });

  it("Non embedded leaf", () => {
    const trie = InMemoryTrie.empty(blake2bTrieHasher);

    trie.set(
      parseInputKey("3dbc5f775f6156957139100c343bb5ae6589af7398db694ab6c60630a9ed0fcd"),
      BytesBlob.parseBlob("0x4227b4a465084852cd87d8f23bec0db6fa7766b9685ab5e095ef9cda9e15e49d"),
    );

    assert.deepStrictEqual(
      trie.getRootHash().toString(),
      Bytes.parseBytesNoPrefix("5fd68f074c914741601931d64c6c772c18ab8a4cd0cd3a4fff0611a5d97ecc94", 32).toString(),
    );
  });

  it("More complicated trie", () => {
    const trie = InMemoryTrie.empty(blake2bTrieHasher);

    trie.set(
      parseInputKey("f2a9fcaf8ae0ff770b0908ebdee1daf8457c0ef5e1106c89ad364236333c5fb3"),
      BytesBlob.parseBlob(
        "0x22c62f84ee5775d1e75ba6519f6dfae571eb1888768f2a203281579656b6a29097f7c7e2cf44e38da9a541d9b4c773db8b71e1d3",
      ),
    );
    trie.set(
      parseInputKey("f3a9fcaf8ae0ff770b0908ebdee1daf8457c0ef5e1106c89ad364236333c5fb3"),
```
