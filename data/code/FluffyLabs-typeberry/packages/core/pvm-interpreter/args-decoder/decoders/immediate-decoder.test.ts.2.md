---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/decoders/immediate-decoder.test.ts#L223-L325
title: packages/core/pvm-interpreter/args-decoder/decoders/immediate-decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 2
chunk_total: 3
content_sha: 39ada8081db0986820c16b14ec0f09bf689114aec0787d85018a14a543c3328a
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/decoders/immediate-decoder.test.ts` (lines 223–325)

```typescript
      const encodedBytes = new Uint8Array([]);
      const expectedSigned = 0n;
      const expectedUnsigned = 0n;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getI64(), expectedSigned);
      assert.strictEqual(decoder.getU64(), expectedUnsigned);
    });
  });

  describe("getBytesAsLittleEndian", () => {
    it("should return empty bytes array", () => {
      const decoder = ImmediateDecoder.new();

      const encodedBytes = new Uint8Array([]);
      const expectedBytes = new Uint8Array([0, 0, 0, 0]);

      decoder.setBytes(encodedBytes);

      assert.deepStrictEqual(decoder.getBytesAsLittleEndian(), expectedBytes);
    });

    it("should return u8 number correctly encoded as little endian", () => {
      const decoder = ImmediateDecoder.new();

      const encodedBytes = new Uint8Array([0xff]);
      const expectedBytes = new Uint8Array([0xff, 0xff, 0xff, 0xff]);

      decoder.setBytes(encodedBytes);

      assert.deepStrictEqual(decoder.getBytesAsLittleEndian(), expectedBytes);
    });

    it("should return u16 number correctly encoded as little endian", () => {
      const decoder = ImmediateDecoder.new();

      const encodedBytes = new Uint8Array([0xff, 0xee]);
      const expectedBytes = new Uint8Array([0xff, 0xee, 0xff, 0xff]);

      decoder.setBytes(encodedBytes);

      assert.deepStrictEqual(decoder.getBytesAsLittleEndian(), expectedBytes);
    });

    it("should return u32 number correctly encoded as little endian", () => {
      const decoder = ImmediateDecoder.new();

      const encodedBytes = new Uint8Array([0xff, 0xee, 0xdd, 0xcc]);
      const expectedBytes = new Uint8Array([0xff, 0xee, 0xdd, 0xcc]);

      decoder.setBytes(encodedBytes);

      assert.deepStrictEqual(decoder.getBytesAsLittleEndian(), expectedBytes);
    });
  });

  describe("getExtendedBytesAsLittleEndian", () => {
    it("should return empty bytes array", () => {
      const decoder = ImmediateDecoder.new();

      const encodedBytes = new Uint8Array([]);
      const expectedBytes = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);

      decoder.setBytes(encodedBytes);

      assert.deepStrictEqual(decoder.getExtendedBytesAsLittleEndian(), expectedBytes);
    });

    it("should return u8 number correctly encoded as little endian", () => {
      const decoder = ImmediateDecoder.new();

      const encodedBytes = new Uint8Array([0xff]);
      const expectedBytes = new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);

      decoder.setBytes(encodedBytes);

      assert.deepStrictEqual(decoder.getExtendedBytesAsLittleEndian(), expectedBytes);
    });

    it("should return u16 number correctly encoded as little endian", () => {
      const decoder = ImmediateDecoder.new();

      const encodedBytes = new Uint8Array([0xff, 0xee]);
      const expectedBytes = new Uint8Array([0xff, 0xee, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);

      decoder.setBytes(encodedBytes);

      assert.deepStrictEqual(decoder.getExtendedBytesAsLittleEndian(), expectedBytes);
    });

    it("should return u32 number correctly encoded as little endian", () => {
      const decoder = ImmediateDecoder.new();

      const encodedBytes = new Uint8Array([0xff, 0xee, 0xdd, 0xcc]);
      const expectedBytes = new Uint8Array([0xff, 0xee, 0xdd, 0xcc, 0xff, 0xff, 0xff, 0xff]);

      decoder.setBytes(encodedBytes);

      assert.deepStrictEqual(decoder.getExtendedBytesAsLittleEndian(), expectedBytes);
    });
  });
});
```
