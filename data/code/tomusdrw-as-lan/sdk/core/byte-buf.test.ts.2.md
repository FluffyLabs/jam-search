---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/core/byte-buf.test.ts#L235-L289
title: sdk/core/byte-buf.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 2
chunk_total: 3
content_sha: f9dd180a3d43fdbaea667e9fd2a1856d5d160f86e82a1a0bdc3e498ac022beaa
language: typescript
---
`sdk/core/byte-buf.test.ts` (lines 235–289)

```typescript
    a.isEqual(buf.length, 3, "length capped");
    a.isEqual(data[0], 0x68, "h");
    a.isEqual(data[1], 0x65, "e");
    a.isEqual(data[2], 0x6c, "l");
    return a;
  }),

  test("wrap finish returns copy", () => {
    const a = Assert.create();
    const data = new Uint8Array(8);
    const buf = ByteBuf.wrap(data);
    buf.strAscii("ab");
    const result = buf.finish();
    assertBytes(a, result, ascii("ab"), "finish");
    a.isEqual(buf.length, 0, "reset after finish");
    return a;
  }),

  // ─── strUtf8() ──────────────────────────────────────────────────

  test("strUtf8 ASCII string", () => {
    const a = Assert.create();
    const result = ByteBuf.create(16).strUtf8("hello").finish();
    assertBytes(a, result, ascii("hello"), "utf8 ascii");
    return a;
  }),

  test("strUtf8 multibyte chars", () => {
    const a = Assert.create();
    // "¢" = U+00A2 = 0xC2 0xA2 in UTF-8 (2 bytes)
    const result = ByteBuf.create(16).strUtf8("\u00A2").finish();
    a.isEqual(result.length, 2, "¢ length");
    a.isEqual(result[0], 0xc2, "¢ byte 0");
    a.isEqual(result[1], 0xa2, "¢ byte 1");
    return a;
  }),

  test("strUtf8 truncated at capacity", () => {
    const a = Assert.create();
    // "¢" is 2 bytes, capacity 1 → only first byte fits
    const result = ByteBuf.create(1).strUtf8("\u00A2").finish();
    a.isEqual(result.length, 1, "truncated length");
    a.isEqual(result[0], 0xc2, "first byte of ¢");
    return a;
  }),

  test("strUtf8 mixed with strAscii", () => {
    const a = Assert.create();
    const result = ByteBuf.create(32).strAscii("a=").strUtf8("\u00A2").strAscii("!").finish();
    // "a=" (2) + "¢" (2) + "!" (1) = 5 bytes
    a.isEqual(result.length, 5, "total length");
    assertBytes(a, result, [0x61, 0x3d, 0xc2, 0xa2, 0x21], "mixed");
    return a;
  }),
];
```
