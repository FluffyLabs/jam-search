---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/library/assembly/refine.test.ts#L104-L212
title: examples/library/assembly/refine.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 1
chunk_total: 5
content_sha: ab60baca35d584b9e1161cc4a3051c0fb861fffc443a54fd9e2c775e3cba68d6
language: typescript
---
`examples/library/assembly/refine.test.ts` (lines 104–212)

```typescript
    const assert = Assert.create();
    const cmd = AdminCommand.removeMapping(BytesBlob.encodeAscii("blake2b"));
    const codec = AdminCommandCodec.create();

    const enc = Encoder.create();
    codec.encode(cmd, enc);
    const decoded = codec.decode(Decoder.fromBlob(enc.finishRaw())).okay!;
    assert.isEqual<u32>(decoded.kind, AdminCommandKind.RemoveMapping, "kind");
    assert.isEqualBytes(decoded.name!, BytesBlob.encodeAscii("blake2b"), "name");
    return assert;
  }),

  test("admin: Solicit round-trip", () => {
    const assert = Assert.create();
    const hash = Bytes32.zero();
    hash.raw[0] = 0xbb;
    const cmd = AdminCommand.solicit(hash, 2048);
    const codec = AdminCommandCodec.create();

    const enc = Encoder.create();
    codec.encode(cmd, enc);
    const decoded = codec.decode(Decoder.fromBlob(enc.finishRaw())).okay!;
    assert.isEqual<u32>(decoded.kind, AdminCommandKind.Solicit, "kind");
    assert.isEqual(decoded.hash!.raw[0], 0xbb, "hash");
    assert.isEqual(decoded.length, 2048, "length");
    return assert;
  }),

  test("admin: Forget round-trip", () => {
    const assert = Assert.create();
    const hash = Bytes32.zero();
    hash.raw[0] = 0xcc;
    const cmd = AdminCommand.forget(hash, 512);
    const codec = AdminCommandCodec.create();

    const enc = Encoder.create();
    codec.encode(cmd, enc);
    const decoded = codec.decode(Decoder.fromBlob(enc.finishRaw())).okay!;
    assert.isEqual<u32>(decoded.kind, AdminCommandKind.Forget, "kind");
    assert.isEqual(decoded.hash!.raw[0], 0xcc, "hash");
    assert.isEqual(decoded.length, 512, "length");
    return assert;
  }),

  test("admin: Provide round-trip", () => {
    const assert = Assert.create();
    const preimage = BytesBlob.parseBlob("0x01020304").okay!;
    const cmd = AdminCommand.provide(preimage);
    const codec = AdminCommandCodec.create();

    const enc = Encoder.create();
    codec.encode(cmd, enc);
    const decoded = codec.decode(Decoder.fromBlob(enc.finishRaw())).okay!;
    assert.isEqual<u32>(decoded.kind, AdminCommandKind.Provide, "kind");
    assert.isEqualBytes(decoded.preimage!, preimage, "preimage");
    return assert;
  }),

  test("admin: decode rejects unknown tag", () => {
    const assert = Assert.create();
    const codec = AdminCommandCodec.create();
    const bytes = BytesBlob.parseBlob("0x99").okay!.raw;
    const r = codec.decode(Decoder.fromBlob(bytes));
    assert.isEqual(r.isError, true, "should error");
    return assert;
  }),

  test("refine: unknown tag returns -106", () => {
    const assert = Assert.create();
    const resp = callRefine(BytesBlob.parseBlob("0x99").okay!.raw); // tag=0x99 unknown
    assert.isEqual(resp.result, -106, "result");
    return assert;
  }),

  test("refine: empty payload returns -106", () => {
    const assert = Assert.create();
    const resp = callRefine(new Uint8Array(0));
    assert.isEqual(resp.result, -106, "result");
    return assert;
  }),

  test("refine: admin path round-trips SetMapping canonically", () => {
    const assert = Assert.create();
    const hash = Bytes32.zero();
    hash.raw[0] = 0xaa;
    const cmd = AdminCommand.setMapping(BytesBlob.encodeAscii("ed25519"), hash, 4096);
    const codec = AdminCommandCodec.create();
    const body = Encoder.create();
    codec.encode(cmd, body);
    const bodyBytes = body.finishRaw();

    const input = Encoder.create();
    input.u8(1); // admin tag
    input.bytesFixLen(BytesBlob.wrap(bodyBytes));

    const resp = callRefine(input.finishRaw());
    assert.isEqual(resp.result, 0, "ok");
    assert.isEqualBytes(resp.data, BytesBlob.wrap(bodyBytes), "canonical body");
    return assert;
  }),

  test("refine: admin path rejects trailing bytes with -105", () => {
    const assert = Assert.create();
    const hash = Bytes32.zero();
    const codec = AdminCommandCodec.create();
    const body = Encoder.create();
    codec.encode(AdminCommand.solicit(hash, 1), body);

    const input = Encoder.create();
```
