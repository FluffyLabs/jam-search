---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/core/byte-buf.test.ts#L1-L130'
title: sdk/core/byte-buf.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 3fd2d74aa05216b634d60f19bbb351b23112d64805cd4c82ea3c17bcaee858d4
language: typescript
---
`sdk/core/byte-buf.test.ts` (lines 1–130)

```typescript
import { Assert, Test, test } from "../test/utils";
import { ByteBuf } from "./byte-buf";
import { BytesBlob } from "./bytes";

/** Compare a Uint8Array against an expected ASCII string (decoded as bytes). */
function assertAscii(a: Assert, actual: Uint8Array, expected: string, msg: string): void {
  a.isEqualBytes(BytesBlob.wrap(actual), BytesBlob.encodeAscii(expected), msg);
}

/** Compare a Uint8Array against an expected raw byte sequence. */
function assertRaw(a: Assert, actual: Uint8Array, expected: u8[], msg: string): void {
  const expectedBytes = BytesBlob.zero(expected.length);
  for (let i = 0; i < expected.length; i++) expectedBytes.raw[i] = expected[i];
  a.isEqualBytes(BytesBlob.wrap(actual), expectedBytes, msg);
}

export const TESTS: Test[] = [
  test("str appends ASCII bytes", () => {
    const a = Assert.create();
    const result = ByteBuf.create(16).strAscii("hello").finish();
    assertAscii(a, result, "hello", "str");
    return a;
  }),

  test("bytes appends raw data", () => {
    const a = Assert.create();
    const data = new Uint8Array(3);
    data[0] = 0xaa;
    data[1] = 0xbb;
    data[2] = 0xcc;
    const result = ByteBuf.create(16).bytes(data).finish();
    assertRaw(a, result, [0xaa, 0xbb, 0xcc], "bytes");
    return a;
  }),

  test("chaining str + bytes + str", () => {
    const a = Assert.create();
    const data = new Uint8Array(2);
    data[0] = 0xff;
    data[1] = 0x01;
    const result = ByteBuf.create(32).strAscii("A=").bytes(data).strAscii("!").finish();
    // "A=" + 0xff 0x01 + "!"
    const expected = BytesBlob.parseBlob("0x413dff0121").okay!;
    a.isEqualBytes(BytesBlob.wrap(result), expected, "chain");
    return a;
  }),

  test("u64 zero", () => {
    const a = Assert.create();
    const result = ByteBuf.create(8).u64(0).finish();
    assertAscii(a, result, "0", "u64(0)");
    return a;
  }),

  test("u64 small value", () => {
    const a = Assert.create();
    const result = ByteBuf.create(8).u64(42).finish();
    assertAscii(a, result, "42", "u64(42)");
    return a;
  }),

  test("u64 large value", () => {
    const a = Assert.create();
    const result = ByteBuf.create(32).u64(u64.MAX_VALUE).finish();
    assertAscii(a, result, "18446744073709551615", "u64 max");
    return a;
  }),

  test("u32 delegates to u64", () => {
    const a = Assert.create();
    const result = ByteBuf.create(16).u32(4294967295).finish();
    assertAscii(a, result, "4294967295", "u32 max");
    return a;
  }),

  test("i32 positive", () => {
    const a = Assert.create();
    const result = ByteBuf.create(8).i32(123).finish();
    assertAscii(a, result, "123", "i32(123)");
    return a;
  }),

  test("i32 negative", () => {
    const a = Assert.create();
    const result = ByteBuf.create(8).i32(-7).finish();
    assertAscii(a, result, "-7", "i32(-7)");
    return a;
  }),

  test("i32 MIN_VALUE", () => {
    const a = Assert.create();
    const result = ByteBuf.create(16).i32(i32.MIN_VALUE).finish();
    assertAscii(a, result, "-2147483648", "i32 min");
    return a;
  }),

  test("i32 zero", () => {
    const a = Assert.create();
    const result = ByteBuf.create(8).i32(0).finish();
    assertAscii(a, result, "0", "i32(0)");
    return a;
  }),

  test("hex with data", () => {
    const a = Assert.create();
    const data = new Uint8Array(3);
    data[0] = 0xde;
    data[1] = 0xad;
    data[2] = 0x09;
    const result = ByteBuf.create(16).hex(data).finish();
    assertAscii(a, result, "0xdead09", "hex");
    return a;
  }),

  test("hex with empty data", () => {
    const a = Assert.create();
    const result = ByteBuf.create(8).hex(new Uint8Array(0)).finish();
    assertAscii(a, result, "0x", "hex empty");
    return a;
  }),

  test("hex all nibble values", () => {
    const a = Assert.create();
    const data = new Uint8Array(1);
    data[0] = 0xaf;
    const result = ByteBuf.create(8).hex(data).finish();
    assertAscii(a, result, "0xaf", "hex 0xaf");
    return a;
  }),

```
