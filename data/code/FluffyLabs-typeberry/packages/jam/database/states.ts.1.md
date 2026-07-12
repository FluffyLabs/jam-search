---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database/states.ts#L106-L130
title: packages/jam/database/states.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 3d60c8ea8bebef66eb87765ae1c2112f739f270dde5c3b637daccad541def836
language: typescript
---
`packages/jam/database/states.ts` (lines 106–130)

```typescript
  async insertInitialState(headerHash: HeaderHash, state: InMemoryState): Promise<Result<OK, StateUpdateError>> {
    const copy = InMemoryState.copyFrom(this.spec, state, state.intoServicesData());
    this.db.set(headerHash, copy);
    return Result.ok(OK);
  }

  getState(headerHash: HeaderHash): InMemoryState | null {
    const state = this.db.get(headerHash);
    if (state === undefined) {
      return null;
    }

    return InMemoryState.copyFrom(this.spec, state, state.intoServicesData());
  }

  commitFinalized(_headers: HeaderHash[]): void {
    // nothing to do: every state is a full, independent copy.
  }

  markUnused(header: HeaderHash): void {
    this.db.delete(header);
  }

  async close() {}
}
```
