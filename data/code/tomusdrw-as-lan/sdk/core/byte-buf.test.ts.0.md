---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/core/byte-buf.test.ts#L1-L136'
title: sdk/core/byte-buf.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 3
content_sha: 8cfd25e9e3f440f701978a380600f946227ac866c370a2d63ff29d644fa227d2
language: typescript
---
`sdk/core/byte-buf.test.ts` (lines 1–136)

```typescript
import { Assert, Test, test } from "../test/utils";
import { ByteBuf } from "./byte-buf";

/** Helper: compare a Uint8Array against expected bytes. */
function assertBytes(a: Assert, actual: Uint8Array, expected: u8[], msg: string): void {
  a.isEqual(actual.length, expected.length, `${msg}.length`);
  for (let i = 0; i < min(actual.length, expected.length); i++) {
    a.isEqual(actual[i], expected[i], `${msg}[${i}]`);
  }
}

/** Helper: convert ASCII string to expected byte array. */
function ascii(s: string): u8[] {
  const out: u8[] = [];
  for (let i = 0; i < s.length; i++) {
    out.push(<u8>s.charCodeAt(i));
  }
  return out;
}

export const TESTS: Test[] = [
  test("str appends ASCII bytes", () => {
    const a = Assert.create();
    const result = ByteBuf.create(16).strAscii("hello").finish();
    assertBytes(a, result, ascii("hello"), "str");
    return a;
  }),

  test("bytes appends raw data", () => {
    const a = Assert.create();
    const data = new Uint8Array(3);
    data[0] = 0xaa;
    data[1] = 0xbb;
    data[2] = 0xcc;
    const result = ByteBuf.create(16).bytes(data).finish();
    assertBytes(a, result, [0xaa, 0xbb, 0xcc], "bytes");
    return a;
  }),

  test("chaining str + bytes + str", () => {
    const a = Assert.create();
    const data = new Uint8Array(2);
    data[0] = 0xff;
    data[1] = 0x01;
    const result = ByteBuf.create(32).strAscii("A=").bytes(data).strAscii("!").finish();
    const expected: u8[] = ascii("A=");
    expected.push(0xff);
    expected.push(0x01);
    expected.push(<u8>"!".charCodeAt(0));
    assertBytes(a, result, expected, "chain");
    return a;
  }),

  test("u64 zero", () => {
    const a = Assert.create();
    const result = ByteBuf.create(8).u64(0).finish();
    assertBytes(a, result, ascii("0"), "u64(0)");
    return a;
  }),

  test("u64 small value", () => {
    const a = Assert.create();
    const result = ByteBuf.create(8).u64(42).finish();
    assertBytes(a, result, ascii("42"), "u64(42)");
    return a;
  }),

  test("u64 large value", () => {
    const a = Assert.create();
    const result = ByteBuf.create(32).u64(u64.MAX_VALUE).finish();
    assertBytes(a, result, ascii("18446744073709551615"), "u64 max");
    return a;
  }),

  test("u32 delegates to u64", () => {
    const a = Assert.create();
    const result = ByteBuf.create(16).u32(4294967295).finish();
    assertBytes(a, result, ascii("4294967295"), "u32 max");
    return a;
  }),

  test("i32 positive", () => {
    const a = Assert.create();
    const result = ByteBuf.create(8).i32(123).finish();
    assertBytes(a, result, ascii("123"), "i32(123)");
    return a;
  }),

  test("i32 negative", () => {
    const a = Assert.create();
    const result = ByteBuf.create(8).i32(-7).finish();
    assertBytes(a, result, ascii("-7"), "i32(-7)");
    return a;
  }),

  test("i32 MIN_VALUE", () => {
    const a = Assert.create();
    const result = ByteBuf.create(16).i32(i32.MIN_VALUE).finish();
    assertBytes(a, result, ascii("-2147483648"), "i32 min");
    return a;
  }),

  test("i32 zero", () => {
    const a = Assert.create();
    const result = ByteBuf.create(8).i32(0).finish();
    assertBytes(a, result, ascii("0"), "i32(0)");
    return a;
  }),

  test("hex with data", () => {
    const a = Assert.create();
    const data = new Uint8Array(3);
    data[0] = 0xde;
    data[1] = 0xad;
    data[2] = 0x09;
    const result = ByteBuf.create(16).hex(data).finish();
    assertBytes(a, result, ascii("0xdead09"), "hex");
    return a;
  }),

  test("hex with empty data", () => {
    const a = Assert.create();
    const result = ByteBuf.create(8).hex(new Uint8Array(0)).finish();
    assertBytes(a, result, ascii("0x"), "hex empty");
    return a;
  }),

  test("hex all nibble values", () => {
    const a = Assert.create();
    const data = new Uint8Array(1);
    data[0] = 0xaf;
    const result = ByteBuf.create(8).hex(data).finish();
    assertBytes(a, result, ascii("0xaf"), "hex 0xaf");
    return a;
  }),

```
