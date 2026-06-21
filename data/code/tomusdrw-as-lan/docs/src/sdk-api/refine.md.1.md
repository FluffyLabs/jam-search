---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/docs/src/sdk-api/refine.md#L117-L208
title: docs/src/sdk-api/refine.md
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 09217da07dabc7c12196962e64a791f66b6321aded637b266dbf9ae1100a4159
language: markdown
---
`docs/src/sdk-api/refine.md` (lines 117–208)

```markdown
- **`Machine.create(code, entrypoint)`** — Create inner PVM. Returns `ResultN<Machine, InvalidEntryPoint>`.
- **`machine.peek(source, dest)`** — Read from inner machine memory. Returns `ResultN<bool, OutOfBounds>`.
- **`machine.poke(dest, data)`** — Write to inner machine memory. Returns `ResultN<bool, OutOfBounds>`.
- **`machine.pages(startPage, pageCount, access)`** — Set page access permissions. Panics on invalid state.
- **`machine.invoke(io)`** — Run the machine. Returns `InvokeOutcome` with `.reason`, `.r8`, `.io`.
- **`machine.expunge()`** — Destroy the machine. Returns `i64` result.

### InvokeIo

Typed wrapper for the 112-byte gas+registers I/O structure:

- **`InvokeIo.create(gas)`** — Create with initial gas limit, zeroed registers.
- **`.gas`** — Get/set gas (read limit before invoke, remaining after).
- **`.getRegister(index)`** / **`.setRegister(index, value)`** — Access registers r0-r12.

### ExitReason

`Halt` (0), `Panic` (1), `Fault` (2), `Host` (3), `Oob` (4).

### PageAccess

`Inaccessible` (0), `Read` (1), `ReadWrite` (2).

### Calling convention for library-style inner PVMs

For the common case of invoking a *library* PVM (an inner blob that takes
some input, returns some output, and halts), `examples/library/` uses
`NestedPvm` with SPI-encoded preimages:

**On entry:** `NestedPvm.fromSpi(blob, payload, gas)` sets up the inner
PVM per the SPI memory layout and places the payload in the read-only
args region at `SPI_ARGS_SEGMENT_START` (`0xFEFF_0000`). `r7` / `r8` are
initialised to the args pointer and length respectively — the same
`(ptr, len)` convention every JAM service entry point receives.

**On halt:** the inner PVM places its output anywhere in its memory and
returns a packed `ptrAndLen` in `r7` — low 32 bits = address, high 32 bits
= length, matching the SDK's `ptrAndLen(Uint8Array)` helper. The caller
unpacks `r7`, calls `vm.peek(outAddr, buf)` for `outLen` bytes, then
`vm.expunge()`.

**Why this matters:** writing a library PVM to a different convention means
consumers have to special-case your library. Following this convention lets
authors of ed25519, blake2b, and similar verification primitives all be
invoked identically.

See `examples/library/assembly/refine.ts` for the full reference
implementation (error handling, malformed-blob handling, peek unwind on
failure).

## NestedPvm (SPI-backed inner PVM)

`NestedPvm` is a thin wrapper around the `machine` / `pages` / `poke` /
`invoke` / `expunge` ecallis. It decodes a Standard Program Interface (SPI)
blob, allocates the RO / RW / heap / stack / args regions at their Graypaper
offsets, initialises the registers, and returns an instance ready to drive.

```typescript
import { ExitReason, NestedPvm, RefineContext } from "@fluffylabs/as-lan";

export function refine(ptr: u32, len: u32): u64 {
  const ctx = RefineContext.create();
  const args = ctx.parseArgs(ptr, len);

  const vm = ctx.nestedPvmFromSpi(spiBlob, userArgs, /*gas=*/ 1_000_000);
  for (;;) {
    const reason = vm.invoke();
    if (reason === ExitReason.Halt) break;
    if (reason === ExitReason.Host) {
      const index = vm.getExitArg(); // host-call index
      // ...dispatch, then vm.setRegister(7, result); continue;
    } else if (reason === ExitReason.Fault) {
      panic("page fault at " + vm.getExitArg().toString());
    } else if (reason === ExitReason.Panic) {
      panic("inner PVM trapped");
    } else if (reason === ExitReason.Oob) {
      panic("inner PVM OOB");
    }
  }
  const result = vm.getRegister(7);
  vm.expunge();
  return ctx.respond(0);
}
```

### NestedPvm API

- **`NestedPvm.fromSpi(blob, args, gas)`** — Decode SPI blob, create inner
  PVM, set up memory + registers. **Panics** on malformed blob, args
  exceeding `SPI_MAX_ARGS_LEN`, or invalid entry point. Use this for
  trusted blobs (embedded at build time, produced by the outer runtime).
- **`NestedPvm.fromSpiChecked(blob, args, gas)`** — Same setup, but returns
```
