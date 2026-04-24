---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/test-helpers.ts#L1-L86
title: examples/ecalli-test/assembly/test-helpers.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 0
chunk_total: 1
content_sha: bf6842c84941b95b714d19b96888971fdc6ae3cbc97e5bfdcee2d4ad9fa772d8
language: typescript
---
`examples/ecalli-test/assembly/test-helpers.ts` (lines 1–86)

```typescript
import {
  AccumulateArgs,
  AccumulateContext,
  AccumulateItem,
  Bytes32,
  BytesBlob,
  Decoder,
  Encoder,
  Operand,
  PendingTransfer,
  RefineArgs,
  RefineContext,
  Response,
  WorkExecResult,
  WorkExecResultKind,
} from "@fluffylabs/as-lan";
import { TestAccumulate, unpackResult } from "@fluffylabs/as-lan/test";
import { accumulate } from "./accumulate";
import { refine } from "./refine";

// Re-export SDK helpers for use by test files.
export { Response } from "@fluffylabs/as-lan";
export { strBlob, unpackResult } from "@fluffylabs/as-lan/test";

// --- Refine helpers ---

/** Call refine with the given ecalli dispatch payload. */
export function callRefine(payload: Uint8Array): Response {
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

// --- Accumulate helpers ---

const ZERO_HASH: Bytes32 = Bytes32.wrapUnchecked(new Uint8Array(32));

/** Call accumulate with the given number of pre-set items. */
export function callAccumulate(argsLength: u32): Uint8Array {
  const ctx = AccumulateContext.create();
  const args = AccumulateArgs.create(7, 42, argsLength);
  const enc = Encoder.create();
  ctx.accumulateArgs.encode(args, enc);
  const encoded = enc.finishRaw();
  const buf = new Uint8Array(encoded.length);
  buf.set(encoded);
  return unpackResult(accumulate(u32(buf.dataStart), buf.byteLength));
}

/** Encode a tagged transfer item. */
export function buildTransferItem(source: u32, dest: u32, amount: u64, gas: u64): Uint8Array {
  const ctx = AccumulateContext.create();
  const item = AccumulateItem.fromTransfer(PendingTransfer.create(source, dest, amount, BytesBlob.empty(), gas));
  const enc = Encoder.create();
  ctx.accumulateItem.encode(item, enc);
  return enc.finishRaw();
}

/**
 * Set up an operand whose okBlob dispatches the given ecalli, then call accumulate.
 * Returns the decoded Response from the dispatch.
 */
export function callAccumulateWithOperand(ecalliPayload: Uint8Array): Response {
  const ctx = AccumulateContext.create();
  const op = Operand.create(
    ZERO_HASH,
    ZERO_HASH,
    ZERO_HASH,
    ZERO_HASH,
    100000,
    WorkExecResult.create(WorkExecResultKind.Ok, BytesBlob.wrap(ecalliPayload)),
    BytesBlob.empty(),
  );
  const enc = Encoder.create();
  ctx.accumulateItem.encode(AccumulateItem.fromOperand(op), enc);
  const item = enc.finishRaw();
  TestAccumulate.setItem(0, item);
  const raw = callAccumulate(1);
  return ctx.response.decode(Decoder.fromBlob(raw)).okay!;
}
```
