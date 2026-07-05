---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database/states.ts#L107-L137
title: packages/jam/database/states.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 804ae8415623dadd82da29dc1bdc7299e5fac81d7f42dfcf808cad373b843130
language: typescript
---
`packages/jam/database/states.ts` (lines 107–137)

```typescript
  async getStateRoot(state: InMemoryState): Promise<StateRootHash> {
    const blake2b = await this.blake2b;
    return StateEntries.serializeInMemory(this.spec, blake2b, state).getRootHash(blake2b);
  }

  /** Insert a full state into the database. */
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
