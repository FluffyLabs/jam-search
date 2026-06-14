---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk-ecalli-mocks/src/general/fetch.ts#L1-L128
title: sdk-ecalli-mocks/src/general/fetch.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 0
chunk_total: 2
content_sha: aca22be3c5703277ca0c5e8536860993641ac44882aff7c102ce13964805dcd2
language: typescript
---
`sdk-ecalli-mocks/src/general/fetch.ts` (lines 1–128)

```typescript
import { readBytes, writeToMem } from "../memory.js";

let fetchData: Uint8Array | null = null;
const fetchDataByKind: Map<number, Uint8Array> = new Map();

export function setFetchData(ptr: number, len: number): void {
  fetchData = readBytes(ptr, len);
}

export function setFetchDataForKind(kind: number, ptr: number, len: number): void {
  fetchDataByKind.set(kind, readBytes(ptr, len));
}

// --- Accumulate items for fetch kind=14/15 ---

/** Encoded accumulate items (operands + transfers), each as a tagged blob. */
let accumulateItems: Uint8Array[] = [];

/**
 * Set accumulate items that fetch(kind=15, index) will return.
 * Each item must be a pre-encoded TransferOrOperand blob (tag + data).
 */
export function setAccumulateItems(items: Uint8Array[]): void {
  accumulateItems = items;
}

/** Set a single accumulate item at the given index (callable from WASM via @external). */
export function setAccumulateItem(index: number, ptr: number, len: number): void {
  const data = readBytes(ptr, len);
  while (accumulateItems.length <= index) {
    accumulateItems.push(new Uint8Array(0));
  }
  accumulateItems[index] = data;
}

/** Encode an Operand as a TransferOrOperand blob (tag=0 + operand encoding). */
export function encodeOperand(fields: {
  hash?: Uint8Array;
  exportsRoot?: Uint8Array;
  authorizerHash?: Uint8Array;
  payloadHash?: Uint8Array;
  gas?: bigint;
  resultKind?: number;
  okBlob?: Uint8Array;
  authorizationOutput?: Uint8Array;
}): Uint8Array {
  const parts: Uint8Array[] = [];
  // tag = 0 (operand)
  parts.push(encodeVarU64(0n));
  // hash fields (each exactly 32 bytes)
  parts.push(assertBytes32(fields.hash, "hash"));
  parts.push(assertBytes32(fields.exportsRoot, "exportsRoot"));
  parts.push(assertBytes32(fields.authorizerHash, "authorizerHash"));
  parts.push(assertBytes32(fields.payloadHash, "payloadHash"));
  // gas (varU64)
  parts.push(encodeVarU64(fields.gas ?? 100000n));
  // result: WorkExecResult (varint tag + optional blob)
  const resultKind = fields.resultKind ?? 0;
  parts.push(encodeVarU64(BigInt(resultKind)));
  if (resultKind === 0) {
    // Ok variant: followed by blob (length-prefixed)
    const blob = fields.okBlob ?? new Uint8Array(0);
    parts.push(encodeVarU64(BigInt(blob.length)));
    parts.push(blob);
  }
  // authorizationOutput (blob)
  const authOut = fields.authorizationOutput ?? new Uint8Array(0);
  parts.push(encodeVarU64(BigInt(authOut.length)));
  parts.push(authOut);
  return concatArrays(parts);
}

/** Encode a PendingTransfer as a TransferOrOperand blob (tag=1 + transfer encoding). */
export function encodeTransfer(fields: {
  source: number;
  destination: number;
  amount: bigint;
  memo?: Uint8Array;
  gas: bigint;
}): Uint8Array {
  const parts: Uint8Array[] = [];
  // tag = 1 (transfer)
  parts.push(encodeVarU64(1n));
  // source (u32 LE)
  parts.push(encodeU32(fields.source));
  // destination (u32 LE)
  parts.push(encodeU32(fields.destination));
  // amount (u64 LE)
  parts.push(encodeU64(fields.amount));
  // memo (128 bytes fixed)
  const memo = new Uint8Array(128);
  if (fields.memo) {
    memo.set(fields.memo.subarray(0, 128));
  }
  parts.push(memo);
  // gas (u64 LE)
  parts.push(encodeU64(fields.gas));
  return concatArrays(parts);
}

// --- Main fetch function ---

export function fetch(
  dest_ptr: number,
  offset: number,
  length: number,
  kind: number,
  param1: number,
  _param2: number,
): bigint {
  // Kind 15: OneTransferOrOperand — single item by index
  if (kind === 15) {
    const index = param1;
    if (index >= accumulateItems.length) {
      return -1n; // NONE
    }
    const data = accumulateItems[index];
    writeToMem(dest_ptr, data, offset, length);
    return BigInt(data.length);
  }

  // Kind 14: AllTransfersAndOperands — all items as a sequence
  if (kind === 14) {
    const data = encodeSequenceVarLen(accumulateItems);
    writeToMem(dest_ptr, data, offset, length);
    return BigInt(data.length);
  }

```
