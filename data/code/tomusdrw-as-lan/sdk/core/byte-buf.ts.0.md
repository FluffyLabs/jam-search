---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/core/byte-buf.ts#L1-L152'
title: sdk/core/byte-buf.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 2
content_sha: adf68bb202da89de72230b05e73e841e7002bc5b6e519798431659f47d041a54
language: typescript
---
`sdk/core/byte-buf.ts` (lines 1–152)

```typescript
import { BytesBlob } from "./bytes";

/**
 * A lightweight byte-buffer builder that avoids AssemblyScript's String
 * machinery.  Append ASCII strings, raw byte slices, or decimal numbers,
 * then call `finish()` to obtain a managed `Uint8Array`.
 *
 * The buffer is heap-allocated at a fixed capacity; writes that exceed
 * the capacity are silently truncated (same behaviour as LogMsg).
 */
export class ByteBuf {
  private _ptr: usize;
  private _pos: u32;
  private _cap: u32;

  static create(capacity: u32 = 256): ByteBuf {
    return new ByteBuf(heap.alloc(capacity), 0, capacity);
  }

  /** Wrap an existing Uint8Array as a ByteBuf. Writes go directly into the array from the start. */
  static wrap(data: Uint8Array): ByteBuf {
    return new ByteBuf(data.dataStart, 0, <u32>data.length);
  }

  private constructor(ptr: usize, pos: u32, cap: u32) {
    this._ptr = ptr;
    this._pos = pos;
    this._cap = cap;
  }

  /** Number of bytes written so far. */
  get length(): u32 {
    return this._pos;
  }

  /** Raw pointer to the buffer start (for low-level ecalli use). */
  get dataStart(): usize {
    return this._ptr;
  }

  /** Append an ASCII string (1 byte per char, no UTF-8 overhead). */
  strAscii(s: string): ByteBuf {
    const len = <u32>s.length;
    for (let i: u32 = 0; i < len; i++) {
      if (this._pos >= this._cap) break;
      store<u8>(this._ptr + this._pos, <u8>s.charCodeAt(i));
      this._pos++;
    }
    return this;
  }

  /** Append a UTF-8 encoded string. */
  strUtf8(s: string): ByteBuf {
    const buf = String.UTF8.encode(s);
    const len = <u32>buf.byteLength;
    const src = changetype<usize>(buf);
    for (let i: u32 = 0; i < len; i++) {
      if (this._pos >= this._cap) break;
      store<u8>(this._ptr + this._pos, load<u8>(src + i));
      this._pos++;
    }
    return this;
  }

  /** Append raw bytes. */
  bytes(data: Uint8Array): ByteBuf {
    const len = <u32>data.length;
    for (let i: u32 = 0; i < len; i++) {
      if (this._pos >= this._cap) break;
      store<u8>(this._ptr + this._pos, data[i]);
      this._pos++;
    }
    return this;
  }

  /** Append raw bytes as hex with a `0x` prefix. */
  hex(data: Uint8Array): ByteBuf {
    // "0x"
    if (this._pos < this._cap) {
      store<u8>(this._ptr + this._pos, 48); // '0'
      this._pos++;
    }
    if (this._pos < this._cap) {
      store<u8>(this._ptr + this._pos, 120); // 'x'
      this._pos++;
    }
    const len = <u32>data.length;
    for (let i: u32 = 0; i < len; i++) {
      if (this._pos + 1 >= this._cap) break;
      const v = data[i];
      store<u8>(this._ptr + this._pos, nibble(v >>> 4));
      this._pos++;
      store<u8>(this._ptr + this._pos, nibble(v & 0xf));
      this._pos++;
    }
    return this;
  }

  /** Append an unsigned 64-bit number as decimal ASCII. */
  u64(v: u64): ByteBuf {
    if (v === 0) {
      if (this._pos < this._cap) {
        store<u8>(this._ptr + this._pos, 48);
        this._pos++;
      }
      return this;
    }

    let temp = v;
    let digits: u32 = 0;
    while (temp > 0) {
      digits++;
      temp /= 10;
    }

    const end = min(this._pos + digits, this._cap);
    let i = end;
    temp = v;
    while (temp > 0 && i > this._pos) {
      i--;
      store<u8>(this._ptr + i, <u8>(temp % 10) + 48);
      temp /= 10;
    }
    this._pos = end;
    return this;
  }

  /** Append an unsigned 32-bit number as decimal ASCII. */
  u32(v: u32): ByteBuf {
    return this.u64(<u64>v);
  }

  /** Append a signed 32-bit number as decimal ASCII. */
  i32(v: i32): ByteBuf {
    if (v < 0) {
      if (this._pos < this._cap) {
        store<u8>(this._ptr + this._pos, 45); // '-'
        this._pos++;
      }
      return this.u32(<u32>-v);
    }
    return this.u32(<u32>v);
  }

  /** Copy the buffer contents into a new managed Uint8Array. */
  finish(): Uint8Array {
    const out = new Uint8Array(this._pos);
    memory.copy(out.dataStart, this._ptr, this._pos);
    this._pos = 0;
    return out;
  }

```
