---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/dispatch/accumulate.ts#L1-L148
title: examples/ecalli-test/assembly/dispatch/accumulate.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 7e7a534e74622573f075e00ef636f78a47bf3b5d680d9069e4031de1e29c3601
language: typescript
---
`examples/ecalli-test/assembly/dispatch/accumulate.ts` (lines 1–148)

```typescript
import {
  assign,
  BytesBlob,
  bless,
  checkpoint,
  Decoder,
  designate,
  eject,
  forget,
  new_service,
  provide,
  query,
  Response,
  solicit,
  TRANSFER_MEMO_SIZE,
  transfer,
  upgrade,
  yield_result,
} from "@fluffylabs/as-lan";
import { logger } from "./common";

/** Ecalli 14: bless(manager, auth_queue[bytesVarLen], delegator, registrar, auto_accum[bytesVarLen], count). */
export function dispatchBless(d: Decoder): u64 {
  const manager = d.varU32();
  const authQueue = d.bytesVarLen();
  const delegator = d.varU32();
  const registrar = d.varU32();
  const autoAccum = d.bytesVarLen();
  const autoAccumCount = d.varU32();
  if (d.isError) {
    logger.warn("Failed to decode bless params");
    return 0;
  }

  const result = bless(manager, authQueue.ptr(), delegator, registrar, autoAccum.ptr(), autoAccumCount);
  logger.info(`bless() = ${result}`);

  return Response.with(result);
}

/** Ecalli 15: assign(core, auth_queue[bytesVarLen], assigners). */
export function dispatchAssign(d: Decoder): u64 {
  const core = d.varU32();
  const authQueue = d.bytesVarLen();
  const assigners = d.varU32();
  if (d.isError) {
    logger.warn("Failed to decode assign params");
    return 0;
  }

  const result = assign(core, authQueue.ptr(), assigners);
  logger.info(`assign() = ${result}`);

  return Response.with(result);
}

/** Ecalli 16: designate(validators[bytesVarLen]). */
export function dispatchDesignate(d: Decoder): u64 {
  const validators = d.bytesVarLen();
  if (d.isError) {
    logger.warn("Failed to decode designate params");
    return 0;
  }

  const result = designate(validators.ptr());
  logger.info(`designate() = ${result}`);

  return Response.with(result);
}

/** Ecalli 17: checkpoint(). No params. */
export function dispatchCheckpoint(): u64 {
  const result = checkpoint();
  logger.info(`checkpoint() = ${result}`);

  return Response.with(result);
}

/** Ecalli 18: new_service(code_hash[32], code_len, gas, allowance, gratis_storage, requested_id). */
export function dispatchNewService(d: Decoder): u64 {
  const codeHash = d.bytes32();
  const codeLen = d.varU32();
  const minGas = d.varU64();
  const allowance = d.varU64();
  const gratisStorage = d.varU32();
  const requestedId = d.varU32();
  if (d.isError) {
    logger.warn("Failed to decode new_service params");
    return 0;
  }

  const result = new_service(codeHash.ptr(), codeLen, minGas, allowance, gratisStorage, requestedId);
  logger.info(`new_service() = ${result}`);

  return Response.with(result);
}

/** Ecalli 19: upgrade(code_hash[32], gas, allowance). */
export function dispatchUpgrade(d: Decoder): u64 {
  const codeHash = d.bytes32();
  const minGas = d.varU64();
  const allowance = d.varU64();
  if (d.isError) {
    logger.warn("Failed to decode upgrade params");
    return 0;
  }

  const result = upgrade(codeHash.ptr(), minGas, allowance);
  logger.info(`upgrade() = ${result}`);

  return Response.with(result);
}

/** Ecalli 20: transfer(dest, amount, gas_fee, memo[bytesVarLen]). */
export function dispatchTransfer(d: Decoder): u64 {
  const dest = d.varU32();
  const amount = d.varU64();
  const gasFee = d.varU64();
  const memo = d.bytesVarLen();
  if (d.isError) {
    logger.warn("Failed to decode transfer params");
    return 0;
  }

  // Pad memo to exactly TRANSFER_MEMO_SIZE bytes as required by the host call.
  const padded = BytesBlob.zero(TRANSFER_MEMO_SIZE);
  padded.raw.set(memo.raw);
  const result = transfer(dest, amount, gasFee, padded.ptr());
  logger.info(`transfer() = ${result}`);

  return Response.with(result);
}

/** Ecalli 21: eject(service, prev_code_hash[32]). */
export function dispatchEject(d: Decoder): u64 {
  const service = d.varU32();
  const prevCodeHash = d.bytes32();
  if (d.isError) {
    logger.warn("Failed to decode eject params");
    return 0;
  }

  const result = eject(service, prevCodeHash.ptr());
  logger.info(`eject() = ${result}`);

  return Response.with(result);
}

```
