---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/docs/src/sdk-api/utilities.md#L1-L104
title: docs/src/sdk-api/utilities.md
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 0
chunk_total: 2
content_sha: d6c33645a187c6152e8790e04b490b1b1220540a672860ff952cc6c31869eb00
language: markdown
---
`docs/src/sdk-api/utilities.md` (lines 1–104)

```markdown
# Utilities

## Logger

JIP-1 structured logger. Methods: `fatal`, `warn`, `info`, `debug`, `trace`.

`debug` and `trace` are compiled out at optimization level 3 (release builds).

```typescript
import { Logger } from "@fluffylabs/as-lan";

const logger = Logger.create("my-service");
logger.info("processing work item");
logger.debug(`payload length: ${payload.length}`);
```

> **Binary size note:** `Logger` accepts `string` messages, so using template literals
> (`` `value: ${n}` ``) pulls in AssemblyScript's string concatenation, UTF-8 encoding,
> and number-to-string machinery. This can add ~1.3 KiB to the WASM output.
> If binary size is a concern, use `LogMsg` instead (see below).

## LogMsg (lightweight logger)

A buffer-based logger that writes directly to a fixed-size byte buffer,
bypassing AssemblyScript's `String` machinery entirely. It uses a builder
pattern to append text and numbers, then sends the raw bytes to the host.

Using `LogMsg` instead of `Logger` can reduce WASM output by 5KB and PVM
output by 8KB for a typical service. Note that for large services the
trade-off between code size and readability & debuggability might not be worth it.

```typescript
import { LogMsg } from "@fluffylabs/as-lan";

const logger = LogMsg.create("my-service");
logger.str("processing item ").u32(itemId).info();
logger.str("result: ").u64(value).str(" bytes").debug();
```

Builder methods (all return `LogMsg` for chaining):
- **`.str(s)`** — append an ASCII string
- **`.u32(v)`** — append an unsigned 32-bit number as decimal
- **`.u64(v)`** — append an unsigned 64-bit number as decimal
- **`.i32(v)`** — append a signed 32-bit number as decimal
- **`.blob(data)`** — append a `BytesBlob` as `0x`-prefixed hex (no String allocation)

Terminal methods (send the message and reset the buffer):
- **`.fatal()`**, **`.warn()`**, **`.info()`**, **`.debug()`**, **`.trace()`**

`debug` and `trace` are compiled out at optimization level 3, same as `Logger`.

## ByteBuf (byte-buffer builder)

A lightweight `Uint8Array` builder that avoids String allocations. Used
internally by `LogMsg` and useful for constructing binary output (e.g. auth
traces) from string fragments and raw byte slices.

```typescript
import { ByteBuf, ptrAndLen } from "@fluffylabs/as-lan";

const result = ByteBuf.create(64)
  .strAscii("Auth=<")
  .bytes(token.raw)
  .strAscii(">")
  .finish();           // → Uint8Array
return ptrAndLen(result);
```

Static constructors:
- **`ByteBuf.create(capacity)`** — allocate a new buffer with given capacity (default 256)
- **`ByteBuf.wrap(data)`** — wrap an existing `Uint8Array`; writes go directly into the array

Builder methods (all return `ByteBuf` for chaining):
- **`.strAscii(s)`** — append an ASCII string (1 byte per char, no UTF-8 overhead)
- **`.strUtf8(s)`** — append a UTF-8 encoded string
- **`.bytes(data)`** — append raw `Uint8Array`
- **`.hex(data)`** — append `Uint8Array` as `0x`-prefixed hex
- **`.u32(v)`**, **`.u64(v)`**, **`.i32(v)`** — append numbers as decimal ASCII

Terminal methods:
- **`.finish()`** — copy buffer into a new `Uint8Array` and reset
- **`.finishBlob()`** — copy buffer into a new `BytesBlob` and reset
- **`.reset()`** — discard contents without producing output

The buffer is heap-allocated at a fixed capacity; writes beyond the capacity
are silently truncated.

> **Binary size tip:** Prefer `.strAscii()` over `.strUtf8()` for ASCII strings
> (log targets, storage keys, etc.). `.strUtf8()` pulls in the full UTF-8 machinery
> (~520 B WASM / ~1.15 KB PVM). See [Coding Guidelines](../../CODING_GUIDELINES.md).

## Decoder

Binary protocol decoder for reading host-provided data.

```typescript
import { Decoder } from "@fluffylabs/as-lan";

const decoder = Decoder.fromBlob(data);
const value = decoder.varU64();
const hash = decoder.bytes32();
const blob = decoder.bytesVarLen();
```

```
