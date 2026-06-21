---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/core/byte-buf.test.ts#L123-L235
title: sdk/core/byte-buf.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 6d60df9d93aafb4b728d857847326efe8990245d9d847874a55fb6b2e61bec98
language: typescript
---
`sdk/core/byte-buf.test.ts` (lines 123–235)

```typescript
    const a = Assert.create();
    const data = new Uint8Array(1);
    data[0] = 0xaf;
    const result = ByteBuf.create(8).hex(data).finish();
    assertAscii(a, result, "0xaf", "hex 0xaf");
    return a;
  }),

  test("str truncated at capacity", () => {
    const a = Assert.create();
    const result = ByteBuf.create(3).strAscii("hello").finish();
    assertAscii(a, result, "hel", "truncated str");
    return a;
  }),

  test("bytes truncated at capacity", () => {
    const a = Assert.create();
    const data = new Uint8Array(5);
    for (let i = 0; i < 5; i++) data[i] = <u8>(i + 1);
    const result = ByteBuf.create(3).bytes(data).finish();
    assertRaw(a, result, [1, 2, 3], "truncated bytes");
    return a;
  }),

  test("hex truncated drops incomplete byte", () => {
    const a = Assert.create();
    // capacity=5: "0x" (2) + one full byte (2) = 4, second byte needs pos+1 < 5 → fits
    // capacity=6: "0x" (2) + two bytes (4) = 6, but needs pos+1 < cap → only first byte fits
    const data = new Uint8Array(2);
    data[0] = 0xab;
    data[1] = 0xcd;
    const result = ByteBuf.create(6).hex(data).finish();
    // "0x" + "ab" = 4 bytes written, pos=4, need pos+1 < 6 → 5 < 6 → second byte fits
    assertAscii(a, result, "0xabcd", "hex cap=6");

    // With cap=5: "0x" + "ab" = 4 bytes, pos=4, need pos+1 < 5 → 5 < 5 → false, drops cd
    const result2 = ByteBuf.create(5).hex(data).finish();
    assertAscii(a, result2, "0xab", "hex cap=5");
    return a;
  }),

  test("u64 truncated at capacity", () => {
    const a = Assert.create();
    // "12345" needs 5 chars, capacity=3 → truncated to 3 positions.
    // u64 writes right-to-left filling from the end, so the high digits
    // that don't fit are dropped and we get the trailing digits.
    const result = ByteBuf.create(3).u64(12345).finish();
    assertAscii(a, result, "345", "truncated u64");
    return a;
  }),

  test("finish resets for reuse", () => {
    const a = Assert.create();
    const buf = ByteBuf.create(16);
    const first = buf.strAscii("one").finish();
    const second = buf.strAscii("two").finish();
    assertAscii(a, first, "one", "first");
    assertAscii(a, second, "two", "second");
    return a;
  }),

  test("reset discards content", () => {
    const a = Assert.create();
    const buf = ByteBuf.create(16);
    buf.strAscii("discard");
    a.isEqual(buf.length, 7, "length before reset");
    buf.reset();
    a.isEqual(buf.length, 0, "length after reset");
    const result = buf.strAscii("kept").finish();
    assertAscii(a, result, "kept", "after reset");
    return a;
  }),

  test("length tracks position", () => {
    const a = Assert.create();
    const buf = ByteBuf.create(32);
    a.isEqual(buf.length, 0, "initial");
    buf.strAscii("ab");
    a.isEqual(buf.length, 2, "after str");
    buf.u32(7);
    a.isEqual(buf.length, 3, "after u32");
    buf.finish();
    a.isEqual(buf.length, 0, "after finish");
    return a;
  }),

  // ─── wrap() ─────────────────────────────────────────────────────

  test("wrap writes directly into array", () => {
    const a = Assert.create();
    const data = new Uint8Array(5);
    const buf = ByteBuf.wrap(data);
    a.isEqual(buf.length, 0, "initial length");
    a.isEqual(buf.dataStart, data.dataStart, "points to same memory");
    buf.strAscii("Hi");
    a.isEqual(buf.length, 2, "length after write");
    // Backing array should now contain "Hi" + 3 untouched zero bytes.
    const expected = BytesBlob.zero(5);
    expected.raw.set(BytesBlob.encodeAscii("Hi").raw, 0);
    a.isEqualBytes(BytesBlob.wrap(data), expected, "backing array");
    return a;
  }),

  test("wrap truncates at array capacity", () => {
    const a = Assert.create();
    const data = new Uint8Array(3);
    const buf = ByteBuf.wrap(data);
    buf.strAscii("hello"); // 5 chars, only 3 fit
    a.isEqual(buf.length, 3, "length capped");
    a.isEqualBytes(BytesBlob.wrap(data), BytesBlob.encodeAscii("hel"), "backing array");
    return a;
  }),

```
