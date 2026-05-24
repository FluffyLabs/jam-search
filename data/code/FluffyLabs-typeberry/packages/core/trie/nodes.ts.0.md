---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/trie/nodes.ts#L1-L127
title: packages/core/trie/nodes.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 024c427b00ed8acdfc1e40af5aa46f30e37cacd8a5ea59f75b22a5c05f03114a
language: typescript
---
`packages/core/trie/nodes.ts` (lines 1–127)

```typescript
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { HASH_SIZE, type OpaqueHash } from "@typeberry/hash";
import { check, type Opaque, safeAllocUint8Array } from "@typeberry/utils";
import { FIRST_BIT_SET, FIRST_BIT_SET_NEG, FIRST_TWO_BITS_SET, FIRST_TWO_BITS_SET_NEG } from "./masks.js";

export type StateKey = Opaque<OpaqueHash, "trieStateKey">;
export type TruncatedStateKey = Opaque<Bytes<TRUNCATED_KEY_BYTES>, "trieStateKey">;

export type InputKey = StateKey | TruncatedStateKey;

/**
 * Hash of the entire node of the trie or concatenation of two nodes.
 *
 * In case this is the root node of the entire trie, it's going to be the state commitment.
 *
 * https://graypaper.fluffylabs.dev/#/579bd12/0c1f010c2301
 */
export type TrieNodeHash = Opaque<OpaqueHash, "trie">;

/** Hash of the value contained in the trie node. */
export type ValueHash = Opaque<OpaqueHash, "trieValue">;

/** Value nodes have the key truncated to 31 bytes. */
export const TRUNCATED_KEY_BYTES = 31;
export type TRUNCATED_KEY_BYTES = 31;
export const TRUNCATED_KEY_BITS = TRUNCATED_KEY_BYTES * 8;

/** Number of bytes used to represent a trie node. */
export const TRIE_NODE_BYTES = 64;

export function parseInputKey(v: string): InputKey {
  if (v.length === HASH_SIZE * 2) {
    return Bytes.parseBytesNoPrefix(v, HASH_SIZE).asOpaque();
  }
  return Bytes.parseBytesNoPrefix(v, TRUNCATED_KEY_BYTES).asOpaque();
}

/**
 * The kind of the trie node.
 */
export enum NodeType {
  /** Branch node (left & right subtree hashes) */
  Branch = 0,
  /** Leaf node (value hash) */
  Leaf = 1,
  /** Embedded leaf node (value len + value) */
  EmbedLeaf = 2,
}

/**
 * A representation of an unidentified raw trie node.
 *
 * The node can be either (determined by the first bit):
 *	- a branch node
 *	- a leaf node
 *
 * In case of a branch node the contained data is:
 *	- left sub-node hash (32 bytes - 1 bit)
 *	- right sub-node hash (32 bytes)
 *
 * There are two kinds of leaf nodes (determined by the second bit)
 *	- Embedded value leaf nodes
 *	- Value hash leaf nodes
 *
 * Embedded value leaf nodes contain:
 *  - a length of the embedded value (last 6 bits of the first byte)
 *  - the value itself (padded with zeroes)
 *
 * Regular value leaf nodes contain:
 *  - a hash of the value
 */
export class TrieNode {
  constructor(
    /** Exactly 512 bits / 64 bytes */
    public readonly raw: Uint8Array = safeAllocUint8Array(TRIE_NODE_BYTES),
  ) {}

  /** Returns the type of the node */
  getNodeType(): NodeType {
    if ((this.raw[0] & FIRST_BIT_SET) === 0) {
      return NodeType.Branch;
    }

    if ((this.raw[0] & FIRST_TWO_BITS_SET) === FIRST_TWO_BITS_SET) {
      return NodeType.Leaf;
    }

    return NodeType.EmbedLeaf;
  }

  /** View this node as a branch node */
  asBranchNode(): BranchNode {
    return BranchNode.viewOf(this);
  }

  /** View this node as a leaf node */
  asLeafNode(): LeafNode {
    return LeafNode.viewOf(this);
  }

  toString() {
    return BytesBlob.blobFrom(this.raw).toString();
  }
}

/**
 * A branch node view of the underlying raw trie node.
 *
 * +---------------------------------------------------------------+
 * |                        512-bit trie node                      |
 * +---+----------------------------+------------------------------+
 * | B | Left Sub-node Hash         | Right Sub-node Hash          |
 * |   | (255 bits)                 | (256 bits)                   |
 * |---|----------------------------|------------------------------|
 * | 0 | 101010101010101010101...   | 11001100110011001100...      |
 * +---------------------------------------------------------------+
 */
export class BranchNode {
  /** Build a branch node from its left and right sub-node hashes. */
  static fromSubNodes(left: TrieNodeHash, right: TrieNodeHash) {
    const node = new TrieNode();
    node.raw.set(left.raw, 0);
    node.raw.set(right.raw, HASH_SIZE);

    // set the first bit to 0 (branch node)
    node.raw[0] &= FIRST_BIT_SET_NEG;

```
