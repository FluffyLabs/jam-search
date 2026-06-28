---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database/serialized-states-db.ts#L98-L117
title: packages/jam/database/serialized-states-db.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: 7466ba75dc103d03c0027e034658e7abe515454f73b19aafd46c0b64bfc63191
language: typescript
---
`packages/jam/database/serialized-states-db.ts` (lines 98–117)

```typescript
        if (val === undefined) {
          throw new Error(`Missing value at key: ${key}`);
        }
        return val.raw;
      },
    });
    return SerializedState.new(this.spec, this.blake2b, leafDb);
  }

  commitFinalized(_headers: HeaderHash[]): void {
    // No value pruning here: this in-memory db keeps every value in a plain map
    // and is not the long-running fuzz target the refcounting is meant for.
  }

  markUnused(header: HeaderHash): void {
    this.db.delete(header);
  }

  async close() {}
}
```
