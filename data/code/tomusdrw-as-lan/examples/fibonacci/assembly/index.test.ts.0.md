---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/fibonacci/assembly/index.test.ts#L1-L119
title: examples/fibonacci/assembly/index.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 2
content_sha: 75d79bcbf1a36ee1391f9c63ee4c20b2a3d73e3ccc8f4ac8eaf4586ba4e9f481
language: typescript
---
`examples/fibonacci/assembly/index.test.ts` (lines 1–119)

```typescript
import { BytesBlob } from "@fluffylabs/as-lan";
import { Assert, Test, test, unpackResult } from "@fluffylabs/as-lan/test";
import { accumulate, refine } from "./fibonacci";

function pushVarU64(out: u8[], v: u64): void {
  // Simple encoding: values < 128 fit in a single byte
  if (v < 128) {
    out.push(u8(v));
  } else {
    // For test purposes, we only need small values
    throw new Error("varU64 encoding for large values not implemented in test helper");
  }
}

function pushBytesVarLen(out: u8[], blob: Uint8Array): void {
  pushVarU64(out, u64(blob.length));
  for (let i = 0; i < blob.length; i += 1) {
    out.push(blob[i]);
  }
}

function pushBytes(out: u8[], bytes: Uint8Array): void {
  for (let i = 0; i < bytes.length; i += 1) {
    out.push(bytes[i]);
  }
}

function toBytes(out: u8[]): Uint8Array {
  const v = BytesBlob.zero(out.length);
  for (let i = 0; i < out.length; i += 1) {
    v.raw[i] = out[i];
  }
  return v.raw;
}

function fromHex(hex: string): Uint8Array {
  return BytesBlob.parseBlob(hex).okay!.raw;
}

function assertBytes(assert: Assert, actual: Uint8Array, expected: Uint8Array, msg: string): void {
  assert.isEqual(actual.length, expected.length, `${msg}.length`);
  if (actual.length !== expected.length) {
    return;
  }
  for (let i = 0; i < actual.length; i += 1) {
    assert.isEqual(actual[i], expected[i], `${msg}[${i}]`);
  }
}

function callWithArgs(fn: (ptr: u32, len: u32) => u64, data: Uint8Array): Uint8Array {
  // Wrap data and use typed pointer access.
  const buf = BytesBlob.wrap(data);
  const result = fn(buf.ptr(), buf.length);
  // Reference buf after fn() to ensure it stays live.
  assert(buf.length >= 0);
  return unpackResult(result);
}

export const TESTS: Test[] = [
  test("refine echoes payload", () => {
    const out: u8[] = [];
    const zeros32 = fromHex("0x0000000000000000000000000000000000000000000000000000000000000000");

    pushVarU64(out, 0); // coreIndex
    pushVarU64(out, 0); // itemIndex
    pushVarU64(out, 42); // serviceId
    pushBytesVarLen(out, fromHex("0xdeadbeef")); // payload
    pushBytes(out, zeros32); // workPackageHash (32 bytes)

    const result = callWithArgs(refine, toBytes(out));
    const assert = Assert.create();
    assertBytes(assert, result, fromHex("0xdeadbeef"), "refine output");
    return assert;
  }),
  test("accumulate default fib(10) = 55", () => {
    const out: u8[] = [];

    pushVarU64(out, 7); // slot
    pushVarU64(out, 9); // serviceId
    pushVarU64(out, 0); // argsLength=0 means default n=10

    const result = callWithArgs(accumulate, toBytes(out));
    const assert = Assert.create();
    // Returns Some(CodeHash) = 1 byte tag + 32 bytes
    assert.isEqual(result.length, 33, "result length");
    assert.isEqual(result[0], 1, "some tag");
    // fib(10) = 55 = 0x37, little-endian in first byte
    assert.isEqual(result[1], 55, "fib(10) low byte");
    // remaining bytes of the u64 should be 0
    for (let i = 2; i < 9; i++) {
      assert.isEqual(result[i], 0, `fib result byte[${i}]`);
    }
    return assert;
  }),
  test("accumulate fib(20) = 6765", () => {
    const out: u8[] = [];

    pushVarU64(out, 1); // slot
    pushVarU64(out, 5); // serviceId
    pushVarU64(out, 20); // argsLength=20 means n=20

    const result = callWithArgs(accumulate, toBytes(out));
    const assert = Assert.create();
    assert.isEqual(result.length, 33, "result length");
    assert.isEqual(result[0], 1, "some tag");
    // fib(20) = 6765 = 0x1A6D little-endian
    assert.isEqual(result[1], 0x6d, "fib(20) byte 0");
    assert.isEqual(result[2], 0x1a, "fib(20) byte 1");
    for (let i = 3; i < 9; i++) {
      assert.isEqual(result[i], 0, `fib result byte[${i}]`);
    }
    return assert;
  }),
  test("refine with empty payload", () => {
    const out: u8[] = [];
    const zeros32 = fromHex("0x0000000000000000000000000000000000000000000000000000000000000000");

    pushVarU64(out, 1); // coreIndex
    pushVarU64(out, 0); // itemIndex
```
