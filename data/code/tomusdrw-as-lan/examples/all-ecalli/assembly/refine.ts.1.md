---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/all-ecalli/assembly/refine.ts#L119-L230
title: examples/all-ecalli/assembly/refine.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 4afe86d7873b4e8d5ed5b97082d187a97bac70f00d07374e4b1eeb3e17e20688
language: typescript
---
`examples/all-ecalli/assembly/refine.ts` (lines 119–230)

```typescript
    out.varU64(100);
    out.u64(u64(r));
    count++;
  }

  // ─── Ecalli 6: historical_lookup(current service, zero hash) ──────
  {
    const hash = Bytes32.zero();
    const buf = BytesBlob.zero(256);
    const r = historical_lookup(CURRENT_SERVICE, hash.ptr(), buf.ptr(), 0, buf.length);
    logger.info(`[6] historical_lookup() = ${r}`);
    out.varU64(6);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 7: export_segment(segment) ────────────────────────────
  {
    const segment = BytesBlob.zero(16);
    segment.raw[0] = 0xab;
    segment.raw[1] = 0xcd;
    const r = export_segment(segment.ptr(), segment.length);
    logger.info(`[7] export_segment() = ${r}`);
    out.varU64(7);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 8: machine(code, entrypoint=0) ────────────────────────
  const machineCode = BytesBlob.zero(4);
  let machineId: i64;
  {
    const r = machine(machineCode.ptr(), machineCode.length, 0);
    machineId = r;
    logger.info(`[8] machine() = ${r}`);
    out.varU64(8);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 11: pages(machine, page=0, count=1, rw=3) ────────────
  {
    const r = pages(u32(machineId), 0, 1, 3);
    logger.info(`[11] pages() = ${r}`);
    out.varU64(11);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 10: poke(machine, data, dest=0) ───────────────────────
  {
    const data = BytesBlob.zero(4);
    data.raw[0] = 0xde;
    data.raw[1] = 0xad;
    data.raw[2] = 0xbe;
    data.raw[3] = 0xef;
    const r = poke(u32(machineId), data.ptr(), 0, data.length);
    logger.info(`[10] poke() = ${r}`);
    out.varU64(10);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 9: peek(machine, source=0, len=4) ─────────────────────
  {
    const buf = BytesBlob.zero(4);
    const r = peek(u32(machineId), buf.ptr(), 0, buf.length);
    logger.info(`[9] peek() = ${r}`);
    out.varU64(9);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 12: invoke(machine, io) ───────────────────────────────
  {
    const io = BytesBlob.zero(8);
    const outR8 = BytesBlob.zero(8);
    const r = invoke(u32(machineId), io.ptr(), outR8.ptr());
    logger.info(`[12] invoke() = ${r}`);
    out.varU64(12);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 13: expunge(machine) ──────────────────────────────────
  {
    const r = expunge(u32(machineId));
    logger.info(`[13] expunge() = ${r}`);
    out.varU64(13);
    out.u64(r);
    count++;
  }

  logger.info(`refine complete: ${count} ecallis invoked`);

  // Encode count at front, then the collected results
  const results = out.finish();
  const finalEnc = Encoder.create();
  finalEnc.varU64(u64(count));
  finalEnc.bytesFixLen(results);
  return Response.with(i64(count), finalEnc.finish());
}

/** Call fetch with the given kind and record the result. Returns 1. */
function fetchAll(out: Encoder, kind: u32, name: string, param1: u32, param2: u32): u32 {
  const buf = BytesBlob.zero(256);
  const r = fetch(buf.ptr(), 0, buf.length, kind, param1, param2);
  logger.info(`[1] fetch(${name}) = ${r}`);
  out.varU64(1);
  out.u64(r);
  return 1;
}
```
