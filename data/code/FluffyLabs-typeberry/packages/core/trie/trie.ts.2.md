---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/trie/trie.ts#L205-L317
title: packages/core/trie/trie.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 2
chunk_total: 4
content_sha: 80f0099658e15ab00e6f2ac3668f8e085707efdf5df8401ede4152e2f23d96db
language: typescript
---
`packages/core/trie/trie.ts` (lines 205–317)

```typescript
      ? BranchNode.fromSubNodes(branchNode.getLeft(), lastHash)
      : BranchNode.fromSubNodes(lastHash, branchNode.getRight());
    lastHash = nodes.insert(newBranchNode.node);
    lastNode = newBranchNode.node;

    historicalBranch = traversedPath.branchingHistory.pop();
  }

  return lastNode;
}

/**
 * Path of branch nodes traversed while looking for the best place to put a new leaf.
 */
class TraversedPath {
  /** history of branch nodes (with their hashes) and the branching bit. */
  branchingHistory: [BranchNode, TrieNodeHash, boolean][] = [];
  /** last bitIndex */
  bitIndex = 0;
  /** in case of a leaf node at destination, details of that leaf node */
  leafToReplace?: [LeafNode, TrieNodeHash];
}

/**
 * Traverse the trie starting from root and return the path leading to the destination
 * where leaf with `key` should be placed.
 */
function findNodeToReplace(root: TrieNode, nodes: NodesDb, key: TruncatedStateKey): TraversedPath {
  const traversedPath = new TraversedPath();
  let currentNode = root;
  let currentNodeHash = nodes.hashNode(root);

  while (true) {
    const kind = currentNode.getNodeType();
    if (kind !== NodeType.Branch) {
      // we found a leaf that needs to be merged with the one being inserted.
      const leaf = currentNode.asLeafNode();
      traversedPath.leafToReplace = [leaf, currentNodeHash];
      return traversedPath;
    }

    // going down the trie
    const branch = currentNode.asBranchNode();
    const currBit = getBit(key, traversedPath.bitIndex);
    const nextHash = currBit ? branch.getRight() : branch.getLeft();
    traversedPath.branchingHistory.push([branch, currentNodeHash, currBit]);

    const nextNode = nodes.get(nextHash);
    if (nextNode === null) {
      if (nextHash.isEqualTo(zero)) {
        return traversedPath;
      }

      throw new Error(`Missing trie node '${nextHash}' with key prefix: ${key}[0..${traversedPath.bitIndex}]`);
    }

    currentNode = nextNode;
    currentNodeHash = nextHash;
    traversedPath.bitIndex += 1;
  }
}

/**
 * Handle a situation where we replace an existing leaf node at destination.
 *
 * In such case we need to create a subtree that will hold both of the leaves.
 *
 * The function returns a root of the subtree.
 */
function createSubtreeForBothLeaves(
  traversedPath: TraversedPath,
  nodes: WriteableNodesDb,
  leafToReplace: [LeafNode, TrieNodeHash],
  leaf: LeafNode,
): [TrieNode, TrieNodeHash] {
  const key = leaf.getKey();
  let [existingLeaf, existingLeafHash] = leafToReplace;
  const existingLeafKey = existingLeaf.getKey();

  // TODO [ToDr] [opti] instead of inserting/removing a bunch of nodes, it might be
  // better to return a changeset that can be batch-applied to the DB.
  const leafNodeHash = nodes.insert(leaf.node);
  if (existingLeafKey.isEqualTo(key)) {
    // remove only if we are not inserting the same value twice
    // we compare values only, since the hashes might have a difference at first
    // bit.
    if (!existingLeaf.getValueHash().isEqualTo(leaf.getValueHash())) {
      nodes.remove(existingLeafHash);
    }
    // just replacing an existing value
    return [leaf.node, leafNodeHash];
  }

  // In case both keys share a prefix we need to add a bunch of branch
  // nodes up until the keys start diverging.
  // Here we identify the common bit prefix that will later be used
  // in reverse to construct required branch nodes.
  const commonBits: boolean[] = [];
  let divergingBit = getBit(key, traversedPath.bitIndex);
  while (traversedPath.bitIndex < TRUNCATED_KEY_BITS) {
    divergingBit = getBit(key, traversedPath.bitIndex);
    const bit2 = getBit(existingLeafKey, traversedPath.bitIndex);
    if (divergingBit === bit2) {
      commonBits.push(bit2);
      traversedPath.bitIndex += 1;
    } else {
      break;
    }
  }

  // Now construct the common branches, and insert zero hash in place of other sub-trees.
  const zero = Bytes.zero(HASH_SIZE).asOpaque();

```
