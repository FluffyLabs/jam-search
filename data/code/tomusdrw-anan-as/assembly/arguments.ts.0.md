---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/arguments.ts#L1-L131'
title: assembly/arguments.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-24T09:46:09+02:00'
last_modified: '2026-04-24T09:46:09+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 74d835493481baf3a71a129f03f179502df5a6c6622689dfea9494a9b4d9256f
language: typescript
---
`assembly/arguments.ts` (lines 1–131)

```typescript
import { IntMath } from "./math";
import { portable } from "./portable";

export enum Arguments {
  Zero = 0,
  OneImm = 1,
  TwoImm = 2,
  OneOff = 3,
  OneRegOneImm = 4,
  OneRegOneExtImm = 5,
  OneRegTwoImm = 6,
  OneRegOneImmOneOff = 7,
  TwoReg = 8,
  TwoRegOneImm = 9,
  TwoRegOneOff = 10,
  TwoRegTwoImm = 11,
  ThreeReg = 12,
}

/** How many numbers in `Args` is relevant for given `Arguments`. */
export const RELEVANT_ARGS: StaticArray<i32> = StaticArray.fromArray<i32>([0, 1, 2, 1, 2, 3, 3, 3, 2, 3, 3, 4, 3]);
/** How many bytes is required by given `Arguments`. */
export const REQUIRED_BYTES: StaticArray<i32> = StaticArray.fromArray<i32>([0, 0, 1, 0, 1, 9, 1, 1, 1, 1, 1, 2, 2]);

// @unmanaged
export class Args {
  fill(a: u32, b: u32 = 0, c: u32 = 0, d: u32 = 0): Args {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    return this;
  }

  /**
   * TwoReg: `omega_A`
   * TwoRegOneOff: `omega_B`
   * ThreeReg: `omega_B`
   */
  a: u32 = 0;
  /**
   * TwoReg: `omega'_D`
   * TwoRegOneOff: `omega'_A`
   * ThreeReg: `omega_A`
   */
  b: u32 = 0;
  /**
   * ThreeReg: `omega'_D`
   */
  c: u32 = 0;
  d: u32 = 0;
}

type ArgsDecoder = (args: Args, code: StaticArray<u8>, offset: u32, end: u32) => Args;

function twoImm(args: Args, code: StaticArray<u8>, offset: u32, end: u32): Args {
  const low = lowNibble(portable.staticArrayAt(code, offset));
  const split = IntMath.minI32(4, low) + 1;
  const first = decodeI32(code, offset + 1, offset + split);
  const second = decodeI32(code, offset + split, end);
  return args.fill(first, second, 0, 0);
}

export const DECODERS: StaticArray<ArgsDecoder> = StaticArray.fromArray<ArgsDecoder>([
  // DECODERS[Arguments.Zero] =
  (args, _d, _o, _l) => {
    return args.fill(0, 0, 0, 0);
  },
  // DECODERS[Arguments.OneImm] =
  (args, data, o, lim) => {
    return args.fill(decodeI32(data, o, lim), 0, 0, 0);
  },
  // DECODERS[Arguments.TwoImm] =
  (args, data, o, lim) => twoImm(args, data, o, lim),
  // DECODERS[Arguments.OneOff] =
  (args, data, o, lim) => {
    return args.fill(decodeI32(data, o, lim), 0, 0, 0);
  },
  // DECODERS[Arguments.OneRegOneImm] =
  (args, data, o, lim) => {
    return args.fill(lowNibble(data[o]), decodeI32(data, o + 1, lim), 0, 0);
  },
  // DECODERS[Arguments.OneRegOneExtImm] =
  (args, data, o, _lim) => {
    const a = lowNibble(data[o]);
    const b = decodeU32(data, o + 1);
    const c = decodeU32(data, o + 5);
    return args.fill(a, b, c, 0);
  },
  //DECODERS[Arguments.OneRegTwoImm] =
  (args, data, o, lim) => {
    const h = higNibble(data[o]);
    const l = lowNibble(data[o]);
    const split = IntMath.minI32(4, h) + 1;
    const immA = decodeI32(data, o + 1, o + split);
    const immB = decodeI32(data, o + split, lim);
    return args.fill(l, immA, immB, 0);
  },
  // DECODERS[Arguments.OneRegOneImmOneOff] =
  (args, data, o, lim) => {
    const h = higNibble(data[o]);
    const l = lowNibble(data[o]);
    const split = IntMath.minI32(4, h) + 1;
    const immA = decodeI32(data, o + 1, o + split);
    const offs = decodeI32(data, o + split, lim);
    return args.fill(l, immA, offs, 0);
  },
  // DECODERS[Arguments.TwoReg] =
  (args, data, o, _lim) => {
    return args.fill(higNibble(data[o]), lowNibble(data[o]), 0, 0);
  },
  // DECODERS[Arguments.TwoRegOneImm] =
  (args, data, o, lim) => {
    const hig = higNibble(data[o]);
    const low = lowNibble(data[o]);
    return args.fill(hig, low, decodeI32(data, o + 1, lim), 0);
  },
  // DECODERS[Arguments.TwoRegOneOff] =
  (args, data, o, lim) => {
    const hig = higNibble(data[o]);
    const low = lowNibble(data[o]);
    return args.fill(hig, low, decodeI32(data, o + 1, lim), 0);
  },
  // DECODERS[Arguments.TwoRegTwoImm] =
  (args, data, o, lim) => {
    const hig = higNibble(data[o]);
    const low = lowNibble(data[o]);
    const result = twoImm(args, data, o + 1, lim);
    return args.fill(hig, low, result.a, result.b);
  },
  // DECODERS[Arguments.ThreeReg] =
```
