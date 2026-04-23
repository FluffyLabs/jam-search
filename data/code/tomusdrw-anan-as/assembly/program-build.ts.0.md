---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/program-build.ts#L1-L110
title: assembly/program-build.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-22T10:07:05+01:00'
last_modified: '2026-04-22T10:07:05+01:00'
chunk_index: 0
chunk_total: 1
content_sha: 763225467ea77180bd4ff3e3f7d8cb0eb0adafee35afbda95314acafc48428e6
language: typescript
---
`assembly/program-build.ts` (lines 1–110)

```typescript
import { Arguments, higNibble, lowNibble, REQUIRED_BYTES } from "./arguments";
import { encodeVarU32 } from "./codec";
import { INSTRUCTIONS, MISSING_INSTRUCTION } from "./instructions";
import { IntMath } from "./math";

/** Turn given bytecode into a valid program. Add JumpTable and Mask. */
export function wrapAsProgram(bytecode: Uint8Array): Uint8Array {
  const jumpTableLength: u8 = 0;
  const jumpTableItemLength: u8 = 0;
  const codeLength = bytecode.length;
  const mask = buildMask(bytecode);
  const codeLengthBytes = encodeVarU32(codeLength);

  const data = new Uint8Array(1 + 1 + codeLengthBytes.length + codeLength + mask.length);
  data[0] = jumpTableLength;
  data[1] = jumpTableItemLength;
  let offset = 2;
  for (let i = 0; i < codeLengthBytes.length; i++) {
    data[offset] = codeLengthBytes[i];
    offset++;
  }
  for (let i = 0; i < bytecode.length; i++) {
    data[offset] = bytecode[i];
    offset++;
  }
  for (let i = 0; i < mask.length; i++) {
    data[offset] = mask[i];
    offset++;
  }
  return data;
}

function skipBytes(kind: Arguments, data: Uint8Array): i32 {
  switch (kind) {
    case Arguments.Zero:
      return 0;
    case Arguments.OneImm:
      return immBytes(data.length, 0);
    case Arguments.TwoImm: {
      const low = lowNibble(data[0]);
      const split = low + 1;
      return 1 + split + immBytes(data.length, split + 1);
    }
    case Arguments.OneOff:
      return immBytes(data.length, 0);
    case Arguments.OneRegOneImm:
      return 1 + immBytes(data.length, 1);
    case Arguments.OneRegOneExtImm:
      return 9;
    case Arguments.OneRegTwoImm: {
      const hig = higNibble(data[0]);
      const split = hig + 1;
      return 1 + split + immBytes(data.length, 1 + split);
    }
    case Arguments.OneRegOneImmOneOff: {
      const hig = higNibble(data[0]);
      const split = hig + 1;
      return 1 + split + immBytes(data.length, 1 + split);
    }
    case Arguments.TwoReg:
      return 1;
    case Arguments.TwoRegOneImm:
      return 1 + IntMath.minI32(4, data.length);
    case Arguments.TwoRegOneOff:
      return 1 + IntMath.minI32(4, data.length);
    case Arguments.TwoRegTwoImm: {
      const low = lowNibble(data[1]);
      const split = low + 1;
      return 2 + split + immBytes(data.length, 2 + split);
    }
    case Arguments.ThreeReg:
      return 2;
    default:
      throw new Error(`Unhandled arguments kind: ${kind}`);
  }
}

function buildMask(bytecode: Uint8Array): u8[] {
  const mask = new StaticArray<boolean>(bytecode.length);
  for (let i = 0; i < bytecode.length; i++) {
    const instruction = bytecode[i];
    const iData = <i32>instruction < INSTRUCTIONS.length ? INSTRUCTIONS[instruction] : MISSING_INSTRUCTION;
    mask[i] = true;

    const requiredBytes = REQUIRED_BYTES[iData.kind];
    if (i + 1 + requiredBytes <= bytecode.length) {
      i += skipBytes(iData.kind, bytecode.subarray(i + 1));
    }
  }
  // pack mask
  const packed: u8[] = [];
  for (let i = 0; i < mask.length; i += 8) {
    let byte: u8 = 0;
    for (let j = i; j < i + 8; j++) {
      byte >>= 1;
      if (j < mask.length && mask[j]) {
        byte |= 0b1000_0000;
      }
    }
    packed.push(byte);
  }
  return packed;
}

function immBytes(dataLength: i32, required: i32): i32 {
  if (dataLength < required) {
    return 0;
  }
  return IntMath.minI32(4, dataLength - required);
}
```
