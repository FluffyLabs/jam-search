---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/87'
title: nomt inspired trie storage
site: github.com/FluffyLabs/typeberry
created_at: '2024-08-20T05:55:40.000Z'
last_modified: '2024-08-20T05:55:40.000Z'
content_kind: issue
---

# nomt inspired trie storage

## Issue by @tomusdrw

1. We should only store the state trie of the tip of the chain.
2. For initial sync we should support "commit" operation only once in a while to avoid computing the merkle root at every block.
3. For block import we should only commit once at the end to calculate state root (in JAM we actually don't even need to compare the state root, since the header contains pre-block state roort, not posterior one).
4. NOMT does not store the trie nodes at all it just stores the hashes instead.
5. Hashes (32 bytes) are stored on pages (4kB), it's possible to store up to 126 hashes on a page.
6. Given the key we can directly figure out the page indices that are needed to be fetched. Exact addressing is yet to be figured out (we need "less" address space for the pages that store nodes higher in the trie, but more addresses for the leaves) - by assuming an expected number of elements we can figure out how many pages deep the tree should be and how many pages we need at each depth. AFAIR nomt does split the key (256bit) into 6-bit elements so we end up with 42-ish (6 * 7) addresses to pages. Their assumed page-depth of the trie is 7 levels (coming from some large estimate of number of items in the trie in the range of 1B or 1T).
8. Since the key -> pages split is deterministic, the pages can be fetched in parallel. However for "small" tries some pages might be empty, so we should benchmark what's the best strategy here. (i.e. the entire subtree might simply be embedded in layer-0 page, so we only need this to be fetched, the rest is not needed). For large tries all pages might be needed. We could experiment with binary-searching or adjusting the strategy as the trie grows.
9. NOMT uses it's own page storage based on a hash table, but we should initially just try LMDB and see what the performance is.


The important takeaways are:
1. Don't optimize for the archive node (i.e. don't store historical state tries)
2. Don't store all inner nodes in their regular form (by storing hash of the node instead of the node itself we save 2x - the node itself can always be recomputed from it's children which lay on pre-defined pages).

Original article: https://sovereign.mirror.xyz/jfx_cJ_15saejG9ZuQWjnGnG-NfahbazQH98i1J3NN8


## Comment by @tomusdrw

Additional thing to research (QMDB): https://arxiv.org/html/2501.05262v2


## Comment by @tomusdrw

Another alternative is to only store leaves of the trie in the DB. We would only store the latest state and a bunch of reverse diffs to get to the previous (non-finalized) states.

The trie would be only stored in-memory and reconstructed on startup from the leafs.


## Comment by @tomusdrw

Closed via #419 - we don't need to go into this direction, since it seems feasible to just reconstruct the trie in-memory from just the leaf nodes every time.
