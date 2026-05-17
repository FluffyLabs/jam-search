---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/transfer.test.ts#L1-L114
title: sdk/jam/accumulate/transfer.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 77a02f8c978b554b06a5ed9fca1cd3375bd50bce533632beb4487e87635f74a2
language: typescript
---
`sdk/jam/accumulate/transfer.test.ts` (lines 1–114)

```typescript
import { BytesBlob } from "../../core/bytes";
import { EcalliResult } from "../../ecalli";
import { TestEcalli, TestTransfer } from "../../test/test-ecalli";
import { Assert, Test, test } from "../../test/utils";
import { AccumulateContext, TransferError } from "./context";
import { TRANSFER_MEMO_SIZE } from "./item";
import { Memo } from "./memo";

export const TESTS: Test[] = [
  // ─── Memo ──────────────────────────────────────────────────────────

  test("Memo.empty creates 128 zero bytes", () => {
    const a = Assert.create();
    const memo = Memo.empty();
    a.isEqualBytes(memo.data, BytesBlob.zero(TRANSFER_MEMO_SIZE), "memo");
    return a;
  }),

  test("Memo.create pads short data to 128 bytes", () => {
    const a = Assert.create();
    const short = BytesBlob.parseBlob("0xdeadbeef").okay!;
    const memo = Memo.create(short);
    const expected = BytesBlob.zero(TRANSFER_MEMO_SIZE);
    expected.raw.set(short.raw, 0);
    a.isEqualBytes(memo.data, expected, "memo");
    return a;
  }),

  test("Memo.create truncates long data to 128 bytes", () => {
    const a = Assert.create();
    const long = BytesBlob.zero(200);
    for (let i: u32 = 0; i < 200; i++) long.raw[i] = u8(i & 0xff);
    const memo = Memo.create(long);
    const expected = BytesBlob.zero(TRANSFER_MEMO_SIZE);
    expected.raw.set(long.raw.subarray(0, TRANSFER_MEMO_SIZE), 0);
    a.isEqualBytes(memo.data, expected, "memo");
    return a;
  }),

  test("Memo.create with exact 128 bytes wraps directly", () => {
    const a = Assert.create();
    const exact = BytesBlob.zero(TRANSFER_MEMO_SIZE);
    exact.raw[0] = 0xaa;
    exact.raw[127] = 0xbb;
    const memo = Memo.create(exact);
    a.isEqualBytes(memo.data, exact, "memo");
    return a;
  }),

  // ─── scheduleTransfer ──────────────────────────────────────────────

  test("scheduleTransfer returns ok on success", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = AccumulateContext.create();

    const result = ctx.scheduleTransfer(100, 5000, 100);
    a.isEqual(result.isOkay, true, "should be ok");
    return a;
  }),

  test("scheduleTransfer returns Who on WHO", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = AccumulateContext.create();

    TestTransfer.setTransferResult(EcalliResult.WHO);
    const result = ctx.scheduleTransfer(999, 5000, 100);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, TransferError.Who, "should be Who");
    return a;
  }),

  test("scheduleTransfer returns Low on LOW", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = AccumulateContext.create();

    TestTransfer.setTransferResult(EcalliResult.LOW);
    const result = ctx.scheduleTransfer(100, 5000, 1);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, TransferError.Low, "should be Low");
    return a;
  }),

  test("scheduleTransfer returns Cash on CASH", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = AccumulateContext.create();

    TestTransfer.setTransferResult(EcalliResult.CASH);
    const result = ctx.scheduleTransfer(100, 999_999_999, 100);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, TransferError.Cash, "should be Cash");
    return a;
  }),

  test("scheduleTransfer uses zero memo when none provided", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = AccumulateContext.create();

    // Should succeed with default null memo (128 zero bytes)
    const result = ctx.scheduleTransfer(100, 5000, 100);
    a.isEqual(result.isOkay, true, "should be ok with null memo");
    return a;
  }),

  test("scheduleTransfer accepts explicit Memo", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = AccumulateContext.create();

    const memo = Memo.create(BytesBlob.parseBlob("0xdeadbeef").okay!);
```
