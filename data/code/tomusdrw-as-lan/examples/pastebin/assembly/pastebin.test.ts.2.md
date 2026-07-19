---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/pastebin/assembly/pastebin.test.ts#L192-L263
title: examples/pastebin/assembly/pastebin.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 2de7ea9fa23254942406b95425954123af364c87ff7ef957102cb6b5d7052f28
language: typescript
---
`examples/pastebin/assembly/pastebin.test.ts` (lines 192–263)

```typescript
    const authRaw = unpackResult(dispatch(coreIndex.ptr(), coreIndex.length));
    const authResp = RefineContext.create().response.decode(Decoder.fromBlob(authRaw)).okay!;
    assert.isEqual(authResp.result, 0, "is_authorized result");
    assert.isEqual(<u32>authResp.data.length, <u32>0, "is_authorized has no data");

    // len > 2: the refine path. Build a proper RefineArgs encoding and verify
    // the dispatch returns the same 36-byte okBlob that calling refine directly would.
    const payload = BytesBlob.parseBlob("0xdeadbeef").okay!;
    const refResp = RefineCall.create().withServiceId(SERVICE_ID).call(refine, payload);

    // Now call the same bytes via the dispatch function.
    const refArgs = RefineArgs.create(0, 0, SERVICE_ID, payload, Bytes32.zero());
    const enc = Encoder.create();
    RefineContext.create().refineArgs.encode(refArgs, enc);
    const buf = enc.finish();
    const dispRaw = unpackResult(dispatch(buf.ptr(), buf.length));
    const dispResp = RefineContext.create().response.decode(Decoder.fromBlob(dispRaw)).okay!;

    assert.isEqual(dispResp.result, refResp.result, "dispatch result matches direct refine");
    assert.isEqualBytes(dispResp.data, refResp.data, "dispatch data matches refine");
    return assert;
  }),
  test("accumulate skips insertion when solicit returns FULL", () => {
    TestEcalli.reset();
    TestPreimages.setSolicitResult(EcalliResult.FULL);
    const assert = Assert.create();

    const payload = BytesBlob.parseBlob("0x01020304").okay!;
    const hashBytes = blake2b256(payload.raw);
    const okBlob = buildOkBlob(hashBytes, 4);

    callAccumulateSingle(77, okBlob);

    // No paste entry should have been written — insertion is gated on solicit success.
    const storage = CurrentServiceData.create();
    const hash = Bytes32.wrapUnchecked(hashBytes);
    const stored = storage.read(pasteKey(hash));
    assert.isEqual(stored.isSome, false, "paste not stored after solicit failure");
    return assert;
  }),
  test("cleanup forgets both pastes from a shared expiry bucket", () => {
    TestEcalli.reset();
    const assert = Assert.create();

    // Two distinct payloads inserted at the same slot share an expiry bucket.
    const a = BytesBlob.parseBlob("0x010203").okay!;
    const b = BytesBlob.parseBlob("0x090807").okay!;
    const hashA = blake2b256(a.raw);
    const hashB = blake2b256(b.raw);
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
