---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/decoders/immediate-decoder.test.ts#L111-L229
title: packages/core/pvm-interpreter/args-decoder/decoders/immediate-decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 3
content_sha: 32ba5868c0b9e7232901846b4eac4c21f87bd7e22c1d20afa2fff66bc0d8c7e5
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/decoders/immediate-decoder.test.ts` (lines 111–229)

```typescript
      const expectedUnsigned = 0;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getSigned(), expectedSigned);
      assert.strictEqual(decoder.getUnsigned(), expectedUnsigned);
    });
  });

  describe("reading bytes as signed and unsigned number U64", () => {
    it("Positive number without elided octets", () => {
      const decoder = ImmediateDecoder.new();
      const encodedBytes = new Uint8Array([0x01, 0x00, 0x00, 0x00]);
      const expectedSigned = 1n;
      const expectedUnsigned = 1n;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getI64(), expectedSigned);
      assert.strictEqual(decoder.getU64(), expectedUnsigned);
    });

    it("Negative number without elided octets", () => {
      const decoder = ImmediateDecoder.new();
      const encodedBytes = new Uint8Array([0xff, 0xff, 0xff, 0xff]);
      const expectedSigned = -1n;
      const expectedUnsigned = 2n ** 64n - 1n;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getI64(), expectedSigned);
      assert.strictEqual(decoder.getU64(), expectedUnsigned);
    });

    it("Positive number with elided octets", () => {
      const decoder = ImmediateDecoder.new();
      const encodedBytes = new Uint8Array([0x01]);
      const expectedSigned = 1n;
      const expectedUnsigned = 1n;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getI64(), expectedSigned);
      assert.strictEqual(decoder.getU64(), expectedUnsigned);
    });

    it("Negative number with elided octets", () => {
      const decoder = ImmediateDecoder.new();
      const encodedBytes = new Uint8Array([0xff]);
      const expectedSigned = -1n;
      const expectedUnsigned = 2n ** 64n - 1n;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getI64(), expectedSigned);
      assert.strictEqual(decoder.getU64(), expectedUnsigned);
    });

    it("Large positive number without elided octets", () => {
      const decoder = ImmediateDecoder.new();
      const encodedBytes = new Uint8Array([0xff, 0xff, 0x7f, 0x00]);
      const expectedSigned = 0x00_7f_ff_ffn;
      const expectedUnsigned = 0x00_7f_ff_ffn;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getI64(), expectedSigned);
      assert.strictEqual(decoder.getU64(), expectedUnsigned);
    });

    it("Large negative number without elided octets", () => {
      const decoder = ImmediateDecoder.new();

      const encodedBytes = new Uint8Array([0x01, 0x00, 0x80, 0xff]);
      const expectedSigned = -0x00_7f_ff_ffn;
      const expectedUnsigned = 0xff_ff_ff_ff_ff_80_00_01n;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getI64(), expectedSigned);
      assert.strictEqual(decoder.getU64(), expectedUnsigned);
    });

    it("Maximum positive value", () => {
      const decoder = ImmediateDecoder.new();

      const encodedBytes = new Uint8Array([0xff, 0xff, 0xff, 0x7f]);
      const expectedSigned = 0x7f_ff_ff_ffn;
      const expectedUnsigned = 0x7f_ff_ff_ffn;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getI64(), expectedSigned);
      assert.strictEqual(decoder.getU64(), expectedUnsigned);
    });

    it("Maximum negative value", () => {
      const decoder = ImmediateDecoder.new();

      const encodedBytes = new Uint8Array([0x00, 0x00, 0x00, 0x80]);
      const expectedSigned = -(2n ** 31n);
      const expectedUnsigned = 0xff_ff_ff_ff_80_00_00_00n;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getI64(), expectedSigned);
      assert.strictEqual(decoder.getU64(), expectedUnsigned);
    });

    it("Empty bytes array", () => {
      const decoder = ImmediateDecoder.new();

      const encodedBytes = new Uint8Array([]);
      const expectedSigned = 0n;
      const expectedUnsigned = 0n;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getI64(), expectedSigned);
```
