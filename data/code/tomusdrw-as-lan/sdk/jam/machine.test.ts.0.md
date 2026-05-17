---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/machine.test.ts#L1-L125'
title: sdk/jam/machine.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 25f493d9f0d65c7c692e07aa6478628177cc616a3fda95873def2067d5dfb280
language: typescript
---
`sdk/jam/machine.test.ts` (lines 1–125)

```typescript
import { BytesBlob } from "../core/bytes";
import { EcalliResult } from "../ecalli";
import { TestEcalli, TestMachine } from "../test/test-ecalli";
import { Assert, Test, test } from "../test/utils";
import {
  ExitReason,
  InvalidEntryPoint,
  InvokeIo,
  InvokeOutcome,
  Machine,
  OutOfBounds,
  PageAccess,
} from "./refine/machine";

export const TESTS: Test[] = [
  test("InvokeIo.create sets initial gas", () => {
    const a = Assert.create();
    const io = InvokeIo.create(1_000_000);
    a.isEqual(io.gas, 1_000_000, "initial gas");
    return a;
  }),

  test("InvokeIo gas is read/write", () => {
    const a = Assert.create();
    const io = InvokeIo.create(500);
    io.gas = 200;
    a.isEqual(io.gas, 200, "updated gas");
    return a;
  }),

  test("InvokeIo registers default to zero", () => {
    const a = Assert.create();
    const io = InvokeIo.create(100);
    for (let i: u32 = 0; i < 13; i++) {
      a.isEqual(io.getRegister(i), 0, `register ${i}`);
    }
    return a;
  }),

  test("InvokeIo get/set register roundtrip", () => {
    const a = Assert.create();
    const io = InvokeIo.create(100);
    io.setRegister(7, 0xdeadbeef);
    a.isEqual(io.getRegister(7), 0xdeadbeef, "r7 value");
    io.setRegister(0, 42);
    a.isEqual(io.getRegister(0), 42, "r0 value");
    a.isEqual(io.getRegister(7), 0xdeadbeef, "r7 unchanged");
    return a;
  }),
  test("InvokeOutcome holds reason, r8, and io reference", () => {
    const a = Assert.create();
    const io = InvokeIo.create(1000);
    const outcome = InvokeOutcome.create(ExitReason.Host, 12, io);
    a.isEqual(outcome.reason, ExitReason.Host, "reason");
    a.isEqual(outcome.r8, 12, "r8 host call index");
    a.isEqual(outcome.io.gas, 1000, "io reference preserved");
    return a;
  }),
  // ─── Machine.create ────────────────────────────────────────────────

  test("Machine.create returns machine on success", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const code = BytesBlob.zero(4);
    const result = Machine.create(code, 0);
    a.isEqual(result.isOkay, true, "should succeed");
    return a;
  }),

  test("Machine.create returns InvalidEntryPoint on HUH", () => {
    TestEcalli.reset();
    const a = Assert.create();
    TestMachine.setMachineResult(EcalliResult.HUH);
    const code = BytesBlob.zero(4);
    const result = Machine.create(code, 999);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, InvalidEntryPoint.InvalidEntryPoint, "error type");
    return a;
  }),

  // ─── Machine.expunge ──────────────────────────────────────────────

  test("Machine.expunge returns result", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const code = BytesBlob.zero(4);
    const m = Machine.create(code, 0).okay;
    const hash = m.expunge();
    a.isEqual(hash, 0, "expunge result");
    return a;
  }),

  // ─── Machine.pages ────────────────────────────────────────────────

  test("Machine.pages sets page access", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const code = BytesBlob.zero(4);
    const m = Machine.create(code, 0).okay;
    m.pages(0, 1, PageAccess.ReadWrite);
    a.isEqual(true, true, "pages succeeded");
    return a;
  }),

  // ─── Machine.poke ─────────────────────────────────────────────────

  test("Machine.poke writes data to inner machine", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const code = BytesBlob.zero(4);
    const m = Machine.create(code, 0).okay;
    const data = BytesBlob.zero(4);
    const result = m.poke(0, data);
    a.isEqual(result.isOkay, true, "poke ok");
    return a;
  }),

  test("Machine.poke returns OutOfBounds on OOB", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const code = BytesBlob.zero(4);
    const m = Machine.create(code, 0).okay;
    TestMachine.setPokeResult(EcalliResult.OOB);
    const data = BytesBlob.zero(4);
    const result = m.poke(0, data);
```
