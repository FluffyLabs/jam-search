---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/spi-decoder/decode-standard-program.ts#L112-L137
title: packages/core/pvm-interpreter/spi-decoder/decode-standard-program.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 2
content_sha: 30cc971126c6b631af6c64f02afae10d1332ba943dd295341601638f9a9e2a76
language: typescript
---
`packages/core/pvm-interpreter/spi-decoder/decode-standard-program.ts` (lines 112–137)

```typescript
    heapDataEnd < heapZerosEnd && getMemorySegment(heapDataEnd, heapZerosEnd),
    stackStart < stackEnd && getMemorySegment(stackStart, stackEnd),
  ].filter(nonEmpty);

  return SpiProgram.new(
    code,
    SpiMemory.new(readableMemory, writeableMemory, heapZerosEnd, stackStart),
    getRegisters(args.length),
  );
}

function getMemorySegment(start: number, end: number, data: Uint8Array | null = null) {
  return MemorySegment.new(start, end, data);
}

function getRegisters(argsLength: number) {
  const regs = new BigUint64Array(NO_OF_REGISTERS);

  // GP reference: https://graypaper.fluffylabs.dev/#/579bd12/2c7c012cb101
  regs[0] = BigInt(LAST_PAGE);
  regs[1] = BigInt(STACK_SEGMENT);
  regs[7] = BigInt(ARGS_SEGMENT);
  regs[8] = BigInt(argsLength);

  return regs;
}
```
