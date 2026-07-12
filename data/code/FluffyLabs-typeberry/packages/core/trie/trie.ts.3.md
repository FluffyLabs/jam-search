---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/trie/trie.ts#L309-L417
title: packages/core/trie/trie.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 3
chunk_total: 4
content_sha: f910e849f5cee5cb9a980a76199911ae291fecf1c8aa9ee06bca09eb31c5537c
language: typescript
---
`packages/core/trie/trie.ts` (lines 309–417)

```typescript
      traversedPath.bitIndex += 1;
    } else {
      break;
    }
  }

  // Now construct the common branches, and insert zero hash in place of other sub-trees.
  const zero = Bytes.zero(HASH_SIZE).asOpaque();

  // In case we move the leaf from left to right it's hash needs to be re-calculated (missing bit).
  // TODO [ToDr] [opti] might be better to store the original bit value instead of recalculating.
  const leafWasInLeftBranch = (() => {
    const l = traversedPath.branchingHistory.length;
    if (l > 0) {
      return traversedPath.branchingHistory[l - 1][2] === false;
    }
    return false;
  })();
  if (leafWasInLeftBranch && !divergingBit) {
    existingLeafHash = nodes.hashNode(existingLeaf.node);
  }

  let lastBranch = divergingBit
    ? BranchNode.fromSubNodes(existingLeafHash, leafNodeHash)
    : BranchNode.fromSubNodes(leafNodeHash, existingLeafHash);
  let lastHash = nodes.insert(lastBranch.node);
  let bit = commonBits.pop();

  // go up and create branch nodes for the common prefix
  while (bit !== undefined) {
    lastBranch = bit ? BranchNode.fromSubNodes(zero, lastHash) : BranchNode.fromSubNodes(lastHash, zero);
    lastHash = nodes.insert(lastBranch.node);
    bit = commonBits.pop();
  }

  // let's return the top branch to join with the history
  return [lastBranch.node, lastHash];
}

/**
 * Return a single bit from `key` located at `bitIndex`.
 */
function getBit(key: TruncatedStateKey, bitIndex: number): boolean {
  check`${bitIndex < TRUNCATED_KEY_BITS} invalid bit index passed ${bitIndex}`;
  const byte = bitIndex >>> 3;
  const bit = bitIndex - (byte << 3);
  const mask = 0b10_00_00_00 >>> bit;
  const val = key.raw[byte] & mask;
  return val !== 0;
}

function trieStringify(root: TrieNode | null, nodes: NodesDb): string {
  if (root === null) {
    return "<empty tree>";
  }

  const kind = root.getNodeType();
  if (kind === NodeType.Branch) {
    const branch = root.asBranchNode();
    const leftHash = branch.getLeft();
    const rightHash = branch.getRight();
    const indent = (v: string) =>
      v
        .split("\n")
        .map((v) => `\t\t${v}`)
        .join("\n");
    const left = trieStringify(nodes.get(leftHash), nodes);
    const right = trieStringify(nodes.get(rightHash), nodes);

    return `<branch>
	-- ${leftHash}: ${indent(left)}
	-- ${rightHash}: ${indent(right)}
`;
  }

  const leaf = root.asLeafNode();
  const valueLength = leaf.getValueLength();
  const value = valueLength > 0 ? `'${leaf.getValue()}'(len:${valueLength})` : `'<hash>${leaf.getValueHash()}'`;
  return `\nLeaf('${leaf.getKey().toString()}',${value})`;
}

export function findSharedPrefix(a: TruncatedStateKey, b: TruncatedStateKey) {
  for (let i = 0; i < TRUNCATED_HASH_SIZE; i++) {
    const diff = a.raw[i] ^ b.raw[i];
    if (diff === 0) {
      continue;
    }
    // check how many bits match
    for (const [mask, matchingBits] of bitLookup) {
      if ((mask & diff) !== 0) {
        return i * 8 + matchingBits;
      }
    }
    return i;
  }
  return TRUNCATED_HASH_SIZE * 8;
}

const bitLookup = [
  [0b10000000, 0],
  [0b01000000, 1],
  [0b00100000, 2],
  [0b00010000, 3],
  [0b00001000, 4],
  [0b00000100, 5],
  [0b00000010, 6],
  [0b00000001, 7],
  [0b00000000, 8],
];
```
