---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/library/assembly/test-helpers.ts#L1-L62
title: examples/library/assembly/test-helpers.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 6ca17197542a7af655b36af6e8393aa533dcf83f9fff7d57d744f4a58d84c59c
language: typescript
---
`examples/library/assembly/test-helpers.ts` (lines 1–62)

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
  RefineArgs,
  RefineContext,
  Response,
  WorkExecResult,
  WorkExecResultKind,
} from "@fluffylabs/as-lan";
import { unpackResult } from "@fluffylabs/as-lan/test";
import { accumulate } from "./accumulate";
import { refine } from "./refine";

const ZERO_HASH: Bytes32 = Bytes32.wrapUnchecked(new Uint8Array(32));

/** Call refine with the given payload and decode the Response. */
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

/** Build an operand whose okBlob is the given admin command bytes. */
export function buildAdminOperand(bytes: Uint8Array): Uint8Array {
  const ctx = AccumulateContext.create();
  const op = Operand.create(
    ZERO_HASH,
    ZERO_HASH,
    ZERO_HASH,
    ZERO_HASH,
    100000,
    WorkExecResult.create(WorkExecResultKind.Ok, BytesBlob.wrap(bytes)),
    BytesBlob.empty(),
  );
  const enc = Encoder.create();
  ctx.accumulateItem.encode(AccumulateItem.fromOperand(op), enc);
  return enc.finishRaw();
}

/** Run accumulate with operands pre-seeded via TestAccumulate.setItem. */
export function callAccumulate(argsLength: u32): u64 {
  const ctx = AccumulateContext.create();
  const args = AccumulateArgs.create(7, 42, argsLength);
  const enc = Encoder.create();
  ctx.accumulateArgs.encode(args, enc);
  const encoded = enc.finishRaw();
  const buf = new Uint8Array(encoded.length);
  buf.set(encoded);
  return accumulate(u32(buf.dataStart), buf.byteLength);
}
```
