---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/CLAUDE.md#L98-L158'
title: CLAUDE.md
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 2
chunk_total: 6
content_sha: a24742bf7f58b48be71a1af56f939cdda5269e4062def6115b19a2cabb7366b4
language: markdown
---
`CLAUDE.md` (lines 98–158)

```markdown
      constants.ts          TTL_SLOTS=1000, RECENT_N=32, CLEANUP_SLOTS_PER_CALL=8 + storage key prefixes
      storage.ts            Key builders (pasteKey/recentKey/expiryKey), PasteEntry codec, writeU32LE/readU32LE
      pastebin.test.ts      Integration tests (refine output, accumulate insert/idempotency/cleanup, solicit→attach→lookup)
docs/                       Documentation (mdbook)
```

## Key Concepts

- **Ecalli**: Host calls exposed by the PVM runtime. Declared as `@external("ecalli", "name")` in AS.
- **PVM adapter**: WAT module that bridges WASM function imports to PVM `host_call_N` instructions.
  - `host_call_N`: N = number of data registers (r7-r12). Returns r7.
  - `host_call_Nb`: Same but also captures r8. Use `host_call_r8()` in same function to read it.
  - `pvm_ptr`: Converts WASM address to PVM address (for pointer arguments).
- **sdk-ecalli-mocks**: JS stubs wired as WASM imports during test. Export names must match `@external` names exactly.
- **EcalliResult**: Sentinel constants (NONE=-1, WHO=-4, FULL=-5, etc.) shared across all host calls.
- **panic(msg)** (`sdk/core/panic.ts`): Use for host-contract violations where recovery is impossible (e.g. host returned malformed data, invalid entry point arguments). Do NOT use for expected failures — use `Result` or `Optional` instead. The SDK does not allow recovering from invalid host data — these are always panics, never `Result`.
- **Self-authorizing services**: A single service can handle both `is_authorized` and `refine` by detecting the invocation context from input length. `is_authorized` receives exactly 2 bytes (u16 core index), `refine` receives 10+ bytes (RefineArgs). Use the SDK helper `isRefineArgs(len)` (from `sdk/jam/service.ts`) for the `index.ts` dispatch: `if (isRefineArgs(len)) return refine_(ptr, len); return is_authorized(ptr, len);`. See `examples/all-ecalli/`, `examples/ecalli-test/`, and `examples/pastebin/`.

### Codec Pattern (sdk/core/codec/ + sdk/jam/)

Domain types are **pure data classes** (no encode/decode methods). Serialization is handled by separate **codec classes** implementing `TryDecode<T>` and `TryEncode<T>`. Codecs with dependencies take them as constructor params. There are **no global codec singletons** — all codec instances live on Context objects.

```ts
// Data class — pure data, private constructor + static create()
export class ImportRef {
  static create(hash: Bytes32, isWorkPackageHash: bool, index: u32): ImportRef { ... }
  private constructor(public hash: Bytes32, ...) {}
}

// Codec class — in same file, after data class. Dependencies via constructor.
export class ImportRefCodec implements TryDecode<ImportRef>, TryEncode<ImportRef> {
  static create(): ImportRefCodec { return new ImportRefCodec(); }
  private constructor() {}
  decode(d: Decoder): Result<ImportRef, DecodeError> { ... }
  encode(value: ImportRef, e: Encoder): void { ... }
}
```

**Composing codecs** — use Decoder/Encoder helpers instead of manual loops:
- `d.sequenceVarLen<T>(codec)` — decode a length-prefixed sequence
- `d.object<T>(codec)` — decode a nested composite type
- `e.sequenceVarLen<T>(codec, values)` — encode a length-prefixed sequence
- `e.object<T>(codec, value)` — encode a nested composite type

### Invocation Contexts (sdk/jam/\*/context.ts)

Contexts group all codec instances + convenience methods for a specific invocation type. They must be created **inside the entry point function** (not at module scope) and named `ctx`:

```ts
export function accumulate(ptr: u32, len: u32): u64 {
  const ctx = AccumulateContext.create();
  const args = ctx.parseArgs(ptr, len);
  const fetcher = ctx.fetcher();       // AccumulateFetcher
  const preimages = ctx.preimages();   // AccumulatePreimages
  const storage = ctx.serviceData();   // CurrentServiceData
  // ... use fetcher, preimages, storage, and ctx ...
  return ctx.respond(result, data);
}
```

All contexts expose `remainingGas(): i64` (ecalli 0) and factory methods for creating
```
