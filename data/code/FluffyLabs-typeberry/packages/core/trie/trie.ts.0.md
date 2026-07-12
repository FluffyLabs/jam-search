---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/trie/trie.ts#L1-L109
title: packages/core/trie/trie.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 4
content_sha: f6e8948da34bbe929a4e05a53214e83e34c775ec2c3695ee261487b38432b352
language: typescript
---
`packages/core/trie/trie.ts` (lines 1–109)

```typescript
import { Bytes, type BytesBlob } from "@typeberry/bytes";
import type { SortedSet } from "@typeberry/collections";
import { HASH_SIZE, TRUNCATED_HASH_SIZE } from "@typeberry/hash";
import { check } from "@typeberry/utils";
import {
  BranchNode,
  type InputKey,
  LeafNode,
  NodeType,
  type StateKey,
  TRUNCATED_KEY_BITS,
  type TrieNode,
  type TrieNodeHash,
  type TruncatedStateKey,
  type ValueHash,
} from "./nodes.js";
import { type NodesDb, type TrieHasher, WriteableNodesDb } from "./nodesDb.js";

/** Compare two trie `LeafNode`s only by their key. */
export const leafComparator = (x: LeafNode, y: LeafNode) => x.getKey().compare(y.getKey());
const zero = Bytes.zero(HASH_SIZE).asOpaque();

export class InMemoryTrie {
  /** Create an empty in-memory trie. */
  static empty(hasher: TrieHasher): InMemoryTrie {
    return new InMemoryTrie(WriteableNodesDb.new(hasher));
  }

  /** Given a collection of leaves, compute the state root. */
  static computeStateRoot(hasher: TrieHasher, leaves: SortedSet<LeafNode>): TrieNodeHash {
    const sorted = leaves.slice();
    const firstSorted = sorted.shift();
    if (firstSorted === undefined) {
      return zero;
    }

    const nodes = [
      {
        leaf: firstSorted,
        sharedBitsWithPrev: 0,
      },
    ];
    let last = nodes[0];
    // first we go through all of the sorted leaves and figure out how much in common
    // they have with the previous node.
    // If the shared-prefix drops, it means we are going up in depth (i.e. we are in different branch).
    for (const leaf of sorted) {
      const sharedBitsCount = findSharedPrefix(leaf.getKey(), last.leaf.getKey());
      last = {
        leaf,
        sharedBitsWithPrev: sharedBitsCount,
      };
      nodes.push(last);
    }
    // Now we will go backwards and hash them together (or create branch nodes).
    nodes.reverse();
    const stack: TrieNodeHash[] = [];
    let currentDepth = 0;
    const lastNode = nodes.length === 1 ? undefined : nodes[nodes.length - 1];
    for (const node of nodes) {
      const isLastNode = node === lastNode;
      const key = node.leaf.getKey();
      const prevDepth = currentDepth;
      currentDepth = node.sharedBitsWithPrev;

      // first push all missing right-hand zero nodes.
      // Handle the case if all nodes are on the left side and we need one more top-level
      // extra.
      const startDepth = isLastNode ? prevDepth : prevDepth + 1;
      for (let i = startDepth; i <= currentDepth; i++) {
        if (getBit(key, i) === false) {
          stack.push(zero);
        }
      }

      // now let's push the hash of the current leaf
      const hash = hasher.hashConcat(node.leaf.node.raw);
      stack.push(hash);
      // we are going further down, so no need to merge anything
      if (prevDepth < currentDepth) {
        continue;
      }
      // jumping back to some lower depth, we need to merge what we have on the stack.
      // we need to handle a case where we have no nodes on the top-most left side.
      // in such case we just add extra zero on the left.
      const endDepth = isLastNode ? currentDepth - 1 : currentDepth;
      for (let i = prevDepth; i > endDepth; i--) {
        if (getBit(key, i) === true) {
          stack.push(zero);
        }
        const current = stack.pop() ?? zero;
        const next = stack.pop() ?? zero;
        const branchNode = BranchNode.fromSubNodes(current, next);
        const hash = hasher.hashConcat(branchNode.node.raw);
        stack.push(hash);
      }
    }

    return stack.pop() ?? zero;
  }

  /**
   * Construct a `LeafNode` from given `key` and `value`.
   *
   * NOTE: for large value it WILL NOT be embedded in the leaf node,
   * and should rather be stored separately.
   */
  static constructLeaf(hasher: TrieHasher, key: InputKey, value: BytesBlob, maybeValueHash?: ValueHash) {
    const valueHash = () => maybeValueHash ?? hasher.hashConcat(value.raw).asOpaque();
```
