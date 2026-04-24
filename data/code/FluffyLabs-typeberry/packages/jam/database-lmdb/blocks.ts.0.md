---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-lmdb/blocks.ts#L1-L107
title: packages/jam/database-lmdb/blocks.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 11bc1e39f7885803346a48aef0ae619bde0b7eeaf29452dbe7c08de963cd10ba
language: typescript
---
`packages/jam/database-lmdb/blocks.ts` (lines 1–107)

```typescript
import {
  type BlockView,
  Extrinsic,
  type ExtrinsicView,
  Header,
  type HeaderHash,
  type HeaderView,
  type StateRootHash,
} from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { Decoder } from "@typeberry/codec";
import type { ChainSpec } from "@typeberry/config";
import type { BlocksDb } from "@typeberry/database/blocks.js";
import { HASH_SIZE, type WithHash } from "@typeberry/hash";
import type { LmdbRoot, SubDb } from "./root.js";

const BEST_BLOCK = "best hash and posterior state root";

// TODO [ToDr] consider having a changeset for transactions,
// where we store all `insert ++ key ++ value` and `remove ++ key`
// in a single `Uint8Array` JAM-encoded. That could then
// be efficiently transferred between threads.
export class LmdbBlocks implements BlocksDb {
  private readonly extrinsics: SubDb;
  private readonly headers: SubDb;
  private readonly postStateRoots: SubDb;

  static new(chainSpec: ChainSpec, root: LmdbRoot) {
    return new LmdbBlocks(chainSpec, root);
  }

  private constructor(
    private readonly chainSpec: ChainSpec,
    private readonly root: LmdbRoot,
  ) {
    // NOTE [ToDr] Extrinsics are stored under header hash, not their hash. Revise if it's an issue.
    this.extrinsics = this.root.subDb("extrinsics");
    this.headers = this.root.subDb("headers");
    // NOTE [ToDr] We currently store all posterior state roots, however it's
    // most likely very redundant. We probably only need to store the posterior
    // state roots of recent blocks to be able to quickly resolve forks
    // OR we need a way to be able to traverse the blocks history forward
    // (i.e. know what next block(s) is).
    this.postStateRoots = this.root.subDb("postStateRoots");
  }

  async setPostStateRoot(hash: HeaderHash, postStateRoot: StateRootHash): Promise<void> {
    await this.postStateRoots.put(hash.raw, postStateRoot.raw);
  }

  getPostStateRoot(hash: HeaderHash): StateRootHash | null {
    const postStateRoot = this.postStateRoots.get(hash.raw);
    if (postStateRoot === undefined) {
      return null;
    }
    return Bytes.fromBlob(postStateRoot, HASH_SIZE).asOpaque();
  }

  async insertBlock(block: WithHash<HeaderHash, BlockView>): Promise<void> {
    const header = block.data.header.view().encoded();
    const extrinsic = block.data.extrinsic.view().encoded();
    await this.root.db.transaction(() => {
      this.headers.put(block.hash.raw, header.raw);
      this.extrinsics.put(block.hash.raw, extrinsic.raw);
    });
  }

  async setBestHeaderHash(hash: HeaderHash): Promise<void> {
    await this.root.db.put(BEST_BLOCK, hash.raw);
  }

  getBestHeaderHash(): HeaderHash {
    const bestHeaderHash = this.root.db.get(BEST_BLOCK);
    if (bestHeaderHash === undefined) {
      return Bytes.zero(HASH_SIZE).asOpaque();
    }

    return Bytes.fromBlob(bestHeaderHash, HASH_SIZE).asOpaque();
  }

  getHeader(hash: HeaderHash): HeaderView | null {
    const data = this.headers.get(hash.raw);
    if (data === undefined) {
      return null;
    }

    return Decoder.decodeObject(Header.Codec.View, data, this.chainSpec);
  }

  getExtrinsic(hash: HeaderHash): ExtrinsicView | null {
    const data = this.extrinsics.get(hash.raw);
    if (data === undefined) {
      return null;
    }
    return Decoder.decodeObject(Extrinsic.Codec.View, data, this.chainSpec);
  }

  markUnused(hash: HeaderHash): void {
    this.headers.removeSync(hash.raw);
    this.extrinsics.removeSync(hash.raw);
    this.postStateRoots.removeSync(hash.raw);
  }

  async close() {
    await Promise.all([this.headers.close(), this.extrinsics.close(), this.postStateRoots.close()]);
  }
}
```
