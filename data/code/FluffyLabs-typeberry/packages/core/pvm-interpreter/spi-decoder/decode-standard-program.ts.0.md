---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/spi-decoder/decode-standard-program.ts#L1-L117
title: packages/core/pvm-interpreter/spi-decoder/decode-standard-program.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 2
content_sha: 38b770a559c262dee628a0f5ae475112234557b176a69ab5d0a5fd625a0c7add
language: typescript
---
`packages/core/pvm-interpreter/spi-decoder/decode-standard-program.ts` (lines 1–117)

```typescript
import { Decoder } from "@typeberry/codec";
import { check, WithDebug } from "@typeberry/utils";
import {
  ARGS_SEGMENT,
  DATA_LEGNTH as DATA_LENGTH,
  LAST_PAGE,
  PAGE_SIZE,
  SEGMENT_SIZE,
  STACK_SEGMENT,
} from "./memory-conts.js";
import { alignToPageSize, alignToSegmentSize } from "./memory-utils.js";

const NO_OF_REGISTERS = 13;

export class MemorySegment extends WithDebug {
  static from({ start, end, data }: Omit<MemorySegment, never>) {
    return MemorySegment.new(start, end, data);
  }

  static new(start: number, end: number, data: Uint8Array | null) {
    return new MemorySegment(start, end, data);
  }

  private constructor(
    public readonly start: number,
    public readonly end: number,
    public readonly data: Uint8Array | null,
  ) {
    super();
  }
}
export class SpiMemory extends WithDebug {
  static new(readable: MemorySegment[], writeable: MemorySegment[], sbrkIndex: number, heapEnd: number) {
    return new SpiMemory(readable, writeable, sbrkIndex, heapEnd);
  }

  private constructor(
    public readonly readable: MemorySegment[],
    public readonly writeable: MemorySegment[],
    public readonly sbrkIndex: number,
    public readonly heapEnd: number,
  ) {
    super();
  }
}

export class SpiProgram extends WithDebug {
  static new(code: Uint8Array, memory: SpiMemory, registers: BigUint64Array) {
    return new SpiProgram(code, memory, registers);
  }

  private constructor(
    public readonly code: Uint8Array,
    public readonly memory: SpiMemory,
    public readonly registers: BigUint64Array,
  ) {
    super();
  }
}

/**
 * program = E_3(|o|) ++ E_3(|w|) ++ E_2(z) ++ E_3(s) ++ o ++ w ++ E_4(|c|) ++ c
 *
 * E_n - little endian encoding, n - length
 * o - initial read only data
 * w - initial heap
 * z - heap pages filled with zeros
 * s - stack size
 * c - program code
 *
 * https://graypaper.fluffylabs.dev/#/579bd12/2b92022b9202
 */
export function decodeStandardProgram(program: Uint8Array, args: Uint8Array) {
  const decoder = Decoder.fromBlob(program);
  const oLength = decoder.u24();
  const wLength = decoder.u24();
  check`${args.length <= DATA_LENGTH} Incorrect arguments length`;
  check`${oLength <= DATA_LENGTH} Incorrect readonly segment length`;
  const readOnlyLength = oLength;
  check`${wLength <= DATA_LENGTH} Incorrect heap segment length`;
  const heapLength = wLength;
  const noOfHeapZerosPages = decoder.u16();
  const stackSize = decoder.u24();
  const readOnlyMemory = decoder.bytes(readOnlyLength).raw;
  const initialHeap = decoder.bytes(heapLength).raw;
  const codeLength = decoder.u32();
  const code = decoder.bytes(codeLength).raw;
  decoder.finish();

  const readonlyDataStart = SEGMENT_SIZE;
  const readonlyDataEnd = SEGMENT_SIZE + alignToPageSize(readOnlyLength);
  const heapDataStart = 2 * SEGMENT_SIZE + alignToSegmentSize(readOnlyLength);
  const heapDataEnd = heapDataStart + alignToPageSize(heapLength);
  const heapZerosEnd = heapDataStart + alignToPageSize(heapLength) + noOfHeapZerosPages * PAGE_SIZE;
  const stackStart = STACK_SEGMENT - alignToPageSize(stackSize);
  const stackEnd = STACK_SEGMENT;
  const argsStart = ARGS_SEGMENT;
  const argsEnd = argsStart + alignToPageSize(args.length);
  const argsZerosEnd = argsEnd + alignToPageSize(args.length);

  function nonEmpty(s: MemorySegment | false): s is MemorySegment {
    return s !== false;
  }

  const readableMemory = [
    readOnlyLength > 0 && getMemorySegment(readonlyDataStart, readonlyDataEnd, readOnlyMemory),
    args.length > 0 && getMemorySegment(argsStart, argsEnd, args),
    argsEnd < argsZerosEnd && getMemorySegment(argsEnd, argsZerosEnd),
  ].filter(nonEmpty);
  const writeableMemory = [
    heapLength > 0 && getMemorySegment(heapDataStart, heapDataEnd, initialHeap),
    heapDataEnd < heapZerosEnd && getMemorySegment(heapDataEnd, heapZerosEnd),
    stackStart < stackEnd && getMemorySegment(stackStart, stackEnd),
  ].filter(nonEmpty);

  return SpiProgram.new(
    code,
```
