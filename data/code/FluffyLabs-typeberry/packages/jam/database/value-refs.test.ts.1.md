---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database/value-refs.test.ts#L124-L216
title: packages/jam/database/value-refs.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: 83018bd1f966ff82f92ded937cd2fe4e52b1f0398368108987f3f9698ae638f1
language: typescript
---
`packages/jam/database/value-refs.test.ts` (lines 124–216)

```typescript
    const update = refs.releaseUnfinalized(hh(30));
    apply(update);

    assert.strictEqual(isEmptyUpdate(update), false);
    assert.ok(!values.has(W), "dead-fork-only value is collected");
  });

  it("does not touch finalized references when releasing an already finalized header", () => {
    const s = setup();
    const { refs, values, apply } = s;
    const V = vh(1);

    importBlock(s, hh(1), { inserted: [V] });
    apply(refs.commitFinalized([hh(1)]));

    const update = refs.releaseUnfinalized(hh(1));
    apply(update);

    assert.strictEqual(isEmptyUpdate(update), true, "header was already finalized");
    assert.ok(values.has(V), "finalized value is untouched");
  });

  it("ignores unknown headers in commitFinalized", () => {
    const { refs } = setup();
    const update = refs.commitFinalized([hh(99)]);
    assert.strictEqual(isEmptyUpdate(update), true);
  });

  it("ignores a duplicate import of the same header", () => {
    const s = setup();
    const { refs, values, apply } = s;
    const V = vh(1);

    importBlock(s, hh(1), { inserted: [V] });
    const second = refs.onImport(hh(1), { inserted: [V], removed: [] });
    assert.strictEqual(isEmptyUpdate(second), true, "duplicate import is a no-op");

    // had the duplicate bumped `pending` twice, releasing the fork would leave
    // a dangling count and the value would never be collected
    apply(refs.releaseUnfinalized(hh(1)));
    assert.ok(!values.has(V));
  });

  it("counts a header only once within a single commitFinalized call", () => {
    const s = setup();
    const { refs, values, apply } = s;
    const V = vh(1);

    importBlock(s, hh(1), { inserted: [V] });
    apply(refs.commitFinalized([hh(1), hh(1)]));

    importBlock(s, hh(2), { removed: [V] });
    apply(refs.commitFinalized([hh(2)]));
    assert.ok(!values.has(V), "a double-counted finalized reference would keep the value alive");
  });

  it("does not remove a value re-referenced later within the same batch", () => {
    const s = setup();
    const { refs, values, apply } = s;
    const V = vh(1);

    apply(refs.onInitial([V]));
    values.write(V);

    // one block removes V, its descendant re-adds it; both finalize at once
    importBlock(s, hh(1), { removed: [V] });
    importBlock(s, hh(2), { inserted: [V] });
    const update = refs.commitFinalized([hh(1), hh(2)]);
    apply(update);

    assert.strictEqual(update.removeValues.length, 0);
    assert.ok(values.has(V), "the re-added reference keeps the value alive");
  });

  it("emits absolute counts so re-applying an update is harmless", () => {
    const s = setup();
    const { refs, store, values, apply } = s;
    const V = vh(1);

    importBlock(s, hh(1), { inserted: [V] });
    const update = refs.commitFinalized([hh(1)]);
    apply(update);
    // crash-replay: same batch applied again
    apply(update);

    assert.strictEqual(store.getFinalizedCount(V), 1);
    assert.strictEqual(store.getPendingCount(V), 0);

    importBlock(s, hh(2), { removed: [V] });
    apply(refs.commitFinalized([hh(2)]));
    assert.ok(!values.has(V), "refcounting still exact after replay");
  });
});
```
