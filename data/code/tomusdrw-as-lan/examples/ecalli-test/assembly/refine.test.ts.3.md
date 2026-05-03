---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/refine.test.ts#L347-L420
title: examples/ecalli-test/assembly/refine.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 3
chunk_total: 4
content_sha: 82e4f62979c545b8e9250d1aee1972909f55e75208d4b9a9a620ef1dc17a6755
language: typescript
---
`examples/ecalli-test/assembly/refine.test.ts` (lines 347–420)

```typescript
    assert.isEqual(resp.data.raw[0], 0x2a, "r8 byte 0");
    assert.isEqual(resp.data.raw[1], 0x00, "r8 byte 1");
    return assert;
  }),

  test("invoke: returns WHO for unknown machine", () => {
    TestMachine.setInvokeResult(-4, 0); // WHO
    const p = Encoder.create();
    p.varU64(EcalliIndex.Invoke);
    p.varU64(99);
    p.bytesVarLen(BytesBlob.zero(8));

    const resp = callRefine(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, -4, "invoke returns WHO");
    return assert;
  }),

  test("historical_lookup: returns NONE when configured", () => {
    TestHistoricalLookup.setNone();
    const p = Encoder.create();
    p.varU64(EcalliIndex.HistoricalLookup);
    p.varU64(u64(u32.MAX_VALUE));
    p.bytesFixLen(BytesBlob.zero(32));
    p.varU64(0);
    p.varU64(256);

    const resp = callRefine(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, -1, "historical_lookup returns NONE");
    assert.isEqual(resp.data.raw.length, 0, "no data");
    return assert;
  }),

  test("historical_lookup: returns custom preimage data", () => {
    const preimage = new Uint8Array(5);
    preimage[0] = 0xab;
    preimage[1] = 0xcd;
    preimage[2] = 0xef;
    preimage[3] = 0x01;
    preimage[4] = 0x23;
    TestHistoricalLookup.setPreimage(preimage);

    const p = Encoder.create();
    p.varU64(EcalliIndex.HistoricalLookup);
    p.varU64(u64(u32.MAX_VALUE));
    p.bytesFixLen(BytesBlob.zero(32));
    p.varU64(0);
    p.varU64(256);

    const resp = callRefine(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, 5, "custom preimage length");
    assert.isEqual(resp.data.raw.length, 5, "data length");
    assert.isEqual(resp.data.raw[0], 0xab, "data[0]");
    assert.isEqual(resp.data.raw[1], 0xcd, "data[1]");
    assert.isEqual(resp.data.raw[4], 0x23, "data[4]");
    return assert;
  }),

  test("peek: returns WHO for unknown machine", () => {
    TestMachine.setPeekResult(-4);
    const p = Encoder.create();
    p.varU64(EcalliIndex.Peek);
    p.varU64(99);
    p.varU64(0);
    p.varU64(8);

    const resp = callRefine(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, -4, "peek returns WHO");
    return assert;
  }),
];
```
