---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-lmdb/root.ts#L1-L40
title: packages/jam/database-lmdb/root.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 57935fc8462d2ada10ca36270f0964eca1266f4d1d3d9115893802b0bf6c82a6
language: typescript
---
`packages/jam/database-lmdb/root.ts` (lines 1–40)

```typescript
import * as lmdb from "lmdb";

export type SubDb = lmdb.Database<Uint8Array, lmdb.Key>;

/** A thin abstraction over lmdb database interface. */
export class LmdbRoot {
  readonly db: lmdb.RootDatabase<Uint8Array, lmdb.Key>;

  static new(dbPath: string, readOnly = false, ephemeral = false) {
    return new LmdbRoot(dbPath, readOnly, ephemeral);
  }

  private constructor(dbPath: string, readOnly = false, ephemeral = false) {
    this.db = lmdb.open(dbPath, {
      // experimental options
      noMemInit: true,
      remapChunks: true,
      eventTurnBatching: false,
      // For ephemeral databases (e.g. the fuzz target, which wipes on every reset)
      // durability is pointless, so we skip fsync and skip compressing the large
      // per-block leaf blobs. Both are pure overhead there and dominate the cost.
      // This trades disk space (uncompressed) and crash-durability for speed.
      compression: !ephemeral,
      noSync: ephemeral,
      keyEncoding: "binary",
      encoding: "binary",
      readOnly,
    });
  }

  /** Open a sub-database under the same path. */
  subDb(name: string): SubDb {
    return this.db.openDB({ name });
  }

  /** Close the database and all sub-databases. */
  async close() {
    await this.db.close();
  }
}
```
