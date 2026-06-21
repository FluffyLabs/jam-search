---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/item.test.ts#L202-L307
title: sdk/jam/accumulate/item.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 0ff613ee2c624c6c1a93e9f8abab984643b27bbeeede74a2c2d2ae58f69cdc92
language: typescript
---
`sdk/jam/accumulate/item.test.ts` (lines 202–307)

```typescript
    const decoded = pendingTransferCodec.decode(d).okay!;

    const assert = Assert.create();
    assert.isEqual(decoded.source, 100, "source");
    assert.isEqual(decoded.destination, 200, "destination");
    assert.isEqual(decoded.amount, 999999, "amount");
    assert.isEqualBytes(decoded.memo, memo, "memo");
    assert.isEqual(decoded.gas, 50000, "gas");
    assert.isEqual(d.isFinished(), true, "finished");
    assert.isEqual(d.isError, false, "no error");
    return assert;
  }),

  test("PendingTransfer roundtrip with short memo (zero-padded)", () => {
    const shortMemo = BytesBlob.parseBlob("0xdeadbeef").okay!;
    const original = PendingTransfer.create(1, 2, 100, shortMemo, 500);

    const e = Encoder.create();
    pendingTransferCodec.encode(original, e);
    const d = Decoder.fromBlob(e.finishRaw());
    const decoded = pendingTransferCodec.decode(d).okay!;

    const expectedMemo = BytesBlob.zero(TRANSFER_MEMO_SIZE);
    expectedMemo.raw.set(shortMemo.raw);

    const assert = Assert.create();
    assert.isEqual(decoded.source, 1, "source");
    assert.isEqual(decoded.destination, 2, "destination");
    assert.isEqual(decoded.amount, 100, "amount");
    assert.isEqualBytes(decoded.memo, expectedMemo, "padded memo");
    assert.isEqual(decoded.gas, 500, "gas");
    assert.isEqual(d.isFinished(), true, "finished");
    return assert;
  }),

  test("PendingTransfer roundtrip with empty memo", () => {
    const original = PendingTransfer.create(0, 0xffffffff, u64.MAX_VALUE, BytesBlob.empty(), 0);

    const e = Encoder.create();
    pendingTransferCodec.encode(original, e);
    const d = Decoder.fromBlob(e.finishRaw());
    const decoded = pendingTransferCodec.decode(d).okay!;

    const assert = Assert.create();
    assert.isEqual(decoded.source, 0, "source zero");
    assert.isEqual(decoded.destination, 0xffffffff, "destination max");
    assert.isEqual(decoded.amount, u64.MAX_VALUE, "amount max");
    assert.isEqualBytes(decoded.memo, BytesBlob.zero(TRANSFER_MEMO_SIZE), "zero memo");
    assert.isEqual(decoded.gas, 0, "gas zero");
    assert.isEqual(d.isFinished(), true, "finished");
    return assert;
  }),

  test("PendingTransfer encodeTagged roundtrip", () => {
    const original = PendingTransfer.create(10, 20, 300, BytesBlob.empty(), 400);

    const e = Encoder.create();
    accumulateItemCodec.encode(AccumulateItem.fromTransfer(original), e);
    const d = Decoder.fromBlob(e.finishRaw());

    const assert = Assert.create();
    const tag = d.varU32();
    assert.isEqual(tag, AccumulateItemKind.Transfer, "tag");

    const decoded = pendingTransferCodec.decode(d).okay!;
    assert.isEqual(decoded.source, 10, "source");
    assert.isEqual(decoded.destination, 20, "destination");
    assert.isEqual(decoded.amount, 300, "amount");
    assert.isEqual(decoded.gas, 400, "gas");
    assert.isEqual(d.isFinished(), true, "finished");
    return assert;
  }),

  // ─── Negative decode tests ───

  test("WorkExecResult decode rejects invalid kind", () => {
    const e = Encoder.create();
    e.varU64(99);
    const d = Decoder.fromBlob(e.finishRaw());
    const r = workExecResultCodec.decode(d);

    const assert = Assert.create();
    assert.isEqual(r.isError, true, "should fail");
    return assert;
  }),

  test("AccumulateItem decode rejects unknown tag", () => {
    const e = Encoder.create();
    e.varU64(5);
    const d = Decoder.fromBlob(e.finishRaw());
    const r = accumulateItemCodec.decode(d);

    const assert = Assert.create();
    assert.isEqual(r.isError, true, "should fail");
    return assert;
  }),

  test("AccumulateItem decode rejects empty input", () => {
    const d = Decoder.fromBytesBlob(BytesBlob.empty());
    const r = accumulateItemCodec.decode(d);

    const assert = Assert.create();
    assert.isEqual(r.isError, true, "should fail on empty");
    return assert;
  }),
];
```
