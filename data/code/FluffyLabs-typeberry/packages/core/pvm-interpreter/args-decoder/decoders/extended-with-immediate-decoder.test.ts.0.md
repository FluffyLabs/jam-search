---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/decoders/extended-with-immediate-decoder.test.ts#L1-L30
title: >-
  packages/core/pvm-interpreter/args-decoder/decoders/extended-with-immediate-decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 6598db00b676d00a5b1813ef243c622c5c598c812d59d08561d207779b41839e
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/decoders/extended-with-immediate-decoder.test.ts` (lines 1–30)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import { ExtendedWitdthImmediateDecoder } from "./extended-with-immediate-decoder.js";

describe("ExtendedWitdthImmediateDecoder", () => {
  describe("reading bytes as unsigned number", () => {
    it("8-bytes number", () => {
      const decoder = ExtendedWitdthImmediateDecoder.new();
      const encodedBytes = new Uint8Array([0xff, 0xee, 0xdd, 0xcc, 0xbb, 0xaa, 0x99, 0x88]);
      const expectedValue = 0x88_99_aa_bb_cc_dd_ee_ffn;

      decoder.setBytes(encodedBytes);

      assert.strictEqual(decoder.getValue(), expectedValue);
    });
  });

  describe("read immediate as bytes (little endian)", () => {
    it("8-bytes number", () => {
      const decoder = ExtendedWitdthImmediateDecoder.new();
      const encodedBytes = new Uint8Array([0xff, 0xee, 0xdd, 0xcc, 0xbb, 0xaa, 0x99, 0x88]);
      const expectedBytes = new Uint8Array([0xff, 0xee, 0xdd, 0xcc, 0xbb, 0xaa, 0x99, 0x88]);

      decoder.setBytes(encodedBytes);

      assert.deepStrictEqual(decoder.getBytesAsLittleEndian(), expectedBytes);
    });
  });
});
```
