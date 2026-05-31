---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/decoder.test.ts#L251-L374
title: packages/core/codec/decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 2
chunk_total: 5
content_sha: f2434160a81d22c110d6b352d027db208a3a700ece8992d9a234a08a9a373300
language: typescript
---
`packages/core/codec/decoder.test.ts` (lines 251–374)

```typescript
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode 9 bytes min value", () => {
    const encodedBytes = new Uint8Array([255, 0, 0, 0, 0, 0, 0, 0, 0x01]);
    const expectedValue = 2n ** 56n;

    const result = decodeVarU64(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode 9 bytes max value", () => {
    const encodedBytes = new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255]);
    const expectedValue = 2n ** 64n - 1n;

    const result = decodeVarU64(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode 0 with extra bytes", () => {
    const encodedBytes = new Uint8Array([0, 1, 2, 3]);
    const expectedValue = 0;

    const result = decodeVarU32(encodedBytes, false);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, 1);
  });

  it("decode 7 bytes number with extra bytes ", () => {
    const encodedBytes = new Uint8Array([256 - 4 + 1, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1, 0x2]);
    const expectedValue = 2n ** 49n - 1n;

    const result = decodeVarU64(encodedBytes, false);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, 7);
  });

  it("decode 9 bytes number with extra bytes", () => {
    const encodedBytes = new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 1, 2, 3]);
    const expectedValue = 2n ** 64n - 1n;

    const result = decodeVarU64(encodedBytes, false);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, 9);
  });
});

describe("JAM decoder / bytes", () => {
  it("should decode empty bytes sequence", () => {
    const input = BytesBlob.parseBlob("0x00");
    const decoder = Decoder.fromBytesBlob(input);

    const blob = decoder.bytesBlob();
    decoder.finish();

    assert.deepStrictEqual(blob.toString(), "0x");
  });

  it("should decode bytes sequence", () => {
    const input = BytesBlob.parseBlob("0x04deadbeef");
    const decoder = Decoder.fromBytesBlob(input);

    const blob = decoder.bytesBlob();
    decoder.finish();

    assert.deepStrictEqual(blob.toString(), "0xdeadbeef");
  });

  it("should decode a fixed-length bytes", () => {
    const input = BytesBlob.parseBlob("0xdeadbeef");
    const decoder = Decoder.fromBytesBlob(input);

    const blob = decoder.bytes(4);
    decoder.finish();

    assert.deepStrictEqual(blob.toString(), "0xdeadbeef");
  });
});

describe("JAM decoder / numbers", () => {
  it("should decode a large number", () => {
    const input = BytesBlob.parseBlob("0xf0ffffffff");
    const decoder = Decoder.fromBytesBlob(input);

    const l = decoder.varU32();
    decoder.resetTo(0);
    const ln = decoder.varU64();
    decoder.finish();

    assert.deepStrictEqual(BigInt(l), ln);
    assert.deepStrictEqual(l, 2 ** 32 - 1);
  });

  it("should fail to decode a number over 32-bits", () => {
    const input = BytesBlob.parseBlob("0xf100000000");
    const decoder = Decoder.fromBytesBlob(input);

    const ln = decoder.varU64();
    assert.deepStrictEqual(ln, 2n ** 32n);

    decoder.resetTo(0);
    assert.throws(() => decoder.varU32(), {
      name: "Error",
      message: "Unexpectedly large value for u32. l=4, mostSignificantByte=1",
    });
  });

  it("should decode variable length u32", () => {
    const input = BytesBlob.parseBlob("0x000102032af0fffffffff0ffffff7ff042424242");
    const decoder = Decoder.fromBytesBlob(input);

    assert.deepStrictEqual(decoder.varU32(), 0);
    assert.deepStrictEqual(decoder.varU32(), 1);
    assert.deepStrictEqual(decoder.varU32(), 2);
    assert.deepStrictEqual(decoder.varU32(), 3);
    assert.deepStrictEqual(decoder.varU32(), 42);
    assert.deepStrictEqual(decoder.varU32(), 2 ** 32 - 1);
```
