---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/root.ts#L115-L146
title: packages/jam/database-fjall/root.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 9c02ea21550a33466c2b9e29a691e49e3cd4fda81d8806cf92ef069d2546b078
language: typescript
---
`packages/jam/database-fjall/root.ts` (lines 115–146)

```typescript
   * Size of the keyspace directory on disk, in bytes.
   *
   * Returns `null` when the directory cannot be walked (e.g. not created yet).
   * A fjall keyspace is a directory of partition and journal files, so we sum
   * them recursively.
   */
  sizeInBytes(): number | null {
    try {
      return dirSizeInBytes(this.dbPath);
    } catch {
      return null;
    }
  }

  /** Release this keyspace handle. Call persist() first when durability is needed. */
  async close(): Promise<void> {
    await this.keyspace.close();
  }
}

function dirSizeInBytes(dir: string): number {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      total += dirSizeInBytes(full);
    } else if (entry.isFile()) {
      total += fs.statSync(full).size;
    }
  }
  return total;
}
```
