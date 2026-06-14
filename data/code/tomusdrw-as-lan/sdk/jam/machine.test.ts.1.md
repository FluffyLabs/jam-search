---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/machine.test.ts#L121-L235'
title: sdk/jam/machine.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 936aabb6805d9c4634b2497479bff09b93ccc0aebbf03e2c8b163f292b07a35d
language: typescript
---
`sdk/jam/machine.test.ts` (lines 121–235)

```typescript
    const code = BytesBlob.zero(4);
    const m = Machine.create(code, 0).okay;
    TestMachine.setPokeResult(EcalliResult.OOB);
    const data = BytesBlob.zero(4);
    const result = m.poke(0, data);
    a.isEqual(result.isError, true, "poke error");
    a.isEqual(result.error, OutOfBounds.OutOfBounds, "OOB error");
    return a;
  }),

  // ─── Machine.peek ─────────────────────────────────────────────────

  test("Machine.peek reads data from inner machine", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const code = BytesBlob.zero(4);
    const m = Machine.create(code, 0).okay;
    const buf = BytesBlob.zero(4);
    const result = m.peek(0, buf);
    a.isEqual(result.isOkay, true, "peek ok");
    return a;
  }),

  test("Machine.peek returns OutOfBounds on OOB", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const code = BytesBlob.zero(4);
    const m = Machine.create(code, 0).okay;
    TestMachine.setPeekResult(EcalliResult.OOB);
    const buf = BytesBlob.zero(4);
    const result = m.peek(0, buf);
    a.isEqual(result.isError, true, "peek error");
    a.isEqual(result.error, OutOfBounds.OutOfBounds, "OOB error");
    return a;
  }),

  // ─── Machine.invoke ───────────────────────────────────────────────

  test("Machine.invoke returns Halt by default", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const code = BytesBlob.zero(4);
    const m = Machine.create(code, 0).okay;
    const io = InvokeIo.create(1_000_000);
    const outcome = m.invoke(io);
    a.isEqual(outcome.reason, ExitReason.Halt, "exit reason");
    a.isEqual(outcome.r8, 0, "r8 default");
    a.isEqual(outcome.io.gas, 1_000_000, "io reference");
    return a;
  }),

  test("Machine.invoke returns Host with host call index in r8", () => {
    TestEcalli.reset();
    const a = Assert.create();
    TestMachine.setInvokeResult(i64(ExitReason.Host), 12);
    const code = BytesBlob.zero(4);
    const m = Machine.create(code, 0).okay;
    const io = InvokeIo.create(500);
    const outcome = m.invoke(io);
    a.isEqual(outcome.reason, ExitReason.Host, "exit reason");
    a.isEqual(outcome.r8, 12, "host call index");
    return a;
  }),

  test("Machine.invoke returns Oob", () => {
    TestEcalli.reset();
    const a = Assert.create();
    TestMachine.setInvokeResult(i64(ExitReason.Oob));
    const code = BytesBlob.zero(4);
    const m = Machine.create(code, 0).okay;
    const io = InvokeIo.create(1);
    const outcome = m.invoke(io);
    a.isEqual(outcome.reason, ExitReason.Oob, "exit reason");
    return a;
  }),

  test("Machine.invoke returns Fault with address in r8", () => {
    TestEcalli.reset();
    const a = Assert.create();
    TestMachine.setInvokeResult(i64(ExitReason.Fault), 0x1234);
    const code = BytesBlob.zero(4);
    const m = Machine.create(code, 0).okay;
    const io = InvokeIo.create(100);
    const outcome = m.invoke(io);
    a.isEqual(outcome.reason, ExitReason.Fault, "exit reason");
    a.isEqual(outcome.r8, 0x1234, "fault address");
    return a;
  }),

  test("Machine.expunge returns configured result", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const code = BytesBlob.zero(4);
    const m = Machine.create(code, 0).okay;
    TestMachine.setExpungeResult(0x42);
    const hash = m.expunge();
    a.isEqual(hash, 0x42, "configured expunge result");
    return a;
  }),

  test("InvokeIo handles u64 max gas value", () => {
    const a = Assert.create();
    const io = InvokeIo.create(u64.MAX_VALUE);
    a.isEqual(io.gas, u64.MAX_VALUE, "max gas");
    return a;
  }),

  test("InvokeIo register stores u64 max value", () => {
    const a = Assert.create();
    const io = InvokeIo.create(0);
    io.setRegister(12, u64.MAX_VALUE);
    a.isEqual(io.getRegister(12), u64.MAX_VALUE, "max register r12");
    return a;
  }),
];
```
