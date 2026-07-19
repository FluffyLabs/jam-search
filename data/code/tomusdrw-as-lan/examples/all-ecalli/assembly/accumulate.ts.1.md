---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/all-ecalli/assembly/accumulate.ts#L135-L275
title: examples/all-ecalli/assembly/accumulate.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 1
chunk_total: 2
content_sha: c59dd21691e7932f427113d2f43ddfed3ec893b8276968df7dfb6a9ce61c2369
language: typescript
---
`examples/all-ecalli/assembly/accumulate.ts` (lines 135–275)

```typescript
    const r = assign(0, authQueue.ptr(), 0b11);
    logger.info(`[15] assign() = ${r}`);
    out.varU64(15);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 16: designate(validators) ─────────────────────────────
  {
    const validators = buildValidators();
    const r = designate(validators.ptr());
    logger.info(`[16] designate() = ${r}`);
    out.varU64(16);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 17: checkpoint() ──────────────────────────────────────
  {
    const r = checkpoint();
    logger.info(`[17] checkpoint() = ${r}`);
    out.varU64(17);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 18: new_service(code_hash, code_len=1024, gas, allowance) ──
  {
    const codeHash = Bytes32.zero();
    codeHash.raw[0] = 0xaa;
    const r = new_service(codeHash.ptr(), 1024, 100000, 50000, 0, u32.MAX_VALUE);
    logger.info(`[18] new_service() = ${r}`);
    out.varU64(18);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 19: upgrade(code_hash, gas, allowance) ────────────────
  {
    const codeHash = Bytes32.zero();
    codeHash.raw[0] = 0xbb;
    const r = upgrade(codeHash.ptr(), 100000, 50000);
    logger.info(`[19] upgrade() = ${r}`);
    out.varU64(19);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 20: transfer(dest=100, amount=500, gas=1000, memo) ────
  {
    const memo = BytesBlob.zero(TRANSFER_MEMO_SIZE);
    memo.raw[0] = 0x42;
    const r = transfer(100, 500, 1000, memo.ptr());
    logger.info(`[20] transfer() = ${r}`);
    out.varU64(20);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 21: eject(service=99, prev_code_hash) ─────────────────
  {
    const prevCodeHash = Bytes32.zero();
    const r = eject(99, prevCodeHash.ptr());
    logger.info(`[21] eject() = ${r}`);
    out.varU64(21);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 22: query(hash, length=64) ────────────────────────────
  {
    const hash = Bytes32.zero();
    const outR8 = BytesBlob.zero(8);
    const r = query(hash.ptr(), 64, outR8.ptr());
    logger.info(`[22] query() = ${r}`);
    out.varU64(22);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 23: solicit(hash, length=64) ──────────────────────────
  {
    const hash = Bytes32.zero();
    const r = solicit(hash.ptr(), 64);
    logger.info(`[23] solicit() = ${r}`);
    out.varU64(23);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 24: forget(hash, length=64) ───────────────────────────
  {
    const hash = Bytes32.zero();
    const r = forget(hash.ptr(), 64);
    logger.info(`[24] forget() = ${r}`);
    out.varU64(24);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 25: yield_result(hash) ────────────────────────────────
  {
    const hash = Bytes32.zero();
    hash.raw[0] = 0xff;
    const r = yield_result(hash.ptr());
    logger.info(`[25] yield_result() = ${r}`);
    out.varU64(25);
    out.u64(r);
    count++;
  }

  // ─── Ecalli 26: provide(service=42, preimage) ─────────────────────
  {
    const preimage = BytesBlob.zero(16);
    preimage.raw[0] = 0xab;
    preimage.raw[1] = 0xcd;
    const r = provide(42, preimage.ptr(), preimage.length);
    logger.info(`[26] provide() = ${r}`);
    out.varU64(26);
    out.u64(r);
    count++;
  }

  logger.info(`accumulate complete: ${count} ecallis invoked`);

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
