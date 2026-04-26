---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/dispatch/refine.ts#L1-L144
title: examples/ecalli-test/assembly/dispatch/refine.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 3fe74030fb4ebe7af5f2d1e38beb91a3731bbe36eb52521bda22783bebae0a14
language: typescript
---
`examples/ecalli-test/assembly/dispatch/refine.ts` (lines 1–144)

```typescript
import {
  BytesBlob,
  Decoder,
  export_segment,
  expunge,
  historical_lookup,
  invoke,
  machine,
  pages,
  peek,
  poke,
  Response,
} from "@fluffylabs/as-lan";
import { logger, outputLen } from "./common";

/** Ecalli 6: historical_lookup(service, hash[32], offset, maxLen). */
export function dispatchHistoricalLookup(d: Decoder): u64 {
  const service = d.varU32();
  const hash = d.bytes32();
  const offset = d.varU32();
  const maxLen = d.varU32();
  if (d.isError) {
    logger.warn("Failed to decode historical_lookup params");
    return 0;
  }

  const buf = BytesBlob.zero(maxLen);
  const result = historical_lookup(service, hash.ptr(), buf.ptr(), offset, maxLen);
  logger.info(`historical_lookup() = ${result}`);

  return Response.with(result, buf.subarray(0, outputLen(result, offset, maxLen)));
}

/** Ecalli 7: export_segment(segment[bytesVarLen]). */
export function dispatchExport(d: Decoder): u64 {
  const segment = d.bytesVarLen();
  if (d.isError) {
    logger.warn("Failed to decode export params");
    return 0;
  }

  const result = export_segment(segment.ptr(), segment.length);
  logger.info(`export_segment() = ${result}`);

  return Response.with(result);
}

/** Ecalli 8: machine(code[bytesVarLen], entrypoint). */
export function dispatchMachine(d: Decoder): u64 {
  const code = d.bytesVarLen();
  const entrypoint = d.varU32();
  if (d.isError) {
    logger.warn("Failed to decode machine params");
    return 0;
  }

  const result = machine(code.ptr(), code.length, entrypoint);
  logger.info(`machine() = ${result}`);

  return Response.with(result);
}

/** Ecalli 9: peek(machine_id, source, length). */
export function dispatchPeek(d: Decoder): u64 {
  const machineId = d.varU32();
  const source = d.varU32();
  const length = d.varU32();
  if (d.isError) {
    logger.warn("Failed to decode peek params");
    return 0;
  }

  const buf = BytesBlob.zero(length);
  const result = peek(machineId, buf.ptr(), source, length);
  logger.info(`peek() = ${result}`);

  if (result === 0) {
    return Response.with(result, buf);
  }
  return Response.with(result);
}

/** Ecalli 10: poke(machine_id, data[bytesVarLen], dest). */
export function dispatchPoke(d: Decoder): u64 {
  const machineId = d.varU32();
  const data = d.bytesVarLen();
  const dest = d.varU32();
  if (d.isError) {
    logger.warn("Failed to decode poke params");
    return 0;
  }

  const result = poke(machineId, data.ptr(), dest, data.length);
  logger.info(`poke() = ${result}`);

  return Response.with(result);
}

/** Ecalli 11: pages(machine_id, start_page, page_count, access_type). */
export function dispatchPages(d: Decoder): u64 {
  const machineId = d.varU32();
  const startPage = d.varU32();
  const pageCount = d.varU32();
  const accessType = d.varU32();
  if (d.isError) {
    logger.warn("Failed to decode pages params");
    return 0;
  }

  const result = pages(machineId, startPage, pageCount, accessType);
  logger.info(`pages() = ${result}`);

  return Response.with(result);
}

/** Ecalli 12: invoke(machine_id, io[bytesVarLen]). Returns exit reason + r8. */
export function dispatchInvoke(d: Decoder): u64 {
  const machineId = d.varU32();
  const io = d.bytesVarLen();
  if (d.isError) {
    logger.warn("Failed to decode invoke params");
    return 0;
  }

  const outR8 = BytesBlob.zero(8);
  const result = invoke(machineId, io.ptr(), outR8.ptr());
  logger.info(`invoke() = ${result}`);

  return Response.with(result, outR8);
}

/** Ecalli 13: expunge(machine_id). */
export function dispatchExpunge(d: Decoder): u64 {
  const machineId = d.varU32();
  if (d.isError) {
    logger.warn("Failed to decode expunge params");
    return 0;
  }

  const result = expunge(machineId);
  logger.info(`expunge() = ${result}`);

  return Response.with(result);
}
```
