---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/codec.ts#L1-L160'
title: assembly/codec.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-22T10:07:05+01:00'
last_modified: '2026-04-22T10:07:05+01:00'
chunk_index: 0
chunk_total: 2
content_sha: c9230102129b783f33619fb9ada9b4ee17692126588aa64d9b11337942131f3b
language: typescript
---
`assembly/codec.ts` (lines 1–160)

```typescript
const MASKS = [<u8>0xff, 0xfe, 0xfc, 0xf8, 0xf0, 0xe0, 0xc0, 0x80];

const variableLength = (firstByte: u8): u8 => {
  const len = <u8>MASKS.length;
  for (let i: u8 = 0; i < len; i++) {
    if (firstByte >= MASKS[i]) {
      return 8 - i;
    }
  }
  return 0;
};

export class Decoder {
  constructor(
    private readonly source: Uint8Array,
    private offset: i32 = 0,
  ) {}

  isExhausted(): boolean {
    return this.offset >= this.source.length;
  }

  private ensureBytes(need: u32): void {
    if (this.offset + need > this.source.length) {
      throw new Error(`Not enough bytes left. Need: ${need}, left: ${this.source.length - this.offset}`);
    }
  }

  finish(): void {
    if (!this.isExhausted()) {
      throw new Error(`Expecting to use all bytes from the decoder. Left: ${this.source.length - this.offset}`);
    }
  }

  varU32(): u32 {
    this.ensureBytes(1);
    const v = decodeVarU32(this.source.subarray(this.offset));
    this.offset += v.offset;
    return v.value;
  }

  u8(): u8 {
    this.ensureBytes(1);
    const v = this.source[this.offset];
    this.offset += 1;
    return v;
  }

  u16(): u16 {
    this.ensureBytes(2);
    let v: u16 = this.source[this.offset];
    v |= u16(this.source[this.offset + 1]) << 8;
    this.offset += 2;
    return v;
  }

  u24(): u32 {
    this.ensureBytes(3);
    let v: u32 = this.source[this.offset];
    v |= u32(this.source[this.offset + 1]) << 8;
    v |= u32(this.source[this.offset + 2]) << 16;
    this.offset += 3;
    return v;
  }

  u32(): u32 {
    this.ensureBytes(4);
    let v: u32 = this.source[this.offset];
    v |= u32(this.source[this.offset + 1]) << 8;
    v |= u32(this.source[this.offset + 2]) << 16;
    v |= u32(this.source[this.offset + 3]) << 24;
    this.offset += 4;
    return v;
  }

  bytes(len: i32): Uint8Array {
    this.ensureBytes(len);
    const v = this.source.subarray(this.offset, this.offset + len);
    this.offset += len;
    return v;
  }

  /** Read remaining bytes into Uint8Array */
  remainingBytes(): Uint8Array {
    const v = this.source.subarray(this.offset);
    this.offset += v.length;
    return v;
  }
}

// @unmanaged
export class ValOffset<T> {
  constructor(
    public readonly value: T,
    public readonly offset: i32,
  ) {}
}

/** Read variable-length u32 and return number of bytes read. */
export function decodeVarU32(data: Uint8Array): ValOffset<u32> {
  const length = i32(variableLength(data[0]));
  const first = u32(data[0]);
  if (length === 0) {
    return new ValOffset(first, 1);
  }

  if (data.length < length) {
    throw new Error(`Not enough bytes to decode 'varU32'. Need ${length}, got: ${data.length}`);
  }

  const msb = (first + 2 ** (8 - length) - 2 ** 8) << (length * 8);
  let number: i32 = 0;
  for (let i = length - 1; i >= 0; i--) {
    number = (number << 8) + data[1 + i];
  }
  number += msb;

  return new ValOffset(number, 1 + length);
}

export function encodeVarU32(v: u64): Uint8Array {
  v = u64(v);
  if (v === u64(0)) {
    return new Uint8Array(1);
  }

  // handle the biggest case
  let maxEncoded = u64(2 ** (7 * 8));
  if (v >= maxEncoded) {
    const dest = new Uint8Array(9);
    dest[0] = 0xff;
    const dataView = new DataView(dest.buffer);
    dataView.setUint64(1, v, true);
    return dest;
  }

  // let's look for the correct range
  let minEncoded = maxEncoded >> u64(7);
  for (let l = 7; l >= 0; l -= 1) {
    if (v >= minEncoded) {
      const dest = new Uint8Array(l + 1);

      // encode the first byte
      const maxVal = u64(2 ** (8 * l));
      const byte = (u32(2 ** 8 - 2 ** (8 - l)) + u32(v / maxVal)) & 0xffff_ffff;
      dest[0] = u8(byte);

      // now encode the rest of bytes of len `l`
      let rest = v % maxVal;
      for (let i = 1; i < 1 + l; i += 1) {
        dest[i] = u8(rest);
        rest >>= u64(8);
      }
      return dest;
    }
    // move one power down
    maxEncoded = minEncoded;
    minEncoded >>= u64(7);
  }

```
