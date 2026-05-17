---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/service.test.ts#L99-L192'
title: sdk/jam/service.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 1
chunk_total: 2
content_sha: e2b19e16b614bbaa28e49d8c24a84d0954ab90d9b7d957c151c10d0b5ee848c1
language: typescript
---
`sdk/jam/service.test.ts` (lines 99–192)

```typescript
    const e = Encoder.create();
    aCtx.accumulateArgs.encode(original, e);
    const blob = e.finish();
    const parsed = aCtx.parseArgs(blob.ptr(), blob.length);

    const assert = Assert.create();
    assert.isEqual(parsed.slot, 0, "slot");
    assert.isEqual(parsed.serviceId, 0, "serviceId");
    assert.isEqual(parsed.argsLength, 0, "argsLength");
    return assert;
  }),

  test("AccumulateArgs roundtrip max values", () => {
    const original = AccumulateArgs.create(0xffffffff, 0xffffffff, 0xffffffff);

    const e = Encoder.create();
    aCtx.accumulateArgs.encode(original, e);
    const blob = e.finish();
    const parsed = aCtx.parseArgs(blob.ptr(), blob.length);

    const assert = Assert.create();
    assert.isEqual(parsed.slot, 0xffffffff, "slot max");
    assert.isEqual(parsed.serviceId, 0xffffffff, "serviceId max");
    assert.isEqual(parsed.argsLength, 0xffffffff, "argsLength max");
    return assert;
  }),

  // ─── Response ───

  test("Response roundtrip with data", () => {
    const data = BytesBlob.parseBlob("0xaabbccdd").okay!;
    const original = Response.create(42, data);

    const e = Encoder.create();
    aCtx.response.encode(original, e);
    const decoded = aCtx.response.decode(Decoder.fromBlob(e.finishRaw())).okay!;

    const assert = Assert.create();
    assert.isEqual(decoded.result, 42, "result");
    assert.isEqualBytes(decoded.data, data, "data");
    return assert;
  }),

  test("Response roundtrip via decode(encode())", () => {
    const data = BytesBlob.parseBlob("0x1234567890").okay!;
    const original = Response.create(-1, data);

    const e = Encoder.create();
    aCtx.response.encode(original, e);
    const decoded = aCtx.response.decode(Decoder.fromBlob(e.finishRaw())).okay!;

    const assert = Assert.create();
    assert.isEqual(decoded.result, -1, "result negative");
    assert.isEqualBytes(decoded.data, data, "data");
    return assert;
  }),

  test("Response roundtrip with empty data", () => {
    const original = Response.create(0, BytesBlob.empty());

    const e = Encoder.create();
    aCtx.response.encode(original, e);
    const decoded = aCtx.response.decode(Decoder.fromBlob(e.finishRaw())).okay!;

    const assert = Assert.create();
    assert.isEqual(decoded.result, 0, "result zero");
    assert.isEqualBytes(decoded.data, BytesBlob.empty(), "empty data");
    return assert;
  }),

  test("Response roundtrip with negative result", () => {
    const original = Response.create(-4, BytesBlob.parseBlob("0xff").okay!);

    const e = Encoder.create();
    aCtx.response.encode(original, e);
    const decoded = aCtx.response.decode(Decoder.fromBlob(e.finishRaw())).okay!;

    const assert = Assert.create();
    assert.isEqual(decoded.result, -4, "result WHO sentinel");
    assert.isEqualBytes(decoded.data, BytesBlob.parseBlob("0xff").okay!, "data");
    return assert;
  }),

  test("Response.with null data roundtrip", () => {
    const packed = Response.with(7, null);
    const raw = unpackResult(packed);
    const decoded = aCtx.response.decode(Decoder.fromBlob(raw)).okay!;

    const assert = Assert.create();
    assert.isEqual(decoded.result, 7, "result");
    assert.isEqualBytes(decoded.data, BytesBlob.empty(), "null data decodes as empty");
    return assert;
  }),
];
```
