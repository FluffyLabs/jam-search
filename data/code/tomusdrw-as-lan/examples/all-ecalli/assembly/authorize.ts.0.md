---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/all-ecalli/assembly/authorize.ts#L1-L125
title: examples/all-ecalli/assembly/authorize.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 2
content_sha: ca9591bc5a372820b09f57b3f450ec00e071569fb96d46d6298a5c1b923a2739
language: typescript
---
`examples/all-ecalli/assembly/authorize.ts` (lines 1–125)

```typescript
import {
  AuthorizeContext,
  Bytes32,
  BytesBlob,
  Encoder,
  FetchKind,
  fetch,
  gas,
  info,
  Logger,
  log,
  lookup,
  ptrAndLen,
  read,
  write,
} from "@fluffylabs/as-lan";

const logger: Logger = Logger.create("all-ecalli");

const CURRENT_SERVICE: u32 = u32.MAX_VALUE;

/** Expected number of ecalli calls by authorize (gas + 8 fetch kinds + lookup + read + write + info + log). */
export const AUTHORIZE_ECALLI_COUNT: u32 = 14;

/**
 * Authorize entry point that invokes every host call available in the
 * authorize context (general 0-5, 100 + fetch kinds 0, 7-13) one by one
 * with sensible parameters, collecting results into the output trace.
 */
export function is_authorized(ptr: u32, len: u32): u64 {
  const ctx = AuthorizeContext.create();
  const coreIndex = ctx.parseCoreIndex(ptr, len);
  logger.info(`authorize: core=${coreIndex}`);

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

  // ─── Ecalli 1: fetch — all authorize-context kinds (0, 7-13) ──────
  count += fetchAll(out, FetchKind.Constants, "Constants", 0, 0);
  count += fetchAll(out, FetchKind.WorkPackage, "WorkPackage", 0, 0);
  count += fetchAll(out, FetchKind.AuthConfig, "AuthConfig", 0, 0);
  count += fetchAll(out, FetchKind.AuthToken, "AuthToken", 0, 0);
  count += fetchAll(out, FetchKind.RefineContext, "RefineContext", 0, 0);
  count += fetchAll(out, FetchKind.AllWorkItems, "AllWorkItems", 0, 0);
  count += fetchAll(out, FetchKind.OneWorkItem, "OneWorkItem", 0, 0);
  count += fetchAll(out, FetchKind.WorkItemPayload, "WorkItemPayload", 0, 0);

  // ─── Ecalli 2: lookup(current service, zero hash) ─────────────────
  {
    const hash = Bytes32.zero();
    const buf = BytesBlob.zero(256);
    const r = lookup(CURRENT_SERVICE, hash.ptr(), buf.ptr(), 0, buf.length);
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
    const message = BytesBlob.encodeAscii("authorize smoke test");
    const r = log(3, target.ptr(), target.length, message.ptr(), message.length);
    logger.info(`[100] log() = ${r}`);
    out.varU64(100);
    out.u64(u64(r));
    count++;
  }

  logger.info(`authorize complete: ${count} ecallis invoked`);

  // Encode count + results as the authorization trace
  const results = out.finishRaw();
  const finalEnc = Encoder.create();
  finalEnc.varU64(u64(count));
  finalEnc.bytesFixLen(BytesBlob.wrap(results));
  return ptrAndLen(finalEnc.finishRaw());
}

/** Call fetch with the given kind and record the result. Returns 1. */
function fetchAll(out: Encoder, kind: u32, name: string, param1: u32, param2: u32): u32 {
  const buf = BytesBlob.zero(256);
  const r = fetch(buf.ptr(), 0, buf.length, kind, param1, param2);
  logger.info(`[1] fetch(${name}) = ${r}`);
```
