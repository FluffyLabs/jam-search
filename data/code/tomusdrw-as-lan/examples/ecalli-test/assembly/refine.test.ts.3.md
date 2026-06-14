---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/refine.test.ts#L359-L409
title: examples/ecalli-test/assembly/refine.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 3
chunk_total: 4
content_sha: 4c874eefdacb675e66f55f335157305693f942c010273e4dec49d570d01c40b7
language: typescript
---
`examples/ecalli-test/assembly/refine.test.ts` (lines 359–409)

```typescript
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

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, -1, "historical_lookup returns NONE");
    assert.isEqual(resp.data.raw.length, 0, "no data");
    return assert;
  }),

  test("historical_lookup: returns custom preimage data", () => {
    const preimage = BytesBlob.parseBlob("0xabcdef0123").okay!;
    TestHistoricalLookup.setPreimage(preimage.raw);

    const p = Encoder.create();
    p.varU64(EcalliIndex.HistoricalLookup);
    p.varU64(u64(u32.MAX_VALUE));
    p.bytesFixLen(BytesBlob.zero(32));
    p.varU64(0);
    p.varU64(256);

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, 5, "custom preimage length");
    assert.isEqualBytes(resp.data, preimage, "preimage data");
    return assert;
  }),

  test("peek: returns WHO for unknown machine", () => {
    TestMachine.setPeekResult(-4);
    const p = Encoder.create();
    p.varU64(EcalliIndex.Peek);
    p.varU64(99);
    p.varU64(0);
    p.varU64(8);

    const resp = callRefine(p.finish());
    const assert = Assert.create();
    assert.isEqual(resp.result, -4, "peek returns WHO");
    return assert;
  }),
];
```
