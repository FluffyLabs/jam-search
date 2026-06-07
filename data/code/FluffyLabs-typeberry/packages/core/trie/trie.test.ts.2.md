---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/trie/trie.test.ts#L208-L304
title: packages/core/trie/trie.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 2
chunk_total: 5
content_sha: b9f1fe951d3f13254152f53d3e7fe3a19c5a450ec96e5dd3e16226b176815778
language: typescript
---
`packages/core/trie/trie.test.ts` (lines 208–304)

```typescript
        "0x22c62f84ee5775d1e75ba6519f6dfae571eb1888768f2a203281579656b6a29097f7c7e2cf44e38da9a541d9b4c773db8b71e1d3",
      ),
    );
    trie.set(
      parseInputKey("f3a9fcaf8ae0ff770b0908ebdee1daf8457c0ef5e1106c89ad364236333c5fb3"),
      BytesBlob.parseBlob("0x44d0b26211d9d4a44e375207"),
    );

    assert.deepStrictEqual(
      trie.getRootHash().toString(),
      Bytes.parseBytesNoPrefix("fb4bc560e0c314b09a29fc3f83a7f063ec118ff3fc1fba4430fcc0fbea09a207", 32).toString(),
    );
  });

  it("Move leaf from left to right branch", () => {
    const trie = InMemoryTrie.empty(blake2bTrieHasher);

    // left value
    trie.set(
      parseInputKey("f2a9fcaf8ae0ff770b0908ebdee1daf8457c0ef5e1106c89ad364236333c5fb3"),
      BytesBlob.parseBlob("0x23"),
    );

    // right value
    trie.set(
      parseInputKey("f1a9fcaf8ae0ff770b0908ebdee1daf8457c0ef5e1106c89ad364236333c5fb3"),
      BytesBlob.parseBlob("0x1234"),
    );

    // now insert another leaf, which causes `0xf2..` to move to the right.
    trie.set(
      parseInputKey("f0a9fcaf8ae0ff770b0908ebdee1daf8457c0ef5e1106c89ad364236333c5fb3"),
      BytesBlob.parseBlob("0x1234"),
    );

    assert.deepStrictEqual(
      trie.getRootHash().toString(),
      "0xf07003b9d508b5b017960d069ada7893146c3425be6293b7ac3d4a9709d33b47",
    );
  });

  it("Replace leaf value", () => {
    const trie = InMemoryTrie.empty(blake2bTrieHasher);
    const insert = {
      f2a9fcaf8ae0ff770b0908ebdee1daf8457c0ef5e1106c89ad364236333c5fb3: "0x23",
      f1a9fcaf8ae0ff770b0908ebdee1daf8457c0ef5e1106c89ad364236333c5fb3: "0x1234",
      f0a9fcaf8ae0ff770b0908ebdee1daf8457c0ef5e1106c89ad364236333c5fb3: "0x1234",
    };
    for (const [k, v] of Object.entries(insert)) {
      trie.set(parseInputKey(k), BytesBlob.parseBlob(v));
    }
    assert.deepStrictEqual(
      trie.getRootHash().toString(),
      "0xf07003b9d508b5b017960d069ada7893146c3425be6293b7ac3d4a9709d33b47",
    );

    // now set the same key again
    trie.set(
      parseInputKey("f2a9fcaf8ae0ff770b0908ebdee1daf8457c0ef5e1106c89ad364236333c5fb3"),
      BytesBlob.parseBlob("0x1234"),
    );
    assert.deepStrictEqual(
      trie.getRootHash().toString(),
      "0xd6349d4e62a4288ba3d80b94421f2933b13f6f882b2c69a90508aa92ff88343f",
    );
  });

  const testVector9 = {
    d7f99b746f23411983df92806725af8e5cb66eba9f200737accae4a1ab7f47b9:
      "24232437f5b3f2380ba9089bdbc45efaffbe386602cb1ecc2c17f1d0",
    "59ee947b94bcc05634d95efb474742f6cd6531766e44670ec987270a6b5a4211":
      "72fdb0c99cf47feb85b2dad01ee163139ee6d34a8d893029a200aff76f4be5930b9000a1bbb2dc2b6c79f8f3c19906c94a3472349817af21181c3eef6b",
    a3dc3bed1b0727caf428961bed11c9998ae2476d8a97fad203171b628363d9a2: "8a0dafa9d6ae6177",
    "15207c233b055f921701fc62b41a440d01dfa488016a97cc653a84afb5f94fd5": "157b6c821169dacabcf26690df",
    b05ff8a05bb23c0d7b177d47ce466ee58fd55c6a0351a3040cf3cbf5225aab19: "6a208734106f38b73880684b",
  };

  it("should return all leaf nodes", () => {
    const data = { ...testVector9 };

    // construct the trie
    const trie = InMemoryTrie.empty(blake2bTrieHasher);

    for (const [key, val] of Object.entries(data)) {
      const stateKey = parseInputKey(key);
      const value = BytesBlob.parseBlobNoPrefix(val);
      trie.set(stateKey, value);
    }

    // when
    const leaves = Array.from(trie.nodes.leaves());

    assert.deepStrictEqual(
      leaves.map((val) => `${val.getKey()}: ${val.node}`),
      [
        "0xd7f99b746f23411983df92806725af8e5cb66eba9f200737accae4a1ab7f47: 0x9cd7f99b746f23411983df92806725af8e5cb66eba9f200737accae4a1ab7f4724232437f5b3f2380ba9089bdbc45efaffbe386602cb1ecc2c17f1d000000000",
        "0x59ee947b94bcc05634d95efb474742f6cd6531766e44670ec987270a6b5a42: 0xc059ee947b94bcc05634d95efb474742f6cd6531766e44670ec987270a6b5a42a7f2482020023b85b4009884a31aea08f03b4bbdb5efd5e6ff1d63f1a86aaa53",
```
