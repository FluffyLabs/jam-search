---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-lmdb/root.ts#L1-L31
title: packages/jam/database-lmdb/root.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 8c631859f869080a1f5873e76e9709364375fa8cecb99f598ecacade8a429b2e
language: typescript
---
`packages/jam/database-lmdb/root.ts` (lines 1–31)

```typescript
import * as lmdb from "lmdb";

export type SubDb = lmdb.Database<Uint8Array, lmdb.Key>;

/** A thin abstraction over lmdb database interface. */
export class LmdbRoot {
  readonly db: lmdb.RootDatabase<Uint8Array, lmdb.Key>;

  static new(dbPath: string, readOnly = false) {
    return new LmdbRoot(dbPath, readOnly);
  }

  private constructor(dbPath: string, readOnly = false) {
    this.db = lmdb.open(dbPath, {
      compression: true,
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
