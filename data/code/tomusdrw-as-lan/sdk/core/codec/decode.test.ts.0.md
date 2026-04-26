---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/core/codec/decode.test.ts#L1-L94
title: sdk/core/codec/decode.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 1
content_sha: d8dd360e58dd9f4f17bfb383af36198466731d2cc8f8bce8a3063a8412906fd8
language: typescript
---
`sdk/core/codec/decode.test.ts` (lines 1–94)

```typescript
import { Assert, Test, test } from "../../test/utils";
import { BytesBlob } from "../bytes";
import { Decoder } from "./decode";
import { Encoder } from "./encode";

export const TESTS: Test[] = [
  test("varU32 normal value", () => {
    const e = Encoder.create();
    e.varU64(42);
    e.varU64(0xffff_ffff);

    const d = Decoder.fromBlob(e.finishRaw());
    const assert = Assert.create();
    assert.isEqual(d.varU32(), 42, "small");
    assert.isEqual(d.varU32(), 0xffff_ffff, "max u32");
    assert.isEqual(d.isFinished(), true, "finished");
    assert.isEqual(d.isError, false, "no error");
    return assert;
  }),

  test("varU32 overflow sets error", () => {
    const e = Encoder.create();
    e.varU64(0x1_0000_0000); // one above u32 max

    const d = Decoder.fromBlob(e.finishRaw());
    const assert = Assert.create();
    assert.isEqual(d.varU32(), 0, "returns 0");
    assert.isEqual(d.isError, true, "error set");
    return assert;
  }),

  test("varU32 missing bytes sets error", () => {
    const d = Decoder.fromBlob(BytesBlob.empty().raw);
    const assert = Assert.create();
    assert.isEqual(d.varU32(), 0, "returns 0");
    assert.isEqual(d.isError, true, "error set");
    return assert;
  }),

  test("decode judgemenet", () => {
    const data = BytesBlob.parseBlob(
      "0x01d204deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
    ).okay!;
    const decoder = Decoder.fromBytesBlob(data);

    // then
    const assert = Assert.create();
    assert.isEqual(decoder.u8(), 1, "isWorkReportValid");
    assert.isEqual(decoder.u16(), 1234, "index");
    assert.isEqualBytes(
      decoder.bytesFixLen(64),
      BytesBlob.parseBlob(
        "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
      ).okay!,
      "index",
    );
    assert.isEqual(decoder.isFinished(), true);
    assert.isEqual(decoder.isError, false);
    return assert;
  }),
  test("decode blob", () => {
    const data = BytesBlob.parseBlob("0x051234567890").okay!;
    const decoder = Decoder.fromBytesBlob(data);

    // then
    const assert = Assert.create();
    assert.isEqual(decoder.isFinished(), false);
    assert.isEqualBytes(decoder.bytesVarLen(), BytesBlob.parseBlob("0x1234567890").okay!, "blob");
    assert.isEqual(decoder.isFinished(), true);
    assert.isEqual(decoder.isError, false);
    return assert;
  }),

  test("decode u24 little-endian", () => {
    const a = Assert.create();
    // 0x010203 LE || 0xFFFFFF LE
    const bytes = BytesBlob.parseBlob("0x030201ffffff").okay!;
    const d = Decoder.fromBytesBlob(bytes);
    a.isEqual(d.u24(), 0x010203, "first value");
    a.isEqual(d.u24(), 0xffffff, "second value");
    a.isEqual(d.isFinished(), true, "fully consumed");
    return a;
  }),

  test("decode u24 short read sets isError", () => {
    const a = Assert.create();
    const bytes = BytesBlob.parseBlob("0x0000").okay!;
    const d = Decoder.fromBytesBlob(bytes);
    const v = d.u24();
    a.isEqual(v, 0, "garbage value on underrun");
    a.isEqual(d.isError, true, "isError set");
    return a;
  }),
];
```
