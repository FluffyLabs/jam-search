---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/all-ecalli/assembly/refine.ts#L1-L127
title: examples/all-ecalli/assembly/refine.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 2
content_sha: df707e411e3d8be3a074ed48b820488f6a46b01e6fe50aa97f273e71c2df57c9
language: typescript
---
`examples/all-ecalli/assembly/refine.ts` (lines 1–127)

```typescript
import {
  Bytes32,
  BytesBlob,
  Encoder,
  export_segment,
  expunge,
  FetchKind,
  fetch,
  // General ecallis (0-5, 100)
  gas,
  // Refine ecallis (6-13)
  historical_lookup,
  info,
  invoke,
  Logger,
  log,
  lookup,
  machine,
  pages,
  peek,
  poke,
  RefineContext,
  Response,
  read,
  write,
} from "@fluffylabs/as-lan";

const logger: Logger = Logger.create("all-ecalli");

const CURRENT_SERVICE: u32 = u32.MAX_VALUE;

/**
 * Refine entry point that invokes every host call available in the refine
 * context (general 0-5, 100 + refine 6-13) one by one with sensible
 * parameters, collecting results into the response.
 */
export function refine(ptr: u32, len: u32): u64 {
  const ctx = RefineContext.create();
  const args = ctx.parseArgs(ptr, len);
  logger.info(`refine: service=${args.serviceId} core=${args.coreIndex} item=${args.itemIndex}`);

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

  // ─── Ecalli 1: fetch — all refine-context kinds (0-13) ─────────────
  count += fetchAll(out, FetchKind.Constants, "Constants", 0, 0);
  count += fetchAll(out, FetchKind.Entropy, "Entropy", 0, 0);
  count += fetchAll(out, FetchKind.AuthorizerTrace, "AuthorizerTrace", 0, 0);
  count += fetchAll(out, FetchKind.OtherWorkItemExtrinsics, "OtherWorkItemExtrinsics", 0, 0);
  count += fetchAll(out, FetchKind.MyExtrinsics, "MyExtrinsics", 0, 0);
  count += fetchAll(out, FetchKind.OtherWorkItemImports, "OtherWorkItemImports", 0, 0);
  count += fetchAll(out, FetchKind.MyImports, "MyImports", 0, 0);
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
    const message = BytesBlob.encodeAscii("smoke test");
    const r = log(3, target.ptr(), target.length, message.ptr(), message.length);
    logger.info(`[100] log() = ${r}`);
    out.varU64(100);
    out.u64(u64(r));
    count++;
  }

  // ─── Ecalli 6: historical_lookup(current service, zero hash) ──────
  {
    const hash = Bytes32.zero();
    const buf = BytesBlob.zero(256);
```
