---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/core/codec/encode.test.ts#L124-L220
title: sdk/core/codec/encode.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 1
chunk_total: 2
content_sha: e4c566a313898bd11f9d80e8c526fad34dddef98b021ce5b597be1ce3a2a03be
language: typescript
---
`sdk/core/codec/encode.test.ts` (lines 124–220)

```typescript
    const e = Encoder.create();
    e.bytesFixLen(BytesBlob.empty());

    const assert = Assert.create();
    assert.isEqual(e.bytesWritten(), 0, "bytesWritten");
    return assert;
  }),

  test("encode bytesVarLen", () => {
    const blob = BytesBlob.parseBlob("0x1234567890").okay!;
    const e = Encoder.create();
    e.bytesVarLen(blob);

    const assert = Assert.create();
    // 5 bytes payload + 1 byte length prefix
    assert.isEqual(e.bytesWritten(), 6, "bytesWritten");
    assert.isEqualBytes(e.finish(), BytesBlob.parseBlob("0x051234567890").okay!, "bytes");
    return assert;
  }),

  test("encode buffer growth", () => {
    // Start with capacity 4, then write more than 4 bytes
    const e = Encoder.create(4);
    e.u32(0xaabbccdd);
    e.u32(0x11223344);

    const assert = Assert.create();
    assert.isEqual(e.bytesWritten(), 8, "bytesWritten");
    assert.isEqualBytes(e.finish(), BytesBlob.parseBlob("0xddccbbaa44332211").okay!, "bytes");
    return assert;
  }),

  test("into: writes to pre-allocated buffer", () => {
    const buf = BytesBlob.zero(4);
    const e = Encoder.into(buf.raw);
    e.u8(0xaa);
    e.u8(0xbb);
    e.u16(0x1234);

    const assert = Assert.create();
    assert.isEqual(e.isError, false, "no error");
    assert.isEqual(e.bytesWritten(), 4, "bytesWritten");
    assert.isEqualBytes(buf, BytesBlob.parseBlob("0xaabb3412").okay!, "buffer contents");
    return assert;
  }),

  test("into: error on overflow", () => {
    const buf = BytesBlob.zero(2);
    const e = Encoder.into(buf.raw);
    e.u8(0x01);
    e.u32(0xdeadbeef);

    const assert = Assert.create();
    assert.isEqual(e.isError, true, "overflow detected");
    assert.isEqual(e.bytesWritten(), 1, "only first write counted");
    return assert;
  }),

  test("into: subsequent writes skipped after overflow", () => {
    const buf = BytesBlob.zero(3);
    const e = Encoder.into(buf.raw);
    e.u8(0xaa);
    e.u32(0xdeadbeef); // overflows — sets error
    e.u8(0xbb); // should be skipped

    const assert = Assert.create();
    assert.isEqual(e.isError, true, "error set");
    assert.isEqual(e.bytesWritten(), 1, "offset unchanged after error");
    // buffer should only have the first byte written
    assert.isEqualBytes(e.finish(), BytesBlob.parseBlob("0xaa").okay!, "finish returns written portion");
    return assert;
  }),

  test("into: exact fit", () => {
    const buf = BytesBlob.zero(8);
    const e = Encoder.into(buf.raw);
    // biome-ignore lint/correctness/noPrecisionLoss: AS u64 literal
    e.u64(0x0102030405060708);

    const assert = Assert.create();
    assert.isEqual(e.isError, false, "no error");
    assert.isEqual(e.bytesWritten(), 8, "bytesWritten");
    assert.isEqualBytes(buf, BytesBlob.parseBlob("0x0807060504030201").okay!, "bytes");
    return assert;
  }),

  test("into: varU64 overflow", () => {
    const buf = BytesBlob.zero(1);
    const e = Encoder.into(buf.raw);
    e.varU64(128); // needs 2 bytes

    const assert = Assert.create();
    assert.isEqual(e.isError, true, "overflow");
    assert.isEqual(e.bytesWritten(), 0, "nothing written");
    return assert;
  }),
];
```
