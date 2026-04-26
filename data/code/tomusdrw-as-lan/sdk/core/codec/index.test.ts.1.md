---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/core/codec/index.test.ts#L129-L258
title: sdk/core/codec/index.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 1
chunk_total: 3
content_sha: ab23a1ad4319c499c624627fb778d94867ae94bdff7997d24efa91b7aea82d36
language: typescript
---
`sdk/core/codec/index.test.ts` (lines 129–258)

```typescript
    return assert;
  }),

  test("roundtrip varU64 large values", () => {
    const values: u64[] = [
      0x0100000000000000 - 1, // 8 bytes (max seven: 2^56-1)
      0x0100000000000000, // 9 bytes (min eight: 2^56)
      u64.MAX_VALUE, // 9 bytes
    ];

    const e = Encoder.create();
    for (let i = 0; i < values.length; i++) {
      e.varU64(values[i]);
    }

    const d = Decoder.fromBlob(e.finishRaw());
    const assert = Assert.create();
    for (let i = 0; i < values.length; i++) {
      assert.isEqual(d.varU64(), values[i], `value[${i}]`);
    }
    assert.isEqual(d.isFinished(), true, "finished");
    assert.isEqual(d.isError, false, "no error");
    return assert;
  }),

  test("roundtrip bytesFixLen", () => {
    const raw = BytesBlob.parseBlob("0xdeadbeefcafebabe").okay!;

    const e = Encoder.create();
    e.bytesFixLen(raw);

    const d = Decoder.fromBlob(e.finishRaw());
    const assert = Assert.create();
    assert.isEqualBytes(d.bytesFixLen(8), raw, "bytes");
    assert.isEqual(d.isFinished(), true, "finished");
    assert.isEqual(d.isError, false, "no error");
    return assert;
  }),

  test("roundtrip bytesVarLen", () => {
    const blob = BytesBlob.parseBlob("0x1234567890abcdef").okay!;

    const e = Encoder.create();
    e.bytesVarLen(blob);

    const d = Decoder.fromBlob(e.finishRaw());
    const assert = Assert.create();
    assert.isEqualBytes(d.bytesVarLen(), blob, "blob");
    assert.isEqual(d.isFinished(), true, "finished");
    assert.isEqual(d.isError, false, "no error");
    return assert;
  }),

  test("roundtrip bytes32", () => {
    const raw = BytesBlob.parseBlob("0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef").okay!;
    const b32 = Bytes32.wrapUnchecked(raw.raw);

    const e = Encoder.create();
    e.bytes32(b32);

    const d = Decoder.fromBlob(e.finishRaw());
    const assert = Assert.create();
    const decoded = d.bytes32();
    assert.isEqualBytes(BytesBlob.wrap(decoded.raw), raw, "bytes32");
    assert.isEqual(d.isFinished(), true, "finished");
    assert.isEqual(d.isError, false, "no error");
    return assert;
  }),

  test("roundtrip object", () => {
    const codec = PointCodec.create();
    const point = new Point(42, 99);

    const e = Encoder.create();
    e.object(codec, point);

    const d = Decoder.fromBlob(e.finishRaw());
    const assert = Assert.create();
    const result = d.object<Point>(codec);
    assert.isEqual(result.isOkay, true, "decoded ok");
    assert.isEqual(result.okay!.x, 42, "x");
    assert.isEqual(result.okay!.y, 99, "y");
    assert.isEqual(d.isFinished(), true, "finished");
    assert.isEqual(d.isError, false, "no error");
    return assert;
  }),

  test("roundtrip optional present", () => {
    const codec = PointCodec.create();

    const e = Encoder.create();
    e.optional<Point>(codec, new Point(10, 20));

    const d = Decoder.fromBlob(e.finishRaw());
    const assert = Assert.create();
    const result = d.optional<Point>(codec);
    assert.isEqual(result.isOkay, true, "decoded ok");
    const val = result.okay!;
    assert.isEqual(val !== null, true, "is some");
    assert.isEqual(val.x, 10, "x");
    assert.isEqual(val.y, 20, "y");
    assert.isEqual(d.isFinished(), true, "finished");
    return assert;
  }),

  test("roundtrip optional absent", () => {
    const codec = PointCodec.create();

    const e = Encoder.create();
    e.optional<Point>(codec, null);

    const d = Decoder.fromBlob(e.finishRaw());
    const assert = Assert.create();
    const result = d.optional<Point>(codec);
    assert.isEqual(result.isOkay, true, "decoded ok");
    assert.isEqual(result.okay === null, true, "is none");
    assert.isEqual(d.isFinished(), true, "finished");
    return assert;
  }),

  test("roundtrip mixed", () => {
    const blob = BytesBlob.parseBlob("0xcafe").okay!;

    const e = Encoder.create();
    e.u8(1);
    e.u16(1234);
    e.varU64(9999);
    e.bytesVarLen(blob);
    e.u64(0xaabbccdd);

```
