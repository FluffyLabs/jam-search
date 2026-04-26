---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/core/codec/encode.test.ts#L1-L132
title: sdk/core/codec/encode.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 2
content_sha: 858450aa7fb774da79c8d585ebe1f0557c4ff232fae7e9a8e5f62e314792cec9
language: typescript
---
`sdk/core/codec/encode.test.ts` (lines 1–132)

```typescript
import { Assert, Test, test } from "../../test/utils";
import { BytesBlob } from "../bytes";
import { Encoder } from "./encode";

export const TESTS: Test[] = [
  test("encode u8", () => {
    const e = Encoder.create();
    e.u8(0x42);

    const assert = Assert.create();
    assert.isEqual(e.bytesWritten(), 1, "bytesWritten");
    assert.isEqualBytes(e.finish(), BytesBlob.parseBlob("0x42").okay!, "bytes");
    return assert;
  }),

  test("encode u16 little-endian", () => {
    const e = Encoder.create();
    e.u16(0x0102);

    const assert = Assert.create();
    assert.isEqual(e.bytesWritten(), 2, "bytesWritten");
    assert.isEqualBytes(e.finish(), BytesBlob.parseBlob("0x0201").okay!, "bytes");
    return assert;
  }),

  test("encode u32 little-endian", () => {
    const e = Encoder.create();
    e.u32(0x01020304);

    const assert = Assert.create();
    assert.isEqual(e.bytesWritten(), 4, "bytesWritten");
    assert.isEqualBytes(e.finish(), BytesBlob.parseBlob("0x04030201").okay!, "bytes");
    return assert;
  }),

  test("encode u64 little-endian", () => {
    const e = Encoder.create();
    // biome-ignore lint/correctness/noPrecisionLoss: AS u64 literal
    e.u64(0x0102030405060708);

    const assert = Assert.create();
    assert.isEqual(e.bytesWritten(), 8, "bytesWritten");
    assert.isEqualBytes(e.finish(), BytesBlob.parseBlob("0x0807060504030201").okay!, "bytes");
    return assert;
  }),

  test("encode multiple primitives", () => {
    const e = Encoder.create();
    e.u8(0x01);
    e.u16(1234);
    e.u32(0xdeadbeef);

    const assert = Assert.create();
    assert.isEqual(e.bytesWritten(), 7, "bytesWritten");
    assert.isEqualBytes(e.finish(), BytesBlob.parseBlob("0x01d204efbeadde").okay!, "bytes");
    return assert;
  }),

  test("encode varU64 single byte", () => {
    const e = Encoder.create();
    e.varU64(0);
    e.varU64(5);
    e.varU64(127);

    const assert = Assert.create();
    assert.isEqual(e.bytesWritten(), 3, "bytesWritten");
    assert.isEqualBytes(e.finish(), BytesBlob.parseBlob("0x00057f").okay!, "bytes");
    return assert;
  }),

  test("encode varU64 two bytes", () => {
    const e = Encoder.create();
    e.varU64(128);

    const assert = Assert.create();
    assert.isEqual(e.bytesWritten(), 2, "bytesWritten");
    assert.isEqualBytes(e.finish(), BytesBlob.parseBlob("0x8080").okay!, "bytes");
    return assert;
  }),

  test("encode varU64 1234", () => {
    const e = Encoder.create();
    e.varU64(1234);

    const assert = Assert.create();
    assert.isEqual(e.bytesWritten(), 2, "bytesWritten");
    assert.isEqualBytes(e.finish(), BytesBlob.parseBlob("0x84d2").okay!, "bytes");
    return assert;
  }),

  test("encode varU64 three bytes", () => {
    const e = Encoder.create();
    // 16384 = 2^14 → needs 3 bytes (l=2)
    e.varU64(16384);

    const assert = Assert.create();
    assert.isEqual(e.bytesWritten(), 3, "bytesWritten");
    assert.isEqualBytes(e.finish(), BytesBlob.parseBlob("0xc00040").okay!, "bytes");
    return assert;
  }),

  test("encode varU64 nine bytes (max)", () => {
    const e = Encoder.create();
    e.varU64(u64.MAX_VALUE);

    const assert = Assert.create();
    assert.isEqual(e.bytesWritten(), 9, "bytesWritten");
    assert.isEqualBytes(e.finish(), BytesBlob.parseBlob("0xffffffffffffffffff").okay!, "bytes");
    return assert;
  }),

  test("encode bytesFixLen", () => {
    const raw = BytesBlob.parseBlob("0xdeadbeef").okay!;
    const e = Encoder.create();
    e.bytesFixLen(raw);

    const assert = Assert.create();
    assert.isEqual(e.bytesWritten(), 4, "bytesWritten");
    assert.isEqualBytes(e.finish(), raw, "bytes");
    return assert;
  }),

  test("encode bytesFixLen empty", () => {
    const e = Encoder.create();
    e.bytesFixLen(BytesBlob.empty());

    const assert = Assert.create();
    assert.isEqual(e.bytesWritten(), 0, "bytesWritten");
    return assert;
  }),

  test("encode bytesVarLen", () => {
```
