---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/context.test.ts#L1-L120'
title: sdk/jam/context.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 1af3948f5c84bc82cd52959b4724eb339fc462aeea0fe7e944e9b2a7b308185e
language: typescript
---
`sdk/jam/context.test.ts` (lines 1–120)

```typescript
import { Bytes32, BytesBlob } from "../core/bytes";
import { Encoder } from "../core/codec/encode";
import { EcalliResult } from "../ecalli";
import { TestEcalli, TestExportSegment, TestGas } from "../test/test-ecalli";
import { Assert, Test, test } from "../test/utils";
import { AccumulateContext } from "./accumulate/context";
import { AuthorizeContext } from "./authorize/context";
import { ExportSegmentError, RefineContext } from "./refine/context";

export const TESTS: Test[] = [
  // ─── remainingGas (all contexts) ──────────────────────────────────

  test("RefineContext.remainingGas returns gas value", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = RefineContext.create();

    TestGas.set(500_000);
    a.isEqual(ctx.remainingGas(), 500_000, "remaining gas");
    return a;
  }),

  test("AccumulateContext.remainingGas returns gas value", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = AccumulateContext.create();

    TestGas.set(750_000);
    a.isEqual(ctx.remainingGas(), 750_000, "remaining gas");
    return a;
  }),

  test("AuthorizeContext.remainingGas returns gas value", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = AuthorizeContext.create();

    TestGas.set(300_000);
    a.isEqual(ctx.remainingGas(), 300_000, "remaining gas");
    return a;
  }),

  // ─── RefineContext.exportSegment ────────────────────────────────────

  test("RefineContext.exportSegment returns segment index", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = RefineContext.create();

    const segment = BytesBlob.parseBlob("0xdeadbeef").okay!;
    const result = ctx.exportSegment(segment);
    a.isEqual(result.isOkay, true, "should be ok");
    a.isEqual(result.okay, 0, "first segment index = 0");

    const result2 = ctx.exportSegment(segment);
    a.isEqual(result2.isOkay, true, "should be ok");
    a.isEqual(result2.okay, 1, "second segment index = 1");
    return a;
  }),

  test("RefineContext.exportSegment returns Full on FULL", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = RefineContext.create();

    TestExportSegment.setResult(EcalliResult.FULL);
    const segment = BytesBlob.parseBlob("0xdeadbeef").okay!;
    const result = ctx.exportSegment(segment);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, ExportSegmentError.Full, "should be Full");
    return a;
  }),

  test("RefineContext.exportSegment works with empty segment", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = RefineContext.create();

    const result = ctx.exportSegment(BytesBlob.empty());
    a.isEqual(result.isOkay, true, "should be ok");
    a.isEqual(result.okay, 0, "segment index = 0");
    return a;
  }),

  test("RefineContext.exportSegment passes through host index", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = RefineContext.create();

    TestExportSegment.setResult(42);
    const segment = BytesBlob.parseBlob("0xaa").okay!;
    const result = ctx.exportSegment(segment);
    a.isEqual(result.isOkay, true, "should be ok");
    a.isEqual(result.okay, 42, "host-returned index");
    return a;
  }),

  test("RefineContext.nestedPvmFromSpi creates a NestedPvm", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = RefineContext.create();
    // Minimal SPI blob: empty regions, 4-byte zero code.
    const e = Encoder.create(32);
    e.u24(0); // roLength
    e.u24(0); // rwLength
    e.u16(0); // heapPages
    e.u24(0); // stackSize
    e.u32(4); // codeLength
    e.u8(0);
    e.u8(0);
    e.u8(0);
    e.u8(0);
    const blob = e.finish();
    const vm = ctx.nestedPvmFromSpi(blob, BytesBlob.empty(), 1);
    a.isEqual(vm.getRegister(7), 0xfeff_0000, "r7 = args start");
    return a;
  }),

  // ─── AccumulateContext.checkpoint ───────────────────────────────────

```
