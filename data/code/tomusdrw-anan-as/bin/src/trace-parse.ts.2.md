---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bin/src/trace-parse.ts#L298-L404'
title: bin/src/trace-parse.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-12T09:48:57+02:00'
last_modified: '2026-06-12T09:48:57+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 36efef69f01b44c5334bc7fdd7245a47162e1b809bebf69f4683bb8992f408d8
language: typescript
---
`bin/src/trace-parse.ts` (lines 298–404)

```typescript
    const index = parseInt(match[1], 10);
    if (index < 0 || index >= NO_OF_REGISTERS) {
      throw new Error(`Register index out of range: ${index}`);
    }
    const value = BigInt(`0x${match[2]}`);
    dump.set(index, value);
  }
  return dump;
}

function parseHexBytes(hex: string): Uint8Array {
  if (!hex.startsWith("0x")) {
    throw new Error(`Hex value must start with 0x: ${hex}`);
  }
  const data = hex.slice(2);
  if (data.length % 2 !== 0) {
    throw new Error(`Hex value must have even length: ${hex}`);
  }
  const bytes = new Uint8Array(data.length / 2);
  for (let i = 0; i < data.length; i += 2) {
    const pair = data.slice(i, i + 2);
    if (!/^[0-9a-fA-F]{2}$/.test(pair)) {
      throw new Error(`Invalid hex pair "${pair}" in hex value: ${hex}`);
    }
    bytes[i / 2] = Number.parseInt(pair, 16);
  }
  return bytes;
}

export function encodeRegistersFromDump(dump: RegisterDump): bigint[] {
  const registers = new Array<bigint>(NO_OF_REGISTERS).fill(0n);
  for (const [index, value] of dump) {
    registers[index] = value;
  }
  return registers;
}

export function buildInitialPages(memWrites: MemWrite[]) {
  return memWrites
    .filter((write) => write.data.length > 0)
    .map((write) => ({
      address: write.address,
      length: write.data.length,
      access: ACCESS_WRITE,
    }));
}

export function buildInitialChunks(memWrites: MemWrite[]) {
  return memWrites
    .filter((write) => write.data.length > 0)
    .map((write) => ({
      address: write.address,
      data: Array.from(write.data),
    }));
}

export function isSpiTrace(start: TraceData["start"], memWrites: MemWrite[]) {
  const r07 = start.registers.get(7);
  if (r07 === BigInt(ARGS_SEGMENT_START)) {
    return true;
  }
  return memWrites.some((write) => write.address === ARGS_SEGMENT_START);
}

export function extractSpiArgs(start: TraceData["start"], memWrites: MemWrite[]): Uint8Array {
  const argLenBig = start.registers.get(8) ?? 0n;

  // Validate bounds: must be non-negative and <= 1 MiB (2^20)
  const MAX_ARG_LEN = 1n << 20n;
  if (argLenBig < 0n || argLenBig > MAX_ARG_LEN) {
    return new Uint8Array(0);
  }

  const argLen = Number(argLenBig);
  if (argLen <= 0) {
    return new Uint8Array(0);
  }
  const buffer = new Uint8Array(argLen);
  for (const write of memWrites) {
    if (write.address < ARGS_SEGMENT_START) {
      continue;
    }
    const offset = write.address - ARGS_SEGMENT_START;
    if (offset >= buffer.length) {
      continue;
    }
    buffer.set(write.data.subarray(0, buffer.length - offset), offset);
  }
  return buffer;
}

export function statusToTermination(status: number): TraceData["termination"]["type"] {
  if (status === STATUS.HALT) {
    return "HALT";
  }
  if (status === STATUS.OOG) {
    return "OOG";
  }
  return "PANIC";
}

function parseNumber(value: string): number {
  if (value.startsWith("0x")) {
    return Number.parseInt(value, 16);
  }
  return Number.parseInt(value, 10);
}
```
