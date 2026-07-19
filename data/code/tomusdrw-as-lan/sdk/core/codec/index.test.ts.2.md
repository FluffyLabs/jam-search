---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/core/codec/index.test.ts#L249-L270
title: sdk/core/codec/index.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 2
chunk_total: 3
content_sha: d0185eb52e3b43f15e06dbe2c90f3f34e5898a054c9b5e7fca22ac5e94229981
language: typescript
---
`sdk/core/codec/index.test.ts` (lines 249–270)

```typescript
  test("roundtrip mixed", () => {
    const blob = BytesBlob.parseBlob("0xcafe").okay!;

    const e = Encoder.create();
    e.u8(1);
    e.u16(1234);
    e.varU64(9999);
    e.bytesVarLen(blob);
    e.u64(0xaabbccdd);

    const d = Decoder.fromBlob(e.finishRaw());
    const assert = Assert.create();
    assert.isEqual(d.u8(), 1, "u8");
    assert.isEqual(d.u16(), 1234, "u16");
    assert.isEqual(d.varU64(), 9999, "varU64");
    assert.isEqualBytes(d.bytesVarLen(), blob, "blob");
    assert.isEqual(d.u64(), 0xaabbccdd, "u64");
    assert.isEqual(d.isFinished(), true, "finished");
    assert.isEqual(d.isError, false, "no error");
    return assert;
  }),
];
```
