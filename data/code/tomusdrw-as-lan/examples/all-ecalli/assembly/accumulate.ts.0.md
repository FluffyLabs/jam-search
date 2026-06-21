---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/all-ecalli/assembly/accumulate.ts#L1-L142
title: examples/all-ecalli/assembly/accumulate.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 5acebf7e3a61d3e6e63748b43503eccfb5f1bb6885b6eca9ed6812b849e574d5
language: typescript
---
`examples/all-ecalli/assembly/accumulate.ts` (lines 1–142)

```typescript
import {
  AccumulateContext,
  assign,
  Bytes32,
  BytesBlob,
  // Accumulate ecallis (14-26)
  bless,
  checkpoint,
  designate,
  Encoder,
  eject,
  FetchKind,
  fetch,
  forget,
  // General ecallis (0-5, 100)
  gas,
  info,
  Logger,
  log,
  lookup,
  new_service,
  provide,
  query,
  Response,
  read,
  solicit,
  TRANSFER_MEMO_SIZE,
  transfer,
  upgrade,
  write,
  yield_result,
} from "@fluffylabs/as-lan";
import { AUTO_ACCUM_COUNT, buildAuthQueue, buildAutoAccum, buildValidators } from "./test-data";

const logger: Logger = Logger.create("all-ecalli");

const CURRENT_SERVICE: u32 = u32.MAX_VALUE;

/**
 * Accumulate entry point that invokes every host call available in the
 * accumulate context (general 0-5, 100 + accumulate 14-26) one by one
 * with sensible parameters, collecting results into the response.
 */
export function accumulate(ptr: u32, len: u32): u64 {
  const ctx = AccumulateContext.create();
  const args = ctx.parseArgs(ptr, len);
  logger.info(`accumulate: slot=${args.slot} service=${args.serviceId} argsLength=${args.argsLength}`);

  const out = Encoder.create();
  let count: u32 = 0;

  // ─── Ecalli 0: gas() ──────────────────────────────────────────────
  {
    const r = gas();
    logger.info(`[0] gas() = ${r}`);
    out.varU64(u64(0));
    out.u64(r);
    count++;
  }

  // ─── Ecalli 1: fetch — all accumulate-context kinds (0, 1, 14, 15) ─
  count += fetchAll(out, FetchKind.Constants, "Constants", 0, 0);
  count += fetchAll(out, FetchKind.Entropy, "Entropy", 0, 0);
  count += fetchAll(out, FetchKind.AllTransfersAndOperands, "AllTransfersAndOperands", 0, 0);
  count += fetchAll(out, FetchKind.OneTransferOrOperand, "OneTransferOrOperand", 0, 0);

  // ─── Ecalli 2: lookup(current service, zero hash) ─────────────────
  {
    const hash = Bytes32.zero();
    const buf = BytesBlob.zero(256);
    const r = lookup(CURRENT_SERVICE, hash.ptr(), buf.ptr(), 0, 256);
    logger.info(`[2] lookup() = ${r}`);
    out.varU64(2);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 3: read(current service, key="test") ──────────────────
  {
    const key = BytesBlob.encodeAscii("test");
    const buf = BytesBlob.zero(256);
    const r = read(CURRENT_SERVICE, key.ptr(), key.length, buf.ptr(), 0, buf.length);
    logger.info(`[3] read() = ${r}`);
    out.varU64(3);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 4: write(key="smoke", value="ok") ─────────────────────
  {
    const key = BytesBlob.encodeAscii("smoke");
    const val = BytesBlob.encodeAscii("ok");
    const r = write(key.ptr(), key.length, val.ptr(), val.length);
    logger.info(`[4] write() = ${r}`);
    out.varU64(4);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 5: info(current service) ──────────────────────────────
  {
    const buf = BytesBlob.zero(96);
    const r = info(CURRENT_SERVICE, buf.ptr(), 0, buf.length);
    logger.info(`[5] info() = ${r}`);
    out.varU64(5);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 100: log(level=3 helpful) ─────────────────────────────
  {
    const target = BytesBlob.encodeAscii("all-ecalli");
    const message = BytesBlob.encodeAscii("smoke test");
    const r = log(3, target.ptr(), target.length, message.ptr(), message.length);
    logger.info(`[100] log() = ${r}`);
    out.varU64(100);
    out.u64(u64(r));
    count++;
  }

  // ─── Ecalli 14: bless(manager=1, auth_queue, delegator=2, registrar=3, auto_accum) ──
  {
    const authQueue = buildAuthQueue();
    const autoAccum = buildAutoAccum();
    const r = bless(1, authQueue.ptr(), 2, 3, autoAccum.ptr(), AUTO_ACCUM_COUNT);
    logger.info(`[14] bless() = ${r}`);
    out.varU64(14);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 15: assign(core=0, auth_queue, assigners=0b11) ────────
  {
    const authQueue = buildAuthQueue();
    const r = assign(0, authQueue.ptr(), 0b11);
    logger.info(`[15] assign() = ${r}`);
    out.varU64(15);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 16: designate(validators) ─────────────────────────────
```
