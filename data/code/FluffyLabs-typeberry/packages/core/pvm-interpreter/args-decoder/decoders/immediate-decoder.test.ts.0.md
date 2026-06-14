---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/decoders/immediate-decoder.test.ts#L1-L116
title: packages/core/pvm-interpreter/args-decoder/decoders/immediate-decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 3
content_sha: bc49008da8daba5ea9bda305eb5c86090e49ceb469935ba5f4e602d11d0eb330
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/decoders/immediate-decoder.test.ts` (lines 1–116)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { ImmediateDecoder } from "./immediate-decoder.js";

describe("ImmediateDecoder", () => {
  describe("reading bytes as signed and unsigned number U32", () => {
    it("Positive number without elided octets", () => {
      const decoder = ImmediateDecoder.new();
      const encodedBytes = new Uint8Array([0x01, 0x00, 0x00, 0x00]);
      const expectedSigned = 1;
      const expectedUnsigned = 1;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getSigned(), expectedSigned);
      assert.strictEqual(decoder.getUnsigned(), expectedUnsigned);
    });

    it("Negative number without elided octets", () => {
      const decoder = ImmediateDecoder.new();
      const encodedBytes = new Uint8Array([0xff, 0xff, 0xff, 0xff]);
      const expectedSigned = -1;
      const expectedUnsigned = 2 ** 32 - 1;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getSigned(), expectedSigned);
      assert.strictEqual(decoder.getUnsigned(), expectedUnsigned);
    });

    it("Positive number with elided octets", () => {
      const decoder = ImmediateDecoder.new();
      const encodedBytes = new Uint8Array([0x01]);
      const expectedSigned = 1;
      const expectedUnsigned = 1;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getSigned(), expectedSigned);
      assert.strictEqual(decoder.getUnsigned(), expectedUnsigned);
    });

    it("Negative number with elided octets", () => {
      const decoder = ImmediateDecoder.new();
      const encodedBytes = new Uint8Array([0xff]);
      const expectedSigned = -1;
      const expectedUnsigned = 2 ** 32 - 1;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getSigned(), expectedSigned);
      assert.strictEqual(decoder.getUnsigned(), expectedUnsigned);
    });

    it("Large positive number without elided octets", () => {
      const decoder = ImmediateDecoder.new();
      const encodedBytes = new Uint8Array([0xff, 0xff, 0x7f, 0x00]);
      const expectedSigned = 0x00_7f_ff_ff;
      const expectedUnsigned = 0x00_7f_ff_ff;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getSigned(), expectedSigned);
      assert.strictEqual(decoder.getUnsigned(), expectedUnsigned);
    });

    it("Large negative number without elided octets", () => {
      const decoder = ImmediateDecoder.new();

      const encodedBytes = new Uint8Array([0x01, 0x00, 0x80, 0xff]);
      const expectedSigned = -0x00_7f_ff_ff;
      const expectedUnsigned = 0xff_80_00_01;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getSigned(), expectedSigned);
      assert.strictEqual(decoder.getUnsigned(), expectedUnsigned);
    });

    it("Maximum positive value", () => {
      const decoder = ImmediateDecoder.new();

      const encodedBytes = new Uint8Array([0xff, 0xff, 0xff, 0x7f]);
      const expectedSigned = 0x7f_ff_ff_ff;
      const expectedUnsigned = 0x7f_ff_ff_ff;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getSigned(), expectedSigned);
      assert.strictEqual(decoder.getUnsigned(), expectedUnsigned);
    });

    it("Maximum negative value", () => {
      const decoder = ImmediateDecoder.new();

      const encodedBytes = new Uint8Array([0x00, 0x00, 0x00, 0x80]);
      const expectedSigned = -(2 ** 31);
      const expectedUnsigned = 0x80_00_00_00;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getSigned(), expectedSigned);
      assert.strictEqual(decoder.getUnsigned(), expectedUnsigned);
    });

    it("Empty bytes array", () => {
      const decoder = ImmediateDecoder.new();

      const encodedBytes = new Uint8Array([]);
      const expectedSigned = 0;
      const expectedUnsigned = 0;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getSigned(), expectedSigned);
      assert.strictEqual(decoder.getUnsigned(), expectedUnsigned);
```
