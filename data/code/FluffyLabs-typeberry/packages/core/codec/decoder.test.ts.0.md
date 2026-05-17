---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/decoder.test.ts#L1-L144
title: packages/core/codec/decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 5
content_sha: 8601a89000be5ebb699059da2084e9365763c94e86ed708b1bcebc1b821eabdc
language: typescript
---
`packages/core/codec/decoder.test.ts` (lines 1–144)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { BitVec, Bytes, BytesBlob } from "@typeberry/bytes";
import { Decoder } from "./decoder.js";
import * as codec from "./descriptors.js";
import { Encoder } from "./encoder.js";

function decodeVarU32(source: Uint8Array, finish = true) {
  const decoder = Decoder.fromBlob(source);
  const value = decoder.varU32();
  const bytesToSkip = decoder.bytesRead();
  if (finish) {
    decoder.finish();
  }

  // compare with u64 just to be sure.
  const decoder2 = Decoder.fromBlob(source);
  assert.strictEqual(decoder2.varU64(), BigInt(value));
  if (finish) {
    decoder2.finish();
  }

  return { value, bytesToSkip };
}

function decodeVarU64(source: Uint8Array, finish = true) {
  const decoder = Decoder.fromBlob(source);
  const value = decoder.varU64();
  const bytesToSkip = decoder.bytesRead();
  if (finish) {
    decoder.finish();
  }
  return { value, bytesToSkip };
}

describe("JAM decoder / finish", () => {
  it("should fail when there are some bytes left", () => {
    const encodedBytes = new Uint8Array([0]);
    const decoder = Decoder.fromBlob(encodedBytes);

    assert.throws(
      () => {
        decoder.finish();
      },
      {
        name: "Error",
        message: "Expecting end of input, yet there are still 1 bytes left.",
      },
    );
  });
});

describe("JAM decoder / natural number", () => {
  it("should fail when there is not enough bytes for varU32", () => {
    const encodedBytes = new Uint8Array([]);
    const decoder = Decoder.fromBlob(encodedBytes);

    assert.throws(
      () => {
        decoder.varU32();
      },
      {
        name: "Error",
        message: "Attempting to decode more data than there is left. Need 1, left: 0.",
      },
    );
  });

  it("should fail when there is not enough bytes for varU64", () => {
    const encodedBytes = new Uint8Array([240]);
    const decoder = Decoder.fromBlob(encodedBytes);

    assert.throws(
      () => {
        decoder.varU64();
      },
      {
        name: "Error",
        message: "Attempting to decode more data than there is left. Need 4, left: 0.",
      },
    );
  });

  it("decode 0", () => {
    const encodedBytes = new Uint8Array([0]);
    const expectedValue = 0;

    const result = decodeVarU32(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode single byte min value", () => {
    const encodedBytes = new Uint8Array([1]);
    const expectedValue = 1;

    const result = decodeVarU32(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode single byte max value", () => {
    const encodedBytes = new Uint8Array([127]);
    const expectedValue = 127;

    const result = decodeVarU32(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode 2 bytes min value", () => {
    const encodedBytes = new Uint8Array([128, 128]);
    const expectedValue = 128;

    const result = decodeVarU32(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode 2 bytes max value", () => {
    const encodedBytes = new Uint8Array([191, 255]);
    const expectedValue = 2 ** 14 - 1;

    const result = decodeVarU32(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode 3 bytes min value", () => {
    const encodedBytes = new Uint8Array([192, 0, 0x40]);
    const expectedValue = 2 ** 14;

    const result = decodeVarU32(encodedBytes);

    assert.strictEqual(result.value, expectedValue);
    assert.strictEqual(result.bytesToSkip, encodedBytes.length);
  });

  it("decode 3 bytes max value", () => {
```
