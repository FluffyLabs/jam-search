---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/trie/trie.test.ts#L304-L386
title: packages/core/trie/trie.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 3
chunk_total: 5
content_sha: e26912cedde717443ac32b6702d3d38fcf051e2da95f75a51690e2b942e0cdcf
language: typescript
---
`packages/core/trie/trie.test.ts` (lines 304–386)

```typescript
        "0x59ee947b94bcc05634d95efb474742f6cd6531766e44670ec987270a6b5a42: 0xc059ee947b94bcc05634d95efb474742f6cd6531766e44670ec987270a6b5a42a7f2482020023b85b4009884a31aea08f03b4bbdb5efd5e6ff1d63f1a86aaa53",
        "0xa3dc3bed1b0727caf428961bed11c9998ae2476d8a97fad203171b628363d9: 0x88a3dc3bed1b0727caf428961bed11c9998ae2476d8a97fad203171b628363d98a0dafa9d6ae6177000000000000000000000000000000000000000000000000",
        "0x15207c233b055f921701fc62b41a440d01dfa488016a97cc653a84afb5f94f: 0x8d15207c233b055f921701fc62b41a440d01dfa488016a97cc653a84afb5f94f157b6c821169dacabcf26690df00000000000000000000000000000000000000",
        "0xb05ff8a05bb23c0d7b177d47ce466ee58fd55c6a0351a3040cf3cbf5225aab: 0x8cb05ff8a05bb23c0d7b177d47ce466ee58fd55c6a0351a3040cf3cbf5225aab6a208734106f38b73880684b0000000000000000000000000000000000000000",
      ],
    );
  });

  it("should create trie from leaf nodes", () => {
    const data = { ...testVector9 };

    // construct the trie manually
    const trie = InMemoryTrie.empty(blake2bTrieHasher);
    for (const [key, val] of Object.entries(data)) {
      const stateKey = parseInputKey(key);
      const value = BytesBlob.parseBlobNoPrefix(val);
      trie.set(stateKey, value);
    }

    // when
    const leaves = Array.from(trie.nodes.leaves());
    const actual = InMemoryTrie.fromLeaves(blake2bTrieHasher, leaves);

    assert.deepStrictEqual(`${actual.getRootHash()}`, `${trie.getRootHash()}`);
    assert.deepStrictEqual(actual.nodes, trie.nodes);
  });

  it("should return correct leafs after updates", () => {
    const data = { ...testVector9 };

    // construct the trie manually
    const trie = InMemoryTrie.empty(blake2bTrieHasher);
    for (const [key, val] of Object.entries(data)) {
      const stateKey = parseInputKey(key);
      const value = BytesBlob.parseBlobNoPrefix(val);
      trie.set(stateKey, value);
    }
    const initialLeaves = Array.from(trie.nodes.leaves());

    // insert again
    for (const [key, val] of Object.entries(data)) {
      const stateKey = parseInputKey(key);
      const value = BytesBlob.parseBlobNoPrefix(val);
      trie.set(stateKey, value);
    }

    // when
    const leaves = Array.from(trie.nodes.leaves());
    const actual = InMemoryTrie.fromLeaves(blake2bTrieHasher, leaves);

    deepEqual(leaves.map((x) => x.getKey().toString()).sort(), initialLeaves.map((x) => x.getKey().toString()).sort());
    assert.deepStrictEqual(`${actual.getRootHash()}`, `${trie.getRootHash()}`);
    assert.deepStrictEqual(Array.from(actual.nodes.leaves()), Array.from(trie.nodes.leaves()));
  });

  it("Test vector 9", () => {
    const vector = {
      input: { ...testVector9 },
      output: "f6ac87ea6258a68bd3288cf73ac9d03419b548858c5466b1927b796f29db13fc",
    };

    runTestVector(vector);
  });

  it("Test vector 10", () => {
    runTestVector(testVector10);
  });

  it("should work with shorter keys as well", () => {
    const vector = {
      input: {
        "5dffe0e2c9f089d30e50b04ee562445cf2c0e7e7d677580ef0ccf2c6fa3522":
          "bb11c256876fe10442213dd78714793394d2016134c28a64eb27376ddc147fc6044df72bdea44d9ec66a3ea1e6d523f7de71db1d05a980e001e9fa",
        df08871e8a54fde4834d83851469e635713615ab1037128df138a6cd223f12: "b8bded4e1c",
        "7723a8383e43a1713eb920bae44880b2ae9225ea2d38c031cf3b22434b4507":
          "e46ddd41a5960807d528f5d9282568e622a023b94b72cb63f0353baff189257d",
        "3e7d409b9037b1fd870120de92ebb7285219ce4526c54701b888c5a13995f73c": "9bc5d0",
        c2d3bda8f77cc483d2f4368cf998203097230fd353d2223e5a333eb58f76a4:
          "9ae1dc59670bd3ef6fb51cbbbc05f1d2635fd548cb31f72500000a",
        "6bf8460545baf5b0af874ebbbd56ae09ee73cd24926b4549238b797b447e05":
          "0964801caa928bc8c1869d60dbf1d8233233e0261baf725f2631d2b27574efc0316ce3067b4fccfa607274",
        "832c15668a451578b4c69974085280b4bac5b01e220398f06e06a1d0aff285": "4881dd3238fd6c8af1090d455e7b449a",
        c7a04effd2c0cede0279747f58bd210d0cc9d65c2eba265c6b4dfbc058a704:
```
