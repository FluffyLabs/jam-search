---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/dispatch/general.ts#L1-L118
title: examples/ecalli-test/assembly/dispatch/general.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: c6d65305f387b34b795c9a8cbebf9a7b1b4890a984cc6adae00643312ce12106
language: typescript
---
`examples/ecalli-test/assembly/dispatch/general.ts` (lines 1–118)

```typescript
import { BytesBlob, Decoder, fetch, gas, info, log, lookup, Response, read, write } from "@fluffylabs/as-lan";
import { logger, outputLen } from "./common";

/** Ecalli 0: gas(). No params. */
export function dispatchGas(): u64 {
  const result = gas();
  logger.info(`gas() = ${result}`);
  return Response.with(result);
}

/** Ecalli 1: fetch(kind, param1, param2, offset, maxLen). */
export function dispatchFetch(d: Decoder): u64 {
  const kind = d.varU32();
  const param1 = d.varU32();
  const param2 = d.varU32();
  const offset = d.varU32();
  const maxLen = d.varU32();
  if (d.isError) {
    logger.warn("Failed to decode fetch params");
    return 0;
  }

  const buf = BytesBlob.zero(maxLen);
  const result = fetch(buf.ptr(), offset, maxLen, kind, param1, param2);
  logger.info(`fetch(kind=${kind}) = ${result}`);

  return Response.with(result, buf.subarray(0, outputLen(result, offset, maxLen)));
}

/** Ecalli 2: lookup(service, hash[32], offset, maxLen). */
export function dispatchLookup(d: Decoder): u64 {
  const service = d.varU32();
  const hash = d.bytes32();
  const offset = d.varU32();
  const maxLen = d.varU32();
  if (d.isError) {
    logger.warn("Failed to decode lookup params");
    return 0;
  }

  const buf = BytesBlob.zero(maxLen);
  const result = lookup(service, hash.ptr(), buf.ptr(), offset, maxLen);
  logger.info(`lookup() = ${result}`);

  return Response.with(result, buf.subarray(0, outputLen(result, offset, maxLen)));
}

/** Ecalli 3: read(service, key[bytesVarLen], offset, maxLen). */
export function dispatchRead(d: Decoder): u64 {
  const service = d.varU32();
  const key = d.bytesVarLen();
  const offset = d.varU32();
  const maxLen = d.varU32();
  if (d.isError) {
    logger.warn("Failed to decode read params");
    return 0;
  }

  const buf = BytesBlob.zero(maxLen);
  const result = read(service, key.ptr(), key.length, buf.ptr(), offset, maxLen);
  logger.info(`read() = ${result}`);

  return Response.with(result, buf.subarray(0, outputLen(result, offset, maxLen)));
}

/** Ecalli 4: write(key[bytesVarLen], value[bytesVarLen]). */
export function dispatchWrite(d: Decoder): u64 {
  const key = d.bytesVarLen();
  const value = d.bytesVarLen();
  if (d.isError) {
    logger.warn("Failed to decode write params");
    return 0;
  }

  const result = write(key.ptr(), key.length, value.ptr(), value.length);
  logger.info(`write() = ${result}`);

  return Response.with(result);
}

/** Ecalli 5: info(service, offset, maxLen). */
export function dispatchInfo(d: Decoder): u64 {
  const service = d.varU32();
  const offset = d.varU32();
  const maxLen = d.varU32();
  if (d.isError) {
    logger.warn("Failed to decode info params");
    return 0;
  }

  const buf = BytesBlob.zero(maxLen);
  const result = info(service, buf.ptr(), offset, maxLen);
  logger.info(`info() = ${result}`);

  return Response.with(result, buf.subarray(0, outputLen(result, offset, maxLen)));
}

/** Ecalli 100: log(level, target[bytesVarLen], message[bytesVarLen]). */
export function dispatchLog(d: Decoder): u64 {
  const level = d.varU32();
  const target = d.bytesVarLen();
  const message = d.bytesVarLen();
  if (d.isError) {
    logger.warn("Failed to decode log params");
    return 0;
  }

  const result = log(
    level,
    u32(target.raw.dataStart),
    target.raw.byteLength,
    u32(message.raw.dataStart),
    message.raw.byteLength,
  );
  logger.info(`log(level=${level}) = ${result}`);

  return Response.with(i64(result));
}
```
