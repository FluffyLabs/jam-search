---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/pastebin/assembly/pastebin.test.ts#L1-L110
title: examples/pastebin/assembly/pastebin.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 3
content_sha: f07a14e24d0a11d72f7f396c0bea931a9d89f49909f66aee12d1c7ab85b216a2
language: typescript
---
`examples/pastebin/assembly/pastebin.test.ts` (lines 1–110)

```typescript
import {
  Bytes32,
  BytesBlob,
  blake2b256,
  CurrentServiceData,
  Decoder,
  EcalliResult,
  Encoder,
  Preimages,
  RefineArgs,
  RefineContext,
} from "@fluffylabs/as-lan";
import {
  AccumulateCall,
  Assert,
  OperandItem,
  RefineCall,
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

const SERVICE_ID: u32 = 42;

/** Seed a single operand whose okBlob is the given paste digest, then run accumulate at `slot`. */
function callAccumulateSingle(slot: u32, okBlob: BytesBlob): void {
  TestAccumulate.setItem(0, OperandItem.create().withOkBlob(okBlob).build());
  AccumulateCall.create().withSlot(slot).withServiceId(SERVICE_ID).call(accumulate, 1);
}

/** Run accumulate at `slot` with no items (drives slot-bucket cleanup). */
function callAccumulateEmpty(slot: u32): void {
  AccumulateCall.create().withSlot(slot).withServiceId(SERVICE_ID).call(accumulate, 0);
}

/** Build an okBlob = PasteDigest(hash, length). */
function buildOkBlob(hash: Uint8Array, length: u32): BytesBlob {
  return PasteDigest.create(Bytes32.wrapUnchecked(hash), length).encode();
}

export const TESTS: Test[] = [
  test("refine hashes payload and emits (hash ‖ length_LE)", () => {
    const payload = BytesBlob.parseBlob("0xdeadbeef").okay!;
    const resp = RefineCall.create().call(refine, payload);
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "result");
    assert.isEqual(resp.data.length, REFINE_OUTPUT_LEN, "data.length");
    if (resp.data.length !== REFINE_OUTPUT_LEN) return assert;
    const op = PasteDigest.decodeOrPanic(resp.data);
    assert.isEqualBytes(op.hash.bytes, BytesBlob.wrap(blake2b256(payload.raw)), "hash");
    assert.isEqual(op.length, <u32>4, "length_LE");
    return assert;
  }),
  test("refine handles empty payload", () => {
    const resp = RefineCall.create().call(refine, BytesBlob.empty());
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
    TestEcalli.reset();
    const assert = Assert.create();

    const payload = BytesBlob.zero(8);
    for (let i = 0; i < 8; i += 1) payload.raw[i] = u8(i);
    const hashBytes = blake2b256(payload.raw);
    const okBlob = buildOkBlob(hashBytes, 8);

    callAccumulateSingle(123, okBlob);

    // Paste entry should be present.
    const storage = CurrentServiceData.create();
    const hash = Bytes32.wrapUnchecked(hashBytes);
    const stored = storage.read(pasteKey(hash));
    assert.isEqual(stored.isSome, true, "paste entry present");
    if (!stored.isSome) return assert;
    const raw = stored.val!;
    assert.isEqual(<u32>raw.length, <u32>8, "paste entry length");
    if (raw.length !== 8) return assert;

    const entry = PasteEntry.decodeOrPanic(raw.raw);
    assert.isEqual(entry.slot, <u32>123, "paste entry slot");
    assert.isEqual(entry.length, <u32>8, "paste entry payload length");
    return assert;
  }),
  test("accumulate re-submission is idempotent", () => {
    TestEcalli.reset();
    const assert = Assert.create();

    const payload = BytesBlob.parseBlob("0x01020304").okay!;
    const hashBytes = blake2b256(payload.raw);
    const okBlob = buildOkBlob(hashBytes, 4);

    callAccumulateSingle(100, okBlob);
    callAccumulateSingle(200, okBlob);

```
