---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/CLAUDE.md#L209-L251'
title: CLAUDE.md
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 4
chunk_total: 6
content_sha: adf7218d4f769fff6b48ea4190af1053bc120ce187917e4705d2a56a7db8f460
language: markdown
---
`CLAUDE.md` (lines 209–251)

```markdown
  └── AccumulatePreimages (composes Preimages, adds ecalli 22-26: query, solicit, forget, provide)
```

- **Preimages** — `lookup(hash, serviceId?)` → `Optional<BytesBlob>`. Available in all contexts.
- **RefinePreimages** — adds `historicalLookup(hash, serviceId?)` → `Optional<BytesBlob>`.
- **AccumulatePreimages** — adds `query(hash, length)` → `Optional<PreimageStatus>`, `solicit(hash, length)` → `ResultN<bool, SolicitError>`, `forget(hash, length)` → `ResultN<bool, ForgetError>`, `provide(preimage, serviceId?)` → `ResultN<bool, ProvideError>`.
- **PreimageStatus** — tagged union modeled as a class with `kind: PreimageStatusKind` + up to 3 `Slot` fields. Static factories: `requested()`, `available(s0)`, `unavailable(s0, s1)`, `reavailable(s0, s1, s2)`.
- `serviceId` defaults to `CURRENT_SERVICE` (from `sdk/jam/types.ts`, value `u32.MAX_VALUE`) on all lookup methods.
- `decodeStatus` decodes query output per GP Appendix B (Ω_Q): r7 low bits = kind, r7 upper 32 = slot0, r8 low 32 = slot1, r8 upper 32 = slot2.

### Accumulate Flow

1. `accumulate(ptr, len)` receives `AccumulateArgs` (slot, serviceId, argsLength)
2. Service calls `fetch(kind=15, index)` for each item (0..argsLength-1)
3. Each item starts with a varint tag: 0=Operand, 1=Transfer
4. Operands contain a `WorkExecResult` — if Ok, the `okBlob` carries the refine output
5. Transfers contain source, destination, amount, memo (128 bytes), gas

## Build & Test

```bash
npm run build    # Build mocks + example (includes wasm-pvm compile)
npm test         # Build mocks + run SDK tests + example tests
```

## Conventions

- SDK files are AssemblyScript (`.ts` with AS-specific types like `u32`, `i64`, `usize`).
- Mock files are standard TypeScript targeting ES2022 (use `number` for u32, `bigint` for i64/u64).
- Each ecalli gets a dedicated SDK declaration file. Tightly-coupled calls share mock files.
- The WAT adapter uses `i64.extend_i32_u` for u32 params and `$pvm_ptr` for pointer-to-memory args.
- Dispatch functions return `Response.with(result, data?)` — never use raw `ptrAndLen` encoding.
- Use `d.varU32()` (not `u32(d.varU64())`) when decoding a varint that must fit in u32 — it validates the range and sets `isError` on overflow.
- Test helpers for configuring mock state from AS go in `sdk/test/test-ecalli/` using `@external("ecalli", ...)` bridging.
- All classes must have private constructors and use static builder methods (e.g. `ClassName.create(...)`) — never expose `new ClassName(...)` to callers.
- **Use `BytesBlob` by default, not raw `Uint8Array`. This is not optional.** Code review rejects `Uint8Array` every time it appears in a public or test-helper API, so stop introducing it.
  - **Function parameters**: if a function accepts bytes, the parameter type is `BytesBlob` (not `Uint8Array`). This includes SDK code, examples, AND test helpers under `sdk/test/`, `sdk/**/*.test.ts`, `examples/**/assembly/**`.
  - **Function returns**: same — return `BytesBlob`. If the returned bytes need to cross into JS (e.g. `writeToMem`), unwrap with `.raw` at the callsite, not inside the helper.
  - **Construction**: `BytesBlob.zero(n)` for zeroed buffers, `BytesBlob.wrap(uint8Array)` when you already have a `Uint8Array` from a lower layer, `BytesBlob.parseBlob("0x...")` in tests.
  - **Ecalli / host-call args**: `BytesBlob.ptr()` and `.length` (both are already `u32` / `i32`).
  - **Decoder input**: `Decoder.fromBytesBlob(blob)`. Never `Decoder.fromBlob(blob.raw)` from a `BytesBlob` — that's the anti-pattern.
  - **Only acceptable `Uint8Array` use**: low-level code doing `load<T>`/`store<T>` on a backing buffer. Comment each such occurrence with justification. Anywhere else (including *test fixtures*) use `BytesBlob`.
- **Use existing codec helpers instead of hand-encoding bytes.** The `Encoder` already has `u8`/`u16`/`u24`/`u32`/`u64`/`varU64`/`bytesFixLen`/`bytesVarLen`. `Decoder` mirrors them. Anti-patterns to avoid:
```
