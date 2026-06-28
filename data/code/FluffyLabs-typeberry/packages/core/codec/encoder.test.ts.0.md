---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/encoder.test.ts#L1-L142
title: packages/core/codec/encoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 2
content_sha: c731060a973c4139719ffe71122bfa00c5e2d7457f2b110002a7aad95518ddb5
language: typescript
---
`packages/core/codec/encoder.test.ts` (lines 1–142)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { BitVec, Bytes, BytesBlob } from "@typeberry/bytes";
import type { U32 } from "@typeberry/numbers";
import { Encoder } from "./encoder.js";

describe("JAM encoder / bytes", () => {
  it("should encode empty bytes sequence", () => {
    const blob = BytesBlob.parseBlob("0x");
    const encoder = Encoder.create();

    encoder.bytesBlob(blob);

    assert.deepStrictEqual(
      encoder.viewResult(),
      // we have the length prefix.
      BytesBlob.parseBlob("0x00"),
    );
  });

  it("should encode bytes sequence", () => {
    const blob = BytesBlob.parseBlob("0xdeadbeef");
    const encoder = Encoder.create();

    encoder.bytesBlob(blob);

    assert.deepStrictEqual(encoder.viewResult(), BytesBlob.parseBlob("0x04deadbeef"));
  });

  it("should encode a fixed-length bytes", () => {
    const bytes = Bytes.parseBytes("0xdeadbeef", 4);
    const encoder = Encoder.create();

    encoder.bytes(bytes);

    assert.deepStrictEqual(encoder.viewResult(), BytesBlob.parseBlob("0xdeadbeef"));
  });
});

describe("JAM encoder / numbers", () => {
  it("should encode a large 32-bit number", () => {
    const encoder = Encoder.create();

    encoder.varU32((2 ** 32 - 1) as U32);

    assert.deepStrictEqual(encoder.viewResult().toString(), "0xf0ffffffff");
  });

  it("should encode variable length u32", () => {
    const encoder = Encoder.create();

    encoder.varU32(0 as U32);
    encoder.varU32(1 as U32);
    encoder.varU32(2 as U32);
    encoder.varU32(3 as U32);
    encoder.varU32(42 as U32);
    encoder.varU32((2 ** 32 - 1) as U32);
    encoder.varU32((2 ** 31 - 1) as U32);
    encoder.varU32(0x42424242 as U32);

    assert.deepStrictEqual(encoder.viewResult().toString(), "0x000102032af0fffffffff0ffffff7ff042424242");
  });

  it("should encode variable length u64", () => {
    const encoder = Encoder.create();

    encoder.varU64(0n);
    encoder.varU64(1n);
    encoder.varU64(2n ** 32n);
    encoder.varU64(2n ** 56n);
    encoder.varU64(2n ** 64n - 1n);

    assert.deepStrictEqual(encoder.viewResult().toString(), "0x0001f100000000ff0000000000000001ffffffffffffffffff");
  });

  it("should encode a bunch of i64 numbers", () => {
    const encoder = Encoder.create();

    encoder.i64(2n ** 63n - 1n);
    encoder.i64(-(2n ** 63n));
    encoder.i64(0x42424242n);
    encoder.i64(-42n);
    encoder.i64(0n);

    assert.deepStrictEqual(
      encoder.viewResult().toString(),
      BytesBlob.parseBlob(
        "0xffffffffffffff7f00000000000000804242424200000000d6ffffffffffffff0000000000000000",
      ).toString(),
    );
  });

  it("should encode a bunch of i32 numbers", () => {
    const encoder = Encoder.create();

    encoder.i32(2 ** 31 - 1);
    encoder.i32(-(2 ** 31));
    encoder.i32(0x42424242);
    encoder.i32(-42);
    encoder.i32(0);

    assert.deepStrictEqual(
      encoder.viewResult().toString(),
      BytesBlob.parseBlob("0xffffff7f0000008042424242d6ffffff00000000").toString(),
    );
  });

  it("should encode a bunch of i24 numbers", () => {
    const encoder = Encoder.create();

    encoder.i24(0x424242);
    encoder.i24(-42);
    encoder.i24(0);
    encoder.i24(-127);
    encoder.i24(1383553);
    encoder.i24(2 ** 23);
    encoder.i24(2 ** 23 - 1);
    encoder.i24(2 ** 23 + 1);

    assert.deepStrictEqual(
      encoder.viewResult().toString(),
      BytesBlob.parseBlob("0x424242d6ffff00000081ffff811c15000080ffff7f010080").toString(),
    );
  });

  it("should encode a bunch of i16 numbers", () => {
    const encoder = Encoder.create();

    encoder.i16(0x4242);
    encoder.i16(-42);
    encoder.i16(0);

    assert.deepStrictEqual(encoder.viewResult().toString(), BytesBlob.parseBlob("0x4242d6ff0000").toString());
  });

  it("should encode a bunch of i8 numbers", () => {
    const encoder = Encoder.create();

    encoder.i8(0x42);
    encoder.i8(-42);
    encoder.i8(0);

```
