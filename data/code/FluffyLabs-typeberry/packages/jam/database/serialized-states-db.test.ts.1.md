---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database/serialized-states-db.test.ts#L94-L129
title: packages/jam/database/serialized-states-db.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 612fcb73fffbe5b4584d1cf6fa0456ad1a002b36215f6c8e7756c6dea20d400b
language: typescript
---
`packages/jam/database/serialized-states-db.test.ts` (lines 94–129)

```typescript
    assert.ok(canReadFully(states.getState(hh(1))), "surviving chain is unaffected");
  });

  it("does not collect a value shared with a pruned fork", async () => {
    const states = await newStates();
    const s0 = states.getState(hh(0));
    assert.ok(s0 !== null);
    await states.updateAndSetState(hh(1), s0, storageUpdate(BIG_1));
    // the fork writes the very same value
    const fork = states.getState(hh(0));
    assert.ok(fork !== null);
    await states.updateAndSetState(hh(0xaa), fork, storageUpdate(BIG_1));

    states.markUnused(hh(0xaa));

    assert.ok(canReadFully(states.getState(hh(1))), "value still referenced by the surviving chain");
  });

  it("follows the importer lifecycle: commit finalized, then prune", async () => {
    const states = await newStates();
    const s0 = states.getState(hh(0));
    assert.ok(s0 !== null);
    await states.updateAndSetState(hh(1), s0, storageUpdate(BIG_1));
    const s1 = states.getState(hh(1));
    assert.ok(s1 !== null);
    await states.updateAndSetState(hh(2), s1, storageUpdate(BIG_2));

    // finality round: 1 and 2 finalized, genesis and 1 pruned
    states.commitFinalized([hh(1), hh(2)]);
    states.markUnused(hh(0));
    states.markUnused(hh(1));

    assert.strictEqual(states.getState(hh(1)), null);
    assert.ok(canReadFully(states.getState(hh(2))), "finalized tip fully readable after pruning");
  });
});
```
