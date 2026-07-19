---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/core/byte-buf.test.ts#L230-L279
title: sdk/core/byte-buf.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 2
chunk_total: 3
content_sha: fb174d6d027b6a0a25adf8df49ca7d3ac49440fe29e4b2ef8e46efad431a47c7
language: typescript
---
`sdk/core/byte-buf.test.ts` (lines 230–279)

```typescript
    buf.strAscii("hello"); // 5 chars, only 3 fit
    a.isEqual(buf.length, 3, "length capped");
    a.isEqualBytes(BytesBlob.wrap(data), BytesBlob.encodeAscii("hel"), "backing array");
    return a;
  }),

  test("wrap finish returns copy", () => {
    const a = Assert.create();
    const data = new Uint8Array(8);
    const buf = ByteBuf.wrap(data);
    buf.strAscii("ab");
    const result = buf.finish();
    assertAscii(a, result, "ab", "finish");
    a.isEqual(buf.length, 0, "reset after finish");
    return a;
  }),

  // ─── strUtf8() ──────────────────────────────────────────────────

  test("strUtf8 ASCII string", () => {
    const a = Assert.create();
    const result = ByteBuf.create(16).strUtf8("hello").finish();
    assertAscii(a, result, "hello", "utf8 ascii");
    return a;
  }),

  test("strUtf8 multibyte chars", () => {
    const a = Assert.create();
    // "\u00A2" = U+00A2 = 0xC2 0xA2 in UTF-8 (2 bytes)
    const result = ByteBuf.create(16).strUtf8("\u00A2").finish();
    a.isEqualBytes(BytesBlob.wrap(result), BytesBlob.parseBlob("0xc2a2").okay!, "\u00A2");
    return a;
  }),

  test("strUtf8 truncated at capacity", () => {
    const a = Assert.create();
    // "\u00A2" is 2 bytes, capacity 1 → only first byte fits
    const result = ByteBuf.create(1).strUtf8("\u00A2").finish();
    a.isEqualBytes(BytesBlob.wrap(result), BytesBlob.parseBlob("0xc2").okay!, "first byte of ¢");
    return a;
  }),

  test("strUtf8 mixed with strAscii", () => {
    const a = Assert.create();
    const result = ByteBuf.create(32).strAscii("a=").strUtf8("\u00A2").strAscii("!").finish();
    // "a=" (0x61 0x3d) + "\u00A2" (0xc2 0xa2) + "!" (0x21)
    a.isEqualBytes(BytesBlob.wrap(result), BytesBlob.parseBlob("0x613dc2a221").okay!, "mixed");
    return a;
  }),
];
```
