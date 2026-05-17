---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database/serialized-states-db.ts#L98-L112
title: packages/jam/database/serialized-states-db.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 2
content_sha: 18be94f904a8a97cb418814e4960516245f53d30ffd1c2feaff690e244259719
language: typescript
---
`packages/jam/database/serialized-states-db.ts` (lines 98–112)

```typescript
        if (val === undefined) {
          throw new Error(`Missing value at key: ${key}`);
        }
        return val.raw;
      },
    });
    return SerializedState.new(this.spec, this.blake2b, leafDb);
  }

  markUnused(header: HeaderHash): void {
    this.db.delete(header);
  }

  async close() {}
}
```
