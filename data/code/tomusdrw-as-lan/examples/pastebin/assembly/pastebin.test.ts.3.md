---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/pastebin/assembly/pastebin.test.ts#L300-L333
title: examples/pastebin/assembly/pastebin.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 3
chunk_total: 4
content_sha: 663917cb2913511b643b86a53ad2f71aaa3050804a29ad71ad396253c4b6b749
language: typescript
---
`examples/pastebin/assembly/pastebin.test.ts` (lines 300–333)

```typescript
    // Two distinct payloads inserted at the same slot share an expiry bucket.
    const a = new Uint8Array(3);
    a[0] = 1;
    a[1] = 2;
    a[2] = 3;
    const b = new Uint8Array(3);
    b[0] = 9;
    b[1] = 8;
    b[2] = 7;
    const hashA = blake2b256(a);
    const hashB = blake2b256(b);
    const okA = buildOkBlob(hashA, 3);
    const okB = buildOkBlob(hashB, 3);

    // Both at slot 5 → expiry bucket at slot 5 + TTL_SLOTS = 1005.
    callAccumulateSingle(5, okA);
    callAccumulateSingle(5, okB);

    // Pre-cleanup: expiry bucket holds exactly 2 hashes (64 bytes).
    const storage = CurrentServiceData.create();
    const bucket = storage.read(expiryKey(1005));
    assert.isEqual(bucket.isSome, true, "expiry bucket exists pre-cleanup");
    if (bucket.isSome) assert.isEqual(<u32>bucket.val!.length, <u32>64, "bucket holds 2 hashes");

    // Advance cursor past 1005 with empty calls (131 × 8 = 1048 ≥ 1005).
    for (let i: u32 = 0; i < 130; i += 1) callAccumulateEmpty(1005 + i);

    // Both pastes + the bucket itself should be gone.
    assert.isEqual(storage.read(pasteKey(Bytes32.wrapUnchecked(hashA))).isSome, false, "paste A deleted");
    assert.isEqual(storage.read(pasteKey(Bytes32.wrapUnchecked(hashB))).isSome, false, "paste B deleted");
    assert.isEqual(storage.read(expiryKey(1005)).isSome, false, "bucket deleted");
    return assert;
  }),
];
```
