---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database/states.ts#L109-L122
title: packages/jam/database/states.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 2
content_sha: 1c5d191cb976f939cdc2efae1cbbd8979c525163486d5fee2b70e67ac7d2dd2c
language: typescript
---
`packages/jam/database/states.ts` (lines 109–122)

```typescript
    const state = this.db.get(headerHash);
    if (state === undefined) {
      return null;
    }

    return InMemoryState.copyFrom(this.spec, state, state.intoServicesData());
  }

  markUnused(header: HeaderHash): void {
    this.db.delete(header);
  }

  async close() {}
}
```
