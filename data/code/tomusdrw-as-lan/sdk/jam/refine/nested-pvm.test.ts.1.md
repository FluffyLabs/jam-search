---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/refine/nested-pvm.test.ts#L92-L178
title: sdk/jam/refine/nested-pvm.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 1
chunk_total: 3
content_sha: 87119a3fbfab65c99d00230ff40bc745673a0d97526426d46c5342b7cf2688f9
language: typescript
---
`sdk/jam/refine/nested-pvm.test.ts` (lines 92–178)

```typescript
    const stackPage: u32 = (0xfefe_0000 - stackPages * 4096) / 4096;
    const argsPage: u32 = 0xfeff_0000 / 4096;
    const n = TestMachine.pagesLogLength();
    a.isEqual(n, 4, "four pages() calls");
    a.isEqual(TestMachine.pagesLogField(0, 1), rwPage, "rw start page");
    a.isEqual(TestMachine.pagesLogField(0, 2), 1, "rw pages");
    a.isEqual(TestMachine.pagesLogField(0, 3), 2, "rw access = Write");
    a.isEqual(TestMachine.pagesLogField(1, 1), heapPage, "heap start page");
    a.isEqual(TestMachine.pagesLogField(1, 2), 2, "heap pages");
    a.isEqual(TestMachine.pagesLogField(1, 3), 2, "heap access = Write");
    a.isEqual(TestMachine.pagesLogField(2, 1), stackPage, "stack start page");
    a.isEqual(TestMachine.pagesLogField(2, 2), stackPages, "stack pages");
    a.isEqual(TestMachine.pagesLogField(2, 3), 2, "stack access = Write");
    a.isEqual(TestMachine.pagesLogField(3, 1), argsPage, "args start page");
    a.isEqual(TestMachine.pagesLogField(3, 2), 1, "args pages (5 bytes → 1 page)");
    a.isEqual(TestMachine.pagesLogField(3, 3), 1, "args access = Read");

    a.isEqual(TestMachine.pokeLogLength(), 2, "two poke() calls");
    a.isEqual(TestMachine.pokeLogField(0, 1), 0x0002_0000, "poke 0 dest = rw start");
    a.isEqual(TestMachine.pokeLogField(0, 2), 4, "poke 0 length");
    a.isEqual(TestMachine.pokeLogField(1, 1), 0xfeff_0000, "poke 1 dest = args start");
    a.isEqual(TestMachine.pokeLogField(1, 2), 5, "poke 1 length");
    return a;
  }),

  test("NestedPvm.invoke propagates reason + exit arg, register R/W roundtrip", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const blob = buildSpi(BytesBlob.empty(), BytesBlob.empty(), 0, 0, BytesBlob.zero(4));
    const vm = NestedPvm.fromSpi(blob, BytesBlob.empty(), 500);

    // First invoke: mock returns Host with r8 = 21.
    TestMachine.setInvokeResult(i64(ExitReason.Host), 21);
    const r1 = vm.invoke();
    a.isEqual(r1, ExitReason.Host, "reason = Host");
    a.isEqual(vm.getExitArg(), 21, "exit arg captured");

    // Write a host-call return value into r7, then resume.
    vm.setRegister(7, 0x1234_5678);
    a.isEqual(vm.getRegister(7), 0x1234_5678, "r7 set");

    // Second invoke: mock returns Halt.
    TestMachine.setInvokeResult(i64(ExitReason.Halt), 0);
    const r2 = vm.invoke();
    a.isEqual(r2, ExitReason.Halt, "reason = Halt");

    a.isEqual(vm.expunge(), 0, "expunge OK");
    return a;
  }),

  // ─── fromSpiChecked (Result variant) ───────────────────────────────

  test("NestedPvm.fromSpiChecked returns ok on valid blob", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const blob = buildSpi(BytesBlob.empty(), BytesBlob.empty(), 0, 0, BytesBlob.zero(4));
    const r = NestedPvm.fromSpiChecked(blob, BytesBlob.empty(), 100);
    a.isEqual(r.isOkay, true, "is okay");
    return a;
  }),

  test("NestedPvm.fromSpiChecked returns MalformedBlob on short header", () => {
    TestEcalli.reset();
    const a = Assert.create();
    // Header needs 11 bytes; we only supply 5.
    const blob = BytesBlob.zero(5);
    const r = NestedPvm.fromSpiChecked(blob, BytesBlob.empty(), 100);
    a.isEqual(r.isError, true, "is error");
    a.isEqual(r.error, SpiError.MalformedBlob, "error variant");
    return a;
  }),

  test("NestedPvm.fromSpiChecked returns TrailingBytes on extra data", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const valid = buildSpi(BytesBlob.empty(), BytesBlob.empty(), 0, 0, BytesBlob.zero(4));
    // Append one trailing byte to an otherwise valid blob.
    const padded = BytesBlob.zero(valid.length + 1);
    padded.raw.set(valid.raw, 0);
    padded.raw[valid.length] = 0xff;
    const r = NestedPvm.fromSpiChecked(padded, BytesBlob.empty(), 100);
    a.isEqual(r.isError, true, "is error");
    a.isEqual(r.error, SpiError.TrailingBytes, "error variant");
    return a;
  }),

  test("NestedPvm.fromSpiChecked returns InvalidEntryPoint when host rejects code", () => {
```
