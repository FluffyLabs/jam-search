---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/program.ts#L1-L116'
title: assembly/program.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-12T09:48:57+02:00'
last_modified: '2026-06-12T09:48:57+02:00'
chunk_index: 0
chunk_total: 4
content_sha: bb154eae700b6ebd36b6ced82f4ad4e3447d845cb414fda4dda5d304afba1468
language: typescript
---
`assembly/program.ts` (lines 1–116)

```typescript
import { Args, Arguments, DECODERS, REQUIRED_BYTES } from "./arguments";
import { Decoder } from "./codec";
import { INSTRUCTIONS, MISSING_INSTRUCTION } from "./instructions";
import { Inst } from "./instructions/utils";
import { portable } from "./portable";
import { Registers } from "./registers";

export type ProgramCounter = u32;
export type Code = StaticArray<u8>;

const MAX_SKIP: u32 = 24;

export class CodeAndMetadata {
  constructor(
    readonly code: Uint8Array,
    readonly metadata: Uint8Array,
  ) {}
}

/** https://graypaper.fluffylabs.dev/#/cc517d7/109a01109a01?v=0.6.5 */
export function extractCodeAndMetadata(data: Uint8Array): CodeAndMetadata {
  const decoder = new Decoder(data);
  const metadataLength = decoder.varU32();
  const metadata = decoder.bytes(metadataLength);
  const code = decoder.remainingBytes();
  return new CodeAndMetadata(code, metadata);
}

/** Convert `u8` to `Uint8Array` */
export function liftBytes(data: u8[]): Uint8Array {
  const p = new Uint8Array(data.length);
  p.set(data, 0);
  return p;
}

/**  Convert `Uint8Array` to `Code` (StaticArray<u8>) */
export function lowerBytes(data: Uint8Array): Code {
  const r = new StaticArray<u8>(data.length);
  for (let i = 0; i < data.length; i++) {
    r[i] = data[i];
  }
  return r;
}

/** https://graypaper.fluffylabs.dev/#/cc517d7/234f01234f01?v=0.6.5 */
export function deblob(program: Uint8Array, useBlockGas: boolean): Program {
  const decoder = new Decoder(program);

  // number of items in the jump table
  const jumpTableLength = decoder.varU32();

  // how many bytes are used to encode a single item of the jump table
  const jumpTableItemLength = decoder.u8();
  // the length of the code (in bytes).
  const codeLength = decoder.varU32();

  const jumpTableLengthInBytes = i32(jumpTableLength * jumpTableItemLength);
  const rawJumpTable = decoder.bytes(jumpTableLengthInBytes);

  // NOTE [ToDr] we copy the code here, because indexing a raw
  // assembly script array is faster than going through `Uint8Array` API.
  const rawCode = lowerBytes(decoder.bytes(codeLength));
  const rawMask = decoder.bytes(i32((codeLength + 7) / 8));

  const mask = new Mask(rawMask, codeLength);
  const jumpTable = new JumpTable(jumpTableItemLength, rawJumpTable);
  const basicBlocks = new BasicBlocks(rawCode, mask);
  const gasCosts = new GasCosts(rawCode, mask, basicBlocks, useBlockGas);

  return new Program(rawCode, mask, jumpTable, basicBlocks, gasCosts);
}

/**
 * https://graypaper.fluffylabs.dev/#/cc517d7/236e01236e01?v=0.6.5
 */
export class Mask {
  /**
   * NOTE: might be longer than code (bit-alignment).
   * In this array we keep `skip(n) + 1` from the Gray Paper
   * for non-instruction bytes.
   * In case the in-code mask says there is an instruction at that location
   * we store `0` here.
   */
  readonly bytesToSkip: StaticArray<u32>;

  constructor(packedMask: Uint8Array, codeLength: i32) {
    this.bytesToSkip = new StaticArray<u32>(codeLength);
    let lastInstructionOffset: u32 = 0;
    for (let i: i32 = packedMask.length - 1; i >= 0; i -= 1) {
      let bits = packedMask[i];
      const index = i * 8;
      for (let b = 7; b >= 0; b--) {
        const isSet = bits & 0b1000_0000;
        bits = bits << 1;
        if (index + b < codeLength) {
          lastInstructionOffset = isSet ? 0 : lastInstructionOffset + 1;
          this.bytesToSkip[index + b] = lastInstructionOffset < MAX_SKIP + 1 ? lastInstructionOffset : MAX_SKIP + 1;
        }
      }
    }
  }

  isInstruction(index: ProgramCounter): boolean {
    if (index >= u32(this.bytesToSkip.length)) {
      return false;
    }

    return portable.staticArrayAt(this.bytesToSkip, u32(index)) === 0;
  }

  /**
   * Given we are at instruction `i`, how many bytes should be skipped to
   * reach the next instruction (i.e. `skip(i) + 1` from the GP).
   *
   * NOTE: we don't guarantee that `isInstruction()` will return true
   * for the new program counter, since `skip` function is bounded by
```
