---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/pastebin/assembly/pastebin.test.ts#L1-L121
title: examples/pastebin/assembly/pastebin.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 4
content_sha: ab5fcd735bc299486fdca76a9dce43451ae5c1402f5c48f64ad7bf39f7bcb8cc
language: typescript
---
`examples/pastebin/assembly/pastebin.test.ts` (lines 1–121)

```typescript
import {
  AccumulateArgs,
  AccumulateContext,
  AccumulateItem,
  Bytes32,
  BytesBlob,
  blake2b256,
  CurrentServiceData,
  Decoder,
  EcalliResult,
  Encoder,
  Operand,
  Preimages,
  RefineArgs,
  RefineContext,
  Response,
  WorkExecResult,
  WorkExecResultKind,
} from "@fluffylabs/as-lan";
import {
  Assert,
  Test,
  TestAccumulate,
  TestEcalli,
  TestLookup,
  TestPreimages,
  test,
  unpackResult,
} from "@fluffylabs/as-lan/test";
import { accumulate } from "./accumulate";
import { REFINE_OUTPUT_LEN } from "./constants";
import { refine as dispatch } from "./index";
import { refine } from "./refine";
import { cleanupCursorKey, expiryKey, PasteDigest, PasteEntry, pasteKey } from "./storage";

function callRefine(payload: Uint8Array): Response {
  const ctx = RefineContext.create();
  const args = RefineArgs.create(0, 0, 42, BytesBlob.wrap(payload), Bytes32.wrapUnchecked(new Uint8Array(32)));
  const enc = Encoder.create();
  ctx.refineArgs.encode(args, enc);
  const encoded = enc.finishRaw();
  const buf = new Uint8Array(encoded.length);
  buf.set(encoded);
  const raw = unpackResult(refine(u32(buf.dataStart), buf.byteLength));
  return ctx.response.decode(Decoder.fromBlob(raw)).okay!;
}

const ZERO_HASH: Bytes32 = Bytes32.wrapUnchecked(new Uint8Array(32));
const SERVICE_ID: u32 = 42;

function buildOperandItem(okBlob: Uint8Array): Uint8Array {
  const ctx = AccumulateContext.create();
  const op = Operand.create(
    ZERO_HASH,
    ZERO_HASH,
    ZERO_HASH,
    ZERO_HASH,
    100000,
    WorkExecResult.create(WorkExecResultKind.Ok, BytesBlob.wrap(okBlob)),
    BytesBlob.empty(),
  );
  const enc = Encoder.create();
  ctx.accumulateItem.encode(AccumulateItem.fromOperand(op), enc);
  return enc.finishRaw();
}

function callAccumulateSingle(slot: u32, okBlob: Uint8Array): void {
  TestAccumulate.setItem(0, buildOperandItem(okBlob));

  const ctx = AccumulateContext.create();
  const args = AccumulateArgs.create(slot, SERVICE_ID, 1);
  const enc = Encoder.create();
  ctx.accumulateArgs.encode(args, enc);
  const encoded = enc.finishRaw();
  const buf = BytesBlob.wrap(encoded);
  unpackResult(accumulate(buf.ptr(), buf.length));
}

function callAccumulateEmpty(slot: u32): void {
  const ctx = AccumulateContext.create();
  const args = AccumulateArgs.create(slot, SERVICE_ID, 0);
  const enc = Encoder.create();
  ctx.accumulateArgs.encode(args, enc);
  const encoded = enc.finishRaw();
  const buf = BytesBlob.wrap(encoded);
  unpackResult(accumulate(buf.ptr(), buf.length));
}

function buildOkBlob(hash: Uint8Array, length: u32): Uint8Array {
  return PasteDigest.create(Bytes32.wrapUnchecked(hash), length).encode().raw;
}

export const TESTS: Test[] = [
  test("refine hashes payload and emits (hash ‖ length_LE)", () => {
    const payload = new Uint8Array(4);
    payload[0] = 0xde;
    payload[1] = 0xad;
    payload[2] = 0xbe;
    payload[3] = 0xef;
    const resp = callRefine(payload);
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "result");
    assert.isEqual(resp.data.length, REFINE_OUTPUT_LEN, "data.length");
    if (resp.data.length !== REFINE_OUTPUT_LEN) return assert;
    const op = PasteDigest.decodeOrPanic(resp.data);
    assert.isEqualBytes(op.hash.bytes, BytesBlob.wrap(blake2b256(payload)), "hash");
    assert.isEqual(op.length, <u32>4, "length_LE");
    return assert;
  }),
  test("refine handles empty payload", () => {
    const resp = callRefine(new Uint8Array(0));
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "result");
    assert.isEqual(resp.data.length, REFINE_OUTPUT_LEN, "data.length");
    if (resp.data.length !== REFINE_OUTPUT_LEN) return assert;
    const op = PasteDigest.decodeOrPanic(resp.data);
    assert.isEqualBytes(op.hash.bytes, BytesBlob.wrap(blake2b256(new Uint8Array(0))), "hash");
    assert.isEqual(op.length, <u32>0, "length_LE");
    return assert;
  }),
  test("accumulate solicits, writes paste entry, pushes recent", () => {
```
