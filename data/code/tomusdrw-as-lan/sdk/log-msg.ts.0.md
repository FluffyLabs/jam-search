---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/log-msg.ts#L1-L98'
title: sdk/log-msg.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 4585d382f0ae3e66e191178e7dadf77103b77eef2460c209c127bbf285ea4066
language: typescript
---
`sdk/log-msg.ts` (lines 1–98)

```typescript
import { ByteBuf } from "./core/byte-buf";
import { BytesBlob } from "./core/bytes";
import { log } from "./ecalli";
import { LogLevel } from "./logger";

// @ts-expect-error: ASC_OPTIMIZE_LEVEL is an AssemblyScript compile-time constant
const DEBUG_LOGGING: bool = ASC_OPTIMIZE_LEVEL < 3;

/**
 * A lightweight logger that writes directly to a fixed-size byte buffer,
 * avoiding AssemblyScript's String machinery (concat, UTF8.encode, toString).
 *
 * Usage:
 *   const log = LogMsg.create("target");
 *   log.str("count: ").u64(42).info();
 */
export class LogMsg {
  private _targetPtr: usize;
  private _targetLen: u32;
  private _buf: ByteBuf;

  static create(target: string): LogMsg {
    return new LogMsg(target);
  }

  private constructor(target: string) {
    this._buf = ByteBuf.create(256);

    // Encode target as ASCII bytes into raw memory
    const tLen = <u32>target.length;
    this._targetPtr = heap.alloc(tLen);
    for (let i: u32 = 0; i < tLen; i++) {
      store<u8>(this._targetPtr + i, <u8>target.charCodeAt(i));
    }
    this._targetLen = tLen;
  }

  /** Append an ASCII string to the buffer. */
  str(s: string): LogMsg {
    this._buf.strAscii(s);
    return this;
  }

  /** Append an unsigned 64-bit number as decimal. */
  u64(v: u64): LogMsg {
    this._buf.u64(v);
    return this;
  }

  /** Append an unsigned 32-bit number as decimal. */
  u32(v: u32): LogMsg {
    this._buf.u32(v);
    return this;
  }

  /** Append a signed 32-bit number as decimal. */
  i32(v: i32): LogMsg {
    this._buf.i32(v);
    return this;
  }

  /** Append raw bytes as `0x`-prefixed hex. */
  blob(data: BytesBlob): LogMsg {
    this._buf.hex(data.raw);
    return this;
  }

  fatal(): void {
    this._send(LogLevel.Fatal);
  }
  warn(): void {
    this._send(LogLevel.Warning);
  }
  info(): void {
    this._send(LogLevel.Important);
  }

  debug(): void {
    if (DEBUG_LOGGING) {
      this._send(LogLevel.Helpful);
    } else {
      this._buf.reset();
    }
  }

  trace(): void {
    if (DEBUG_LOGGING) {
      this._send(LogLevel.Pedantic);
    } else {
      this._buf.reset();
    }
  }

  private _send(level: LogLevel): void {
    log(<u32>level, <u32>this._targetPtr, this._targetLen, <u32>this._buf.dataStart, this._buf.length);
    this._buf.reset();
  }
}
```
