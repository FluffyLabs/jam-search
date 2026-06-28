---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/trie/trie.ts#L106-L209
title: packages/core/trie/trie.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 4
content_sha: 0a6e0d87d53c66ddcf544149d19ee95ad1817ee69477d4af8ce18fa3a26eab40
language: typescript
---
`packages/core/trie/trie.ts` (lines 106–209)

```typescript
   * and should rather be stored separately.
   */
  static constructLeaf(hasher: TrieHasher, key: InputKey, value: BytesBlob, maybeValueHash?: ValueHash) {
    const valueHash = () => maybeValueHash ?? hasher.hashConcat(value.raw).asOpaque();
    return LeafNode.fromValue(key, value, valueHash);
  }

  /**
   * Reconstruct the entire trie from it's leaves.
   *
   * Note that if only the state root is needed, this is rather inefficient.
   */
  static fromLeaves(hasher: TrieHasher, leaves: readonly LeafNode[]) {
    // TODO [ToDr] [opti] Pair up the leaves and build upper levels.
    let root: TrieNode | null = null;
    const nodes = WriteableNodesDb.new(hasher);
    for (const leaf of leaves) {
      root = trieInsert(root, nodes, leaf);
    }
    return new InMemoryTrie(nodes, root);
  }

  private constructor(
    // Exposed for trie-visualiser
    public readonly nodes: WriteableNodesDb,
    private root: TrieNode | null = null,
  ) {}

  set(key: InputKey, value: BytesBlob, maybeValueHash?: ValueHash) {
    const leafNode = InMemoryTrie.constructLeaf(this.nodes.hasher, key, value, maybeValueHash);
    this.root = trieInsert(this.root, this.nodes, leafNode);
    return leafNode;
  }

  remove(_: StateKey) {
    // TODO [ToDr] Trie removal is most likely not needed. If we run into this issue,
    // we should most likely decide to optimize the code that requires removal.
    // NOTE: we pretty much NEVER need the full trie at all. We only need to compute the
    // state root (from time to time), but we can easily just operate on the leafs.
    // Removal should happen on the leaf level as well. Most likey the whole
    // `InMemoryTrie` stuff should be eradicated in favor of leaves-operating methods.
    throw new Error("Removing from the trie not implemented yet.");
  }

  getRootNode(): TrieNode | null {
    return this.root;
  }

  getRootHash(): TrieNodeHash {
    if (this.root === null) {
      return Bytes.zero(HASH_SIZE).asOpaque();
    }

    return this.nodes.hashNode(this.root);
  }

  toString(): string {
    return trieStringify(this.root, this.nodes);
  }
}

/**
 * Insert a new leaf node into a trie starting at the given `root` node.
 *
 * The function will find a place where the leaf node should be present and update
 * the entire branch up to the trie root.
 *
 * New root node is returned.
 */
function trieInsert(root: TrieNode | null, nodes: WriteableNodesDb, leaf: LeafNode): TrieNode {
  if (root === null) {
    nodes.insert(leaf.node);
    return leaf.node;
  }

  // first we look up a good place to insert the node to the tree, based on it's key.
  const traversedPath = findNodeToReplace(root, nodes, leaf.getKey());

  // now we analyze two possible situations:
  // 1. We found a leaf node - that means we need to create a branch node (and possible
  //    extra branch nodes for a common prefix) with these two leaves. Finally we update the
  //    traversed path from root.
  // 2. We found an empty spot (i.e. branch node with zero hash) - we can just update already
  //    traversed path from root.
  const nodeToInsert: [TrieNode, TrieNodeHash] =
    traversedPath.leafToReplace !== undefined
      ? createSubtreeForBothLeaves(traversedPath, nodes, traversedPath.leafToReplace, leaf)
      : [leaf.node, nodes.insert(leaf.node)];

  // finally update the traversed path from `root` to the insertion location.
  let historicalBranch = traversedPath.branchingHistory.pop();
  let [lastNode, lastHash] = nodeToInsert;

  while (historicalBranch !== undefined) {
    const [branchNode, branchHash, bit] = historicalBranch;
    nodes.remove(branchHash);

    // TODO [ToDr] [opti] Avoid allocation here by re-using the old branch node?
    const newBranchNode = bit
      ? BranchNode.fromSubNodes(branchNode.getLeft(), lastHash)
      : BranchNode.fromSubNodes(lastHash, branchNode.getRight());
    lastHash = nodes.insert(newBranchNode.node);
    lastNode = newBranchNode.node;

```
