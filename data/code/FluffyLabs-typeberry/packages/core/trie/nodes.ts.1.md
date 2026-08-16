---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/trie/nodes.ts#L120-L233
title: packages/core/trie/nodes.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 1a59523d19fff3430195e0d1b9f713392cdb020224430931752334b6a1877f8e
language: typescript
---
`packages/core/trie/nodes.ts` (lines 120–233)

```typescript
  static fromSubNodes(left: TrieNodeHash, right: TrieNodeHash) {
    const node = new TrieNode();
    node.raw.set(left.raw, 0);
    node.raw.set(right.raw, HASH_SIZE);

    // set the first bit to 0 (branch node)
    node.raw[0] &= FIRST_BIT_SET_NEG;

    return new BranchNode(node);
  }

  /** View an existing raw trie node as a branch node (validates node type). */
  static viewOf(node: TrieNode): BranchNode {
    check`${node.getNodeType() === NodeType.Branch} not a branch!`;
    return new BranchNode(node);
  }

  // Underlying raw node.
  private constructor(readonly node: TrieNode) {}

  /** Get the hash of the left sub-trie. */
  getLeft(): TrieNodeHash {
    return Bytes.fromBlob(this.node.raw.subarray(0, HASH_SIZE), HASH_SIZE).asOpaque();
  }

  /** Get the hash of the right sub-trie. */
  getRight(): TrieNodeHash {
    return Bytes.fromBlob(this.node.raw.subarray(HASH_SIZE), HASH_SIZE).asOpaque();
  }
}

/**
 * A leaf node view of the underlying raw trie node.
 *
 * +---------------------------------------------------------------+
 * |                    Embedded value leaf                        |
 * +----+----------+-------------------+---------------------------+
 * | BL | V_len    | Key               | 0-padded value (V_len)    |
 * | 2b | (6 bits) | (31 bytes)        | (32 bytes)                |
 * |----|----------|-------------------|---------------------------|
 * | 10 |  000111  | deadbeef...       | 0123456789abcdef...       |
 * +---------------------------------------------------------------+
 * |                    Value hash leaf                            |
 * +----+----------+-------------------+---------------------------+
 * | BL |   zero   | Key               | Value hash                |
 * |----|----------|-------------------|---------------------------|
 * | 11 |  000000  | deadbeef...       | deadbeef...               |
 * +---------------------------------------------------------------+
 */
export class LeafNode {
  // Underlying raw node.
  readonly node: TrieNode;

  static fromValue(key: InputKey, value: BytesBlob, valueHash: () => ValueHash): LeafNode {
    const node = new TrieNode();
    // The value will fit in the leaf itself.
    if (value.length <= HASH_SIZE) {
      node.raw[0] = FIRST_BIT_SET | value.length;
      // truncate & copy the key
      node.raw.set(key.raw.subarray(0, TRUNCATED_KEY_BYTES), 1);
      // copy the value
      node.raw.set(value.raw, TRUNCATED_KEY_BYTES + 1);
    } else {
      node.raw[0] = FIRST_TWO_BITS_SET;
      // truncate & copy the key
      node.raw.set(key.raw.subarray(0, TRUNCATED_KEY_BYTES), 1);
      // copy the value hash
      node.raw.set(valueHash().raw, TRUNCATED_KEY_BYTES + 1);
    }

    return new LeafNode(node);
  }

  /** View an existing raw trie node as a leaf node (validates node type). */
  static viewOf(node: TrieNode): LeafNode {
    check`${node.getNodeType() !== NodeType.Branch} not a leaf!`;
    return new LeafNode(node);
  }

  private constructor(node: TrieNode) {
    this.node = node;
  }

  /** Get the key (truncated to 31 bytes). */
  getKey(): TruncatedStateKey {
    return Bytes.fromBlob(this.node.raw.subarray(1, TRUNCATED_KEY_BYTES + 1), TRUNCATED_KEY_BYTES).asOpaque();
  }

  hasEmbeddedValue(): boolean {
    return this.node.getNodeType() === NodeType.EmbedLeaf;
  }

  /**
   * Get the byte length of embedded value.
   *
   * Note in case this node only contains hash this is going to be 0.
   */
  getValueLength(): number {
    const firstByte = this.node.raw[0];
    // we only store values up to `HASH_SIZE`, so they fit on the last 6 bits.
    return firstByte & FIRST_TWO_BITS_SET_NEG;
  }

  /**
   * Returns the embedded value.
   *
   * Note that this is going to be empty for a regular leaf node (i.e. containing a hash).
   */
  getValue(): BytesBlob {
    const len = this.getValueLength();
    return BytesBlob.blobFrom(this.node.raw.subarray(HASH_SIZE, HASH_SIZE + len));
  }

  /**
```
