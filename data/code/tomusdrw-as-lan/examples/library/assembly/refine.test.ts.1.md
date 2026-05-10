---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/library/assembly/refine.test.ts#L110-L219
title: examples/library/assembly/refine.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 1
chunk_total: 5
content_sha: 415d9de50bccd0c130fd4ca9b015d9fa5a0820a84781b5649b998b9e11619823
language: typescript
---
`examples/library/assembly/refine.test.ts` (lines 110–219)

```typescript
    assert.isEqualBytes(decoded.hash!.bytes, hash.bytes, "hash");
    assert.isEqual(decoded.length, 4096, "length");
    return assert;
  }),

  test("admin: RemoveMapping round-trip", () => {
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
    assert.isEqualBytes(decoded.hash!.bytes, hash.bytes, "hash");
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
    assert.isEqualBytes(decoded.hash!.bytes, hash.bytes, "hash");
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
    const resp = callRefine(BytesBlob.parseBlob("0x99").okay!); // tag=0x99 unknown
    assert.isEqual(resp.result, -106, "result");
    return assert;
  }),

  test("refine: empty payload returns -106", () => {
    const assert = Assert.create();
    const resp = callRefine(BytesBlob.empty());
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
    const bodyBlob = body.finish();

    const input = Encoder.create();
    input.u8(1); // admin tag
    input.bytesFixLen(bodyBlob);

    const resp = callRefine(input.finish());
    assert.isEqual(resp.result, 0, "ok");
    assert.isEqualBytes(resp.data, bodyBlob, "canonical body");
    return assert;
  }),

  test("refine: admin path rejects trailing bytes with -105", () => {
    const assert = Assert.create();
    const hash = Bytes32.zero();
```
