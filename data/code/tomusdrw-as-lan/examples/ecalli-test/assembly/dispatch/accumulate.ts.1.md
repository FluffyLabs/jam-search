---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/dispatch/accumulate.ts#L138-L222
title: examples/ecalli-test/assembly/dispatch/accumulate.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 959f37ea403d53d219e8713a13126f25dfae249ca2c056d1039d57914487300c
language: typescript
---
`examples/ecalli-test/assembly/dispatch/accumulate.ts` (lines 138–222)

```typescript
  if (d.isError) {
    logger.warn("Failed to decode eject params");
    return 0;
  }

  const result = eject(service, prevCodeHash.ptr());
  logger.info(`eject() = ${result}`);

  return Response.with(result);
}

/** Ecalli 22: query(hash[32], length). Returns result + r8. */
export function dispatchQuery(d: Decoder): u64 {
  const hash = d.bytes32();
  const length = d.varU32();
  if (d.isError) {
    logger.warn("Failed to decode query params");
    return 0;
  }

  const outR8 = BytesBlob.zero(8);
  const result = query(hash.ptr(), length, outR8.ptr());
  logger.info(`query() = ${result}`);

  return Response.with(result, outR8);
}

/** Ecalli 23: solicit(hash[32], length). */
export function dispatchSolicit(d: Decoder): u64 {
  const hash = d.bytes32();
  const length = d.varU32();
  if (d.isError) {
    logger.warn("Failed to decode solicit params");
    return 0;
  }

  const result = solicit(hash.ptr(), length);
  logger.info(`solicit() = ${result}`);

  return Response.with(result);
}

/** Ecalli 24: forget(hash[32], length). */
export function dispatchForget(d: Decoder): u64 {
  const hash = d.bytes32();
  const length = d.varU32();
  if (d.isError) {
    logger.warn("Failed to decode forget params");
    return 0;
  }

  const result = forget(hash.ptr(), length);
  logger.info(`forget() = ${result}`);

  return Response.with(result);
}

/** Ecalli 25: yield_result(hash[32]). */
export function dispatchYieldResult(d: Decoder): u64 {
  const hash = d.bytes32();
  if (d.isError) {
    logger.warn("Failed to decode yield_result params");
    return 0;
  }

  const result = yield_result(hash.ptr());
  logger.info(`yield_result() = ${result}`);

  return Response.with(result);
}

/** Ecalli 26: provide(service, preimage[bytesVarLen]). */
export function dispatchProvide(d: Decoder): u64 {
  const service = d.varU32();
  const preimage = d.bytesVarLen();
  if (d.isError) {
    logger.warn("Failed to decode provide params");
    return 0;
  }

  const result = provide(service, preimage.ptr(), preimage.length);
  logger.info(`provide() = ${result}`);

  return Response.with(result);
}
```
