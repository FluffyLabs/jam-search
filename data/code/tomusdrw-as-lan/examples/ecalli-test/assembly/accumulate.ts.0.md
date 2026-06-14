---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/accumulate.ts#L1-L129
title: examples/ecalli-test/assembly/accumulate.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 98bef9b31a879256e97a9ee38ab7bfdd6ec390461d4a278a2b1c831a84ab4d5d
language: typescript
---
`examples/ecalli-test/assembly/accumulate.ts` (lines 1–129)

```typescript
import {
  AccumulateContext,
  AccumulateItemKind,
  Decoder,
  Encoder,
  FetchKind,
  fetch,
  Response,
} from "@fluffylabs/as-lan";
import {
  dispatchAssign,
  dispatchBless,
  dispatchCheckpoint,
  dispatchDesignate,
  dispatchEject,
  dispatchForget,
  dispatchNewService,
  dispatchProvide,
  dispatchQuery,
  dispatchSolicit,
  dispatchTransfer,
  dispatchUpgrade,
  dispatchYieldResult,
} from "./dispatch/accumulate";
import { logger } from "./dispatch/common";
import {
  dispatchFetch,
  dispatchGas,
  dispatchInfo,
  dispatchLog,
  dispatchLookup,
  dispatchRead,
  dispatchWrite,
} from "./dispatch/general";
import { EcalliIndex } from "./ecalli-index";

/** Max buffer size for fetch responses. */
const FETCH_BUF_SIZE: u32 = 4096;

/**
 * Accumulate: fetches operands and transfers via `fetch(kind=15)`, then
 * dispatches ecalli host calls based on the operand's result blob.
 *
 * For each operand with Ok result, the okBlob is interpreted as an ecalli
 * dispatch payload (ecalli_index + params). For transfers, the transfer
 * details are logged.
 *
 * Response format:
 *   result: u64 LE (last ecalli return value)
 *   data: bytesVarLen (last output data)
 */
export function accumulate(ptr: u32, len: u32): u64 {
  const ctx = AccumulateContext.create();
  const args = ctx.parseArgs(ptr, len);
  logger.info(`accumulate: slot=${args.slot} service=${args.serviceId} argsLength=${args.argsLength}`);

  let lastResponse: u64 = 0;

  for (let i: u32 = 0; i < args.argsLength; i++) {
    // Fetch single item via fetch(kind=15, index=i)
    const buf = new Uint8Array(FETCH_BUF_SIZE);
    const fetchResult = fetch(u32(buf.dataStart), 0, FETCH_BUF_SIZE, FetchKind.OneTransferOrOperand, i, 0);

    if (fetchResult < 0) {
      logger.warn(`fetch(${FetchKind.OneTransferOrOperand}, ${i}) returned ${fetchResult}`);
      continue;
    }

    const dataLen = u32(min(i64(FETCH_BUF_SIZE), fetchResult));
    const d = Decoder.fromBlob(buf.subarray(0, dataLen));

    // Decode discriminator tag
    const tag = d.varU32();
    if (d.isError) {
      logger.warn(`Failed to decode item ${i} tag`);
      continue;
    }

    if (tag === AccumulateItemKind.Operand) {
      lastResponse = processOperand(ctx, d, i);
    } else if (tag === AccumulateItemKind.Transfer) {
      lastResponse = processTransfer(ctx, d, i);
    } else {
      logger.warn(`Unknown item kind ${tag} at index ${i}`);
    }
  }

  return lastResponse;
}

/** Process an operand: decode it, extract okBlob, and dispatch the ecalli from it. */
function processOperand(ctx: AccumulateContext, d: Decoder, index: u32): u64 {
  const r = ctx.operand.decode(d);
  if (r.isError) {
    logger.warn(`Failed to decode operand at index ${index}`);
    return 0;
  }
  const op = r.okay!;

  logger.info(`operand[${index}]: hash=${op.hash} gas=${op.gas} resultKind=${op.result.kind}`);

  if (!op.result.isOk) {
    logger.warn(`operand[${index}]: non-ok result kind=${op.result.kind}`);
    return Response.with(i64(op.result.kind));
  }

  // The okBlob contains the ecalli dispatch payload
  const payload = op.result.okBlob;
  if (payload.raw.length === 0) {
    logger.info(`operand[${index}]: empty okBlob, nothing to dispatch`);
    return Response.with(0);
  }

  const pd = Decoder.fromBytesBlob(payload);
  const ecalliIndex = pd.varU64();
  if (pd.isError) {
    logger.warn(`operand[${index}]: failed to decode ecalli index from okBlob`);
    return 0;
  }

  logger.info(`operand[${index}]: dispatch ecalli ${ecalliIndex}`);

  // General (0-5, 100) — also available in accumulate context
  if (ecalliIndex === EcalliIndex.Gas) return dispatchGas();
  if (ecalliIndex === EcalliIndex.Fetch) return dispatchFetch(pd);
  if (ecalliIndex === EcalliIndex.Lookup) return dispatchLookup(pd);
  if (ecalliIndex === EcalliIndex.Read) return dispatchRead(pd);
  if (ecalliIndex === EcalliIndex.Write) return dispatchWrite(pd);
  if (ecalliIndex === EcalliIndex.Info) return dispatchInfo(pd);
```
