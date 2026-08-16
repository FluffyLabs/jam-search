---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/preimages.test.ts#L202-L246
title: packages/jam/transition/preimages.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 2
chunk_total: 3
content_sha: b3b6c7b1c8fc95eae18c9944be078c97152cdab35cde419ff00bada2f38d268d
language: typescript
---
`packages/jam/transition/preimages.test.ts` (lines 202–246)

```typescript
    const hash1 = blake2b.hashBytes(blob1).asOpaque();
    const hash2 = blake2b.hashBytes(blob2).asOpaque();

    const lookupHistory = [
      LookupHistoryItem.new(hash1, tryAsU32(blob1.length), tryAsLookupHistorySlots([])),
      LookupHistoryItem.new(hash2, tryAsU32(blob2.length), tryAsLookupHistorySlots([])),
    ];

    const state = InMemoryState.partial(tinyChainSpec, {
      services: new Map([
        [tryAsServiceId(0), createAccount(tryAsServiceId(0), [], lookupHistory)],
        [tryAsServiceId(1), createAccount(tryAsServiceId(1), [], lookupHistory)],
      ]),
    });
    const preimages = new Preimages(state, blake2b);

    const input = createInput(
      [
        { requester: tryAsServiceId(0), blob: blob1 },
        { requester: tryAsServiceId(1), blob: blob2 },
      ],
      tryAsTimeSlot(12),
    );

    const result = preimages.integrate(input);
    assert.deepStrictEqual(result.isOk, true);
    state.applyUpdate(result.ok);

    const account0 = state.services.get(tryAsServiceId(0));
    assert.ok(account0 !== undefined);
    const account0LookupHistory = Array.from(account0.data.lookupHistory.values());
    assert.strictEqual(account0.data.preimages.has(hash1), true);
    assert.strictEqual(account0.data.preimages.get(hash1)?.blob, blob1);
    assert.deepStrictEqual(account0LookupHistory[0][0].slots, tryAsLookupHistorySlots([tryAsTimeSlot(12)]));
    assert.deepStrictEqual(account0LookupHistory[1][0].slots, tryAsLookupHistorySlots([]));

    const account1 = state.services.get(tryAsServiceId(1));
    assert.ok(account1 !== undefined);
    const account1LookupHistory = Array.from(account1.data.lookupHistory.values());
    assert.strictEqual(account1.data.preimages.has(hash2), true);
    assert.strictEqual(account1.data.preimages.get(hash2)?.blob, blob2);
    assert.deepStrictEqual(account1LookupHistory[0][0].slots, tryAsLookupHistorySlots([]));
    assert.deepStrictEqual(account1LookupHistory[1][0].slots, tryAsLookupHistorySlots([tryAsTimeSlot(12)]));
  });
});
```
