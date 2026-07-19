---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/item.test.ts#L1-L106
title: sdk/jam/accumulate/item.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 3
content_sha: d0272ececc2bd6d500f404fbc6fbae3dc33eaeb0a892a7adcd364c199e0e8ffc
language: typescript
---
`sdk/jam/accumulate/item.test.ts` (lines 1–106)

```typescript
import { Bytes32, BytesBlob } from "../../core/bytes";
import { Decoder } from "../../core/codec/decode";
import { Encoder } from "../../core/codec/encode";
import { Assert, Test, test } from "../../test/utils";
import {
  AccumulateItem,
  AccumulateItemCodec,
  AccumulateItemKind,
  Operand,
  OperandCodec,
  PendingTransfer,
  PendingTransferCodec,
  TRANSFER_MEMO_SIZE,
  WorkExecResult,
  WorkExecResultCodec,
  WorkExecResultKind,
} from "./item";

/** Helper: create a Bytes32 filled with a repeating byte. */
function bytes32Fill(v: u8): Bytes32 {
  const buf = BytesBlob.zero(32);
  buf.raw.fill(v);
  return Bytes32.wrapUnchecked(buf.raw);
}

// Create codec instances for tests (mirrors what a Context would do).
const workExecResultCodec: WorkExecResultCodec = WorkExecResultCodec.create();
const operandCodec: OperandCodec = OperandCodec.create(workExecResultCodec);
const pendingTransferCodec: PendingTransferCodec = PendingTransferCodec.create();
const accumulateItemCodec: AccumulateItemCodec = AccumulateItemCodec.create(operandCodec, pendingTransferCodec);

/** Helper: encode to bytes, then decode back. */
function roundtripWorkExecResult(original: WorkExecResult): WorkExecResult {
  const e = Encoder.create();
  workExecResultCodec.encode(original, e);
  const d = Decoder.fromBlob(e.finishRaw());
  return workExecResultCodec.decode(d).okay!;
}

export const TESTS: Test[] = [
  // ─── WorkExecResult ───

  test("WorkExecResult roundtrip Ok with blob", () => {
    const blob = BytesBlob.parseBlob("0xdeadbeefcafe").okay!;
    const original = WorkExecResult.create(WorkExecResultKind.Ok, blob);

    const e = Encoder.create();
    workExecResultCodec.encode(original, e);
    const d = Decoder.fromBlob(e.finishRaw());
    const r = workExecResultCodec.decode(d);

    const assert = Assert.create();
    assert.isEqual(r.isOkay, true, "decode succeeded");
    const decoded = r.okay!;
    assert.isEqual(decoded.kind, WorkExecResultKind.Ok, "kind");
    assert.isEqual(decoded.isOk, true, "isOk");
    assert.isEqualBytes(decoded.okBlob, blob, "okBlob");
    assert.isEqual(d.isFinished(), true, "finished");
    assert.isEqual(d.isError, false, "no error");
    return assert;
  }),

  test("WorkExecResult roundtrip Ok with empty blob", () => {
    const original = WorkExecResult.create(WorkExecResultKind.Ok, BytesBlob.empty());
    const decoded = roundtripWorkExecResult(original);

    const assert = Assert.create();
    assert.isEqual(decoded.kind, WorkExecResultKind.Ok, "kind");
    assert.isEqualBytes(decoded.okBlob, BytesBlob.empty(), "empty okBlob");
    return assert;
  }),

  test("WorkExecResult roundtrip OutOfGas", () => {
    const decoded = roundtripWorkExecResult(WorkExecResult.create(WorkExecResultKind.OutOfGas, BytesBlob.empty()));
    const assert = Assert.create();
    assert.isEqual(decoded.kind, WorkExecResultKind.OutOfGas, "kind");
    assert.isEqual(decoded.isOk, false, "isOk");
    assert.isEqualBytes(decoded.okBlob, BytesBlob.empty(), "okBlob empty");
    return assert;
  }),

  test("WorkExecResult roundtrip all error kinds", () => {
    const kinds: WorkExecResultKind[] = [
      WorkExecResultKind.Panic,
      WorkExecResultKind.IncorrectNumberOfExports,
      WorkExecResultKind.DigestTooBig,
      WorkExecResultKind.BadCode,
      WorkExecResultKind.CodeOversize,
    ];

    const assert = Assert.create();
    for (let i = 0; i < kinds.length; i++) {
      const decoded = roundtripWorkExecResult(WorkExecResult.create(kinds[i], BytesBlob.empty()));
      assert.isEqual(decoded.kind, kinds[i], `kind[${i}]`);
      assert.isEqual(decoded.isOk, false, `isOk[${i}]`);
      assert.isEqualBytes(decoded.okBlob, BytesBlob.empty(), `okBlob[${i}]`);
    }
    return assert;
  }),

  // ─── Operand ───

  test("Operand roundtrip with Ok result", () => {
    const blob = BytesBlob.parseBlob("0xaabbccdd").okay!;
    const authOut = BytesBlob.parseBlob("0x1234").okay!;
    const original = Operand.create(
```
