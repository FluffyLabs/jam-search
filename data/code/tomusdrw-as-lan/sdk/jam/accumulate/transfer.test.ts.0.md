---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/transfer.test.ts#L1-L107
title: sdk/jam/accumulate/transfer.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 130a426353b37feb36b964dab6c32c31a780dac3153d42a74c5fd77b4cd04f9d
language: typescript
---
`sdk/jam/accumulate/transfer.test.ts` (lines 1–107)

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
    a.isEqual(<u32>memo.data.length, TRANSFER_MEMO_SIZE, "length = 128");
    a.isEqual(memo.data.raw[0], 0, "first byte = 0");
    a.isEqual(memo.data.raw[127], 0, "last byte = 0");
    return a;
  }),

  test("Memo.create pads short data to 128 bytes", () => {
    const a = Assert.create();
    const short = BytesBlob.parseBlob("0xdeadbeef").okay!;
    const memo = Memo.create(short);
    a.isEqual(<u32>memo.data.length, TRANSFER_MEMO_SIZE, "length = 128");
    a.isEqual(memo.data.raw[0], 0xde, "byte 0 preserved");
    a.isEqual(memo.data.raw[1], 0xad, "byte 1 preserved");
    a.isEqual(memo.data.raw[2], 0xbe, "byte 2 preserved");
    a.isEqual(memo.data.raw[3], 0xef, "byte 3 preserved");
    a.isEqual(memo.data.raw[4], 0, "byte 4 = 0 (padded)");
    a.isEqual(memo.data.raw[127], 0, "byte 127 = 0 (padded)");
    return a;
  }),

  test("Memo.create truncates long data to 128 bytes", () => {
    const a = Assert.create();
    const long = BytesBlob.zero(200);
    for (let i: u32 = 0; i < 200; i++) long.raw[i] = u8(i & 0xff);
    const memo = Memo.create(long);
    a.isEqual(<u32>memo.data.length, TRANSFER_MEMO_SIZE, "length = 128");
    a.isEqual(memo.data.raw[0], 0, "byte 0 preserved");
    a.isEqual(memo.data.raw[127], 127, "byte 127 preserved");
    return a;
  }),

  test("Memo.create with exact 128 bytes wraps directly", () => {
    const a = Assert.create();
    const exact = BytesBlob.zero(TRANSFER_MEMO_SIZE);
    exact.raw[0] = 0xaa;
    exact.raw[127] = 0xbb;
    const memo = Memo.create(exact);
    a.isEqual(<u32>memo.data.length, TRANSFER_MEMO_SIZE, "length = 128");
    a.isEqual(memo.data.raw[0], 0xaa, "byte 0");
    a.isEqual(memo.data.raw[127], 0xbb, "byte 127");
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
```
