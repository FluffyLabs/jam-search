---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/library/assembly/refine.test.ts#L213-L314
title: examples/library/assembly/refine.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 2
chunk_total: 5
content_sha: 978207749c969df1222f11ebdeeec3578e9c39e677d2739eba610c031b876105
language: typescript
---
`examples/library/assembly/refine.test.ts` (lines 213–314)

```typescript
    assert.isEqualBytes(resp.data, bodyBlob, "canonical body");
    return assert;
  }),

  test("refine: admin path rejects trailing bytes with -105", () => {
    const assert = Assert.create();
    const hash = Bytes32.zero();
    const codec = AdminCommandCodec.create();
    const body = Encoder.create();
    codec.encode(AdminCommand.solicit(hash, 1), body);

    const input = Encoder.create();
    input.u8(1); // admin tag
    input.bytesFixLen(body.finish());
    input.u8(0xff); // trailing junk
    const resp = callRefine(input.finish());
    assert.isEqual(resp.result, -105, "trailing bytes rejected");
    return assert;
  }),

  test("refine: admin path rejects malformed bytes with -105", () => {
    const assert = Assert.create();
    const input = Encoder.create();
    input.u8(1); // admin tag
    input.u8(0x99); // unknown AdminCommand tag
    const resp = callRefine(input.finish());
    assert.isEqual(resp.result, -105, "malformed");
    return assert;
  }),

  test("refine demo: trailing bytes after payload return -106", () => {
    const assert = Assert.create();
    seedLibraryMapping("ok", 0x01, 16);
    const valid = buildDemoInput("ok", 1000, BytesBlob.empty());
    const withTrail = BytesBlob.zero(valid.length + 1);
    withTrail.raw.set(valid.raw, 0);
    withTrail.raw[valid.length] = 0xff;
    const resp = callRefine(withTrail);
    assert.isEqual(resp.result, -106, "trailing bytes after demo payload rejected");
    return assert;
  }),

  test("refine demo: unknown library name returns -100", () => {
    const assert = Assert.create();
    TestStorage.set(libraryKey("missing"), null);

    const input = buildDemoInput("missing", 1000, BytesBlob.empty());
    const resp = callRefine(input);
    assert.isEqual(resp.result, -100, "unknown library");
    return assert;
  }),

  test("refine demo: malformed stored entry returns -100", () => {
    const assert = Assert.create();
    // Store a value that is too short to decode a LibraryEntry (hash+length = 36 bytes).
    TestStorage.set(libraryKey("corrupt"), BytesBlob.parseBlob("0xdead").okay!);

    const input = buildDemoInput("corrupt", 1000, BytesBlob.empty());
    const resp = callRefine(input);
    assert.isEqual(resp.result, -100, "malformed entry treated as unknown");
    return assert;
  }),

  test("refine demo: preimage unavailable returns -101", () => {
    const assert = Assert.create();
    seedLibraryMapping("ed25519", 0xee, 64);
    TestHistoricalLookup.setNone();

    const input = buildDemoInput("ed25519", 1000, BytesBlob.empty());
    const resp = callRefine(input);
    assert.isEqual(resp.result, -101, "preimage unavailable");
    return assert;
  }),

  test("refine demo: happy path returns peeked output", () => {
    const assert = Assert.create();
    seedLibraryMapping("echo", 0x01, 16);
    TestHistoricalLookup.setPreimage(buildMinimalSpi(4).raw);
    TestMachine.setMachineResult(0); // create OK, id = 0
    TestMachine.setPokeResult(0);
    TestMachine.setPagesResult(0);
    // invoke returns Halt (0); r7 post-invoke = packed ptrAndLen(ptr=0xFEFF2000, len=3)
    TestMachine.setInvokeResult(0, 0);
    TestMachine.setInvokeIoR7((i64(3) << 32) | i64(0xfeff2000));
    const expected = BytesBlob.parseBlob("0x010203").okay!;
    TestMachine.setPeekData(expected.raw);
    TestMachine.setExpungeResult(0);

    const input = buildDemoInput("echo", 1000, BytesBlob.parseBlob("0xaabb").okay!);
    const resp = callRefine(input);
    assert.isEqual(resp.result, 0, "ok");
    assert.isEqualBytes(resp.data, expected, "peeked output");
    return assert;
  }),

  test("refine demo: invalid entrypoint returns -102", () => {
    const assert = Assert.create();
    seedLibraryMapping("bad", 0xaa, 16);
    TestHistoricalLookup.setPreimage(buildMinimalSpi(4).raw);
    TestMachine.setMachineResult(-9); // HUH sentinel (InvalidEntryPoint)

    const resp = callRefine(buildDemoInput("bad", 1000, BytesBlob.empty()));
```
