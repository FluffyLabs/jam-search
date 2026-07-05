---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database/serialized-states-db.ts#L89-L130
title: packages/jam/database/serialized-states-db.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: d08c07cc52f683c82507bb7a65e62f449435c4cf566ced276e0751c117a99d61
language: typescript
---
`packages/jam/database/serialized-states-db.ts` (lines 89–130)

```typescript
    this.db.set(header, leafs);
    this.applyRefs(this.refs.onImport(header, { inserted: values.map((v) => v[0]), removed }));

    return Result.ok(OK);
  }

  getState(header: HeaderHash): SerializedState<LeafDb> | null {
    const leafs = this.db.get(header);
    if (leafs === undefined) {
      return null;
    }
    // now create a leafdb with shared values db.
    const leafDb = LeafDb.fromLeaves(leafs, {
      get: (key: ValueHash) => {
        const val = this.valuesDb.get(key);
        if (val === undefined) {
          throw new Error(`Missing value at key: ${key}`);
        }
        return val.raw;
      },
    });
    return SerializedState.new(this.spec, this.blake2b, leafDb);
  }

  commitFinalized(headers: HeaderHash[]): void {
    this.applyRefs(this.refs.commitFinalized(headers));
  }

  markUnused(header: HeaderHash): void {
    this.applyRefs(this.refs.releaseUnfinalized(header));
    this.db.delete(header);
  }

  private applyRefs(update: ValueRefsUpdate): void {
    this.refsStore.apply(update);
    for (const v of update.removeValues) {
      this.valuesDb.delete(v);
    }
  }

  async close() {}
}
```
