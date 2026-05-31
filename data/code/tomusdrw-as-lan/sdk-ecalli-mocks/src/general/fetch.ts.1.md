---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk-ecalli-mocks/src/general/fetch.ts#L122-L219
title: sdk-ecalli-mocks/src/general/fetch.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 1
chunk_total: 2
content_sha: ee5a9863705232b6c64909119e419d2c51df12c9ab899be89e3b2c1a76931199
language: typescript
---
`sdk-ecalli-mocks/src/general/fetch.ts` (lines 122–219)

```typescript
  // Kind 14: AllTransfersAndOperands — all items as a sequence
  if (kind === 14) {
    const data = encodeSequenceVarLen(accumulateItems);
    writeToMem(dest_ptr, data, offset, length);
    return BigInt(data.length);
  }

  // Default: per-kind data, global pre-set, or synthetic pattern
  let data: Uint8Array;
  if (fetchDataByKind.has(kind)) {
    data = fetchDataByKind.get(kind)!;
  } else if (fetchData !== null) {
    data = fetchData;
  } else {
    data = new Uint8Array(16);
    for (let i = 0; i < data.length; i++) {
      data[i] = (kind * 16 + i) & 0xff;
    }
  }
  writeToMem(dest_ptr, data, offset, length);
  return BigInt(data.length);
}

export function resetFetch(): void {
  fetchData = null;
  fetchDataByKind.clear();
  accumulateItems = [];
}

// --- Encoding helpers ---

function assertBytes32(field: Uint8Array | undefined, name: string): Uint8Array {
  if (field === undefined) return new Uint8Array(32);
  if (field.length !== 32) throw new RangeError(`${name} must be 32 bytes, got ${field.length}`);
  return field;
}

function encodeVarU64(value: bigint): Uint8Array {
  if (value < 0n) throw new Error("varU64: negative value");
  if (value < 128n) {
    return new Uint8Array([Number(value)]);
  }
  // Determine number of extra bytes
  let l = 1;
  for (; l <= 7; l++) {
    if (value < 1n << BigInt(7 * (l + 1))) break;
  }
  if (l > 7) l = 8;

  if (l === 8) {
    const buf = new Uint8Array(9);
    buf[0] = 0xff;
    new DataView(buf.buffer).setBigUint64(1, value, true);
    return buf;
  }

  const buf = new Uint8Array(1 + l);
  const shifted = value >> BigInt(8 * l);
  const prefix = (2 ** 8 - 2 ** (8 - l)) & 0xff;
  buf[0] = prefix | Number(shifted);
  for (let i = 0; i < l; i++) {
    buf[1 + i] = Number((value >> BigInt(8 * i)) & 0xffn);
  }
  return buf;
}

function encodeU32(value: number): Uint8Array {
  const buf = new Uint8Array(4);
  new DataView(buf.buffer).setUint32(0, value, true);
  return buf;
}

function encodeU64(value: bigint): Uint8Array {
  const buf = new Uint8Array(8);
  new DataView(buf.buffer).setBigUint64(0, value, true);
  return buf;
}

function encodeSequenceVarLen(items: Uint8Array[]): Uint8Array {
  const parts: Uint8Array[] = [];
  parts.push(encodeVarU64(BigInt(items.length)));
  for (const item of items) {
    parts.push(item);
  }
  return concatArrays(parts);
}

function concatArrays(arrays: Uint8Array[]): Uint8Array {
  let totalLen = 0;
  for (const a of arrays) totalLen += a.length;
  const result = new Uint8Array(totalLen);
  let offset = 0;
  for (const a of arrays) {
    result.set(a, offset);
    offset += a.length;
  }
  return result;
}
```
