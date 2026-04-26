---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/library/assembly/refine.test.ts#L302-L396
title: examples/library/assembly/refine.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 3
chunk_total: 5
content_sha: 9839fcd1d2bf8a96ce4e4e3d4136af16669d14674a643cc83e199c19bc3c3775
language: typescript
---
`examples/library/assembly/refine.test.ts` (lines 302–396)

```typescript
    const resp = callRefine(buildDemoInput("bad", 1000, BytesBlob.empty()));
    assert.isEqual(resp.result, -102, "invalid entrypoint");
    return assert;
  }),

  test("refine demo: malformed SPI preimage returns -107", () => {
    const assert = Assert.create();
    seedLibraryMapping("corrupt-spi", 0xf0, 4);
    // Preimage is only 3 bytes — not enough for the 11-byte SPI header.
    TestHistoricalLookup.setPreimage(BytesBlob.parseBlob("0x010203").okay!.raw);

    const resp = callRefine(buildDemoInput("corrupt-spi", 1000, BytesBlob.empty()));
    assert.isEqual(resp.result, -107, "malformed SPI preimage");
    return assert;
  }),

  test("refine demo: invoke Panic returns -103 with reason+r8", () => {
    const assert = Assert.create();
    seedLibraryMapping("panic", 0xbb, 16);
    TestHistoricalLookup.setPreimage(buildMinimalSpi(4).raw);
    TestMachine.setMachineResult(0);
    TestMachine.setPagesResult(0);
    TestMachine.setPokeResult(0);
    TestMachine.setInvokeResult(1, 42); // Panic, r8=42
    TestMachine.setExpungeResult(0);

    const resp = callRefine(buildDemoInput("panic", 1000, BytesBlob.empty()));
    assert.isEqual(resp.result, -103, "invoke failure");
    const dec = Decoder.fromBlob(resp.data.raw);
    assert.isEqual(dec.u8(), u8(1), "reason = Panic");
    assert.isEqual(dec.u64(), u64(42), "r8 value preserved");
    assert.isEqual(dec.isError, false, "body decodes cleanly");
    return assert;
  }),

  test("refine demo: oversized output length returns -104 without allocating", () => {
    const assert = Assert.create();
    seedLibraryMapping("huge", 0xdd, 16);
    TestHistoricalLookup.setPreimage(buildMinimalSpi(4).raw);
    TestMachine.setMachineResult(0);
    TestMachine.setPagesResult(0);
    TestMachine.setPokeResult(0);
    TestMachine.setInvokeResult(0, 0); // Halt
    // r7 = ptrAndLen(ptr=0, len=0xFFFFFFFF) — wildly larger than MAX_OUTPUT_LEN.
    TestMachine.setInvokeIoR7((i64(0xffffffff) << 32) | i64(0));
    TestMachine.setExpungeResult(0);

    const resp = callRefine(buildDemoInput("huge", 1000, BytesBlob.empty()));
    assert.isEqual(resp.result, -104, "oversized outLen capped before alloc");
    return assert;
  }),

  test("refine demo: trailing bytes in stored entry return -100", () => {
    const assert = Assert.create();
    // Valid 36-byte LibraryEntry + 1 trailing junk byte.
    const hash = Bytes32.zero();
    hash.raw[0] = 0x77;
    const entry = LibraryEntry.create(hash, 32);
    const enc = Encoder.create();
    LibraryEntryCodec.create().encode(entry, enc);
    enc.u8(0xff); // trailing junk
    TestStorage.set(libraryKey("trail"), BytesBlob.wrap(enc.finishRaw()));

    const resp = callRefine(buildDemoInput("trail", 1000, BytesBlob.empty()));
    assert.isEqual(resp.result, -100, "trailing bytes in stored entry rejected");
    return assert;
  }),

  test("refine demo: peek OOB returns -104", () => {
    const assert = Assert.create();
    seedLibraryMapping("oob", 0xcc, 16);
    TestHistoricalLookup.setPreimage(buildMinimalSpi(4).raw);
    TestMachine.setMachineResult(0);
    TestMachine.setPagesResult(0);
    TestMachine.setPokeResult(0);
    TestMachine.setInvokeResult(0, 0); // Halt
    TestMachine.setInvokeIoR7((i64(3) << 32) | i64(0xfeff9000));
    TestMachine.setPeekResult(-3); // OOB sentinel
    TestMachine.setExpungeResult(0);

    const resp = callRefine(buildDemoInput("oob", 1000, BytesBlob.empty()));
    assert.isEqual(resp.result, -104, "peek OOB");
    return assert;
  }),

  test("mock: setPeekData writes configured bytes to dest", () => {
    const assert = Assert.create();
    // Clear any error sentinel a prior test may have left in peekResult;
    // the mock now skips the memory write when peekResult is a negative sentinel.
    TestMachine.setPeekResult(0);
    const payload = BytesBlob.parseBlob("0xdeadbeef").okay!;
    TestMachine.setPeekData(payload.raw);

    const r = Machine.create(BytesBlob.zero(4), 0);
    if (r.isError) {
```
