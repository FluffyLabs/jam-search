---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/decoder.test.ts#L371-L479
title: packages/core/codec/decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 3
chunk_total: 5
content_sha: 2c369e59e0fbef7069ede0a260a0fb1bc27442c1c5141902290ef4718d316133
language: typescript
---
`packages/core/codec/decoder.test.ts` (lines 371–479)

```typescript
    assert.deepStrictEqual(decoder.varU32(), 2);
    assert.deepStrictEqual(decoder.varU32(), 3);
    assert.deepStrictEqual(decoder.varU32(), 42);
    assert.deepStrictEqual(decoder.varU32(), 2 ** 32 - 1);
    assert.deepStrictEqual(decoder.varU32(), 2 ** 31 - 1);
    assert.deepStrictEqual(decoder.varU32(), 0x42424242);
    decoder.finish();
  });

  it("should decode variable length u64", () => {
    const input = BytesBlob.parseBlob("0x0001f100000000ff0000000000000001ffffffffffffffffff");
    const decoder = Decoder.fromBytesBlob(input);

    assert.deepStrictEqual(decoder.varU64(), 0n);
    assert.deepStrictEqual(decoder.varU64(), 1n);
    assert.deepStrictEqual(decoder.varU64(), 2n ** 32n);
    assert.deepStrictEqual(decoder.varU64(), 2n ** 56n);
    assert.deepStrictEqual(decoder.varU64(), 2n ** 64n - 1n);
    decoder.finish();
  });

  it("should decode a bunch of i64 numbers", () => {
    const input = BytesBlob.parseBlob(
      "0xffffffffffffff7f00000000000000804242424200000000d6ffffffffffffff0000000000000000",
    );
    const decoder = Decoder.fromBytesBlob(input);

    const results = [decoder.i64(), decoder.i64(), decoder.i64(), decoder.i64(), decoder.i64()];
    decoder.finish();

    assert.deepStrictEqual(results, [2n ** 63n - 1n, -(2n ** 63n), 0x42424242n, -42n, 0n]);
  });

  it("should decode a bunch of i32 numbers", () => {
    const input = BytesBlob.parseBlob("0xffffff7f0000008042424242d6ffffff00000000");
    const decoder = Decoder.fromBytesBlob(input);

    const results = [decoder.i32(), decoder.i32(), decoder.i32(), decoder.i32(), decoder.i32()];
    decoder.finish();

    assert.deepStrictEqual(results, [2 ** 31 - 1, -(2 ** 31), 0x42424242, -42, 0]);
  });

  it("should decode a bunch of u32 numbers", () => {
    const input = BytesBlob.parseBlob("0xffffff7f0000008042424242d6ffffff00000000");
    const decoder = Decoder.fromBytesBlob(input);

    const results = [decoder.u32(), decoder.u32(), decoder.u32(), decoder.u32(), decoder.u32()];
    decoder.finish();

    assert.deepStrictEqual(results, [2 ** 31 - 1, 2 ** 32 - 2 ** 31, 0x42424242, 2 ** 32 - 42, 0]);
  });

  it("should decode a bunch of i24 numbers", () => {
    const input = BytesBlob.parseBlob("0x424242d6ffff00000081ffff811c15000080ffff7f010080");
    const decoder = Decoder.fromBytesBlob(input);

    assert.deepStrictEqual(decoder.i24(), 0x424242);
    assert.deepStrictEqual(decoder.i24(), -42);
    assert.deepStrictEqual(decoder.i24(), 0);
    assert.deepStrictEqual(decoder.i24(), -127);
    assert.deepStrictEqual(decoder.i24(), 1383553);
    assert.deepStrictEqual(decoder.i24(), -(2 ** 23));
    assert.deepStrictEqual(decoder.i24(), 2 ** 23 - 1);
    assert.deepStrictEqual(decoder.i24(), -(2 ** 23 - 1));
    decoder.finish();
  });

  it("should decode a bunch of i16 numbers", () => {
    const input = BytesBlob.parseBlob("0x4242d6ff0000");
    const decoder = Decoder.fromBytesBlob(input);

    const results = [decoder.i16(), decoder.i16(), decoder.i16()];
    decoder.finish();

    assert.deepStrictEqual(results, [0x4242, -42, 0]);
  });

  it("should decode a bunch of i8 numbers", () => {
    const input = BytesBlob.parseBlob("0x42d600");
    const decoder = Decoder.fromBytesBlob(input);

    const results = [decoder.i8(), decoder.i8(), decoder.i8()];
    decoder.finish();

    assert.deepStrictEqual(results, [0x42, -42, 0]);
  });

  it("should decode a bool", () => {
    const input = BytesBlob.parseBlob("0x0100");
    const decoder = Decoder.fromBytesBlob(input);

    assert.deepStrictEqual(decoder.bool(), true);
    assert.deepStrictEqual(decoder.bool(), false);
    decoder.finish();
  });
});

describe("JAM decoder / bitvec", () => {
  it("should decode a 1-byte bit vector", () => {
    const input = BytesBlob.parseBlob("0x410841");
    const decoder = Decoder.fromBytesBlob(input);

    // when
    const bitvec1 = decoder.bitVecFixLen(8);
    const bitvec2 = decoder.bitVecVarLen();
    decoder.finish();

    // then
```
