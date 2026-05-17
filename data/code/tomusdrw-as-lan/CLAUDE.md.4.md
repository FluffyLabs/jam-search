---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/CLAUDE.md#L210-L255'
title: CLAUDE.md
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 4
chunk_total: 6
content_sha: d2b15a5c4d7c5f5e591b685dbccf3edcc79bcd1ca051f3746e854c223ac5e8a3
language: markdown
---
`CLAUDE.md` (lines 210–255)

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

## Releases

`@fluffylabs/as-lan` (from `sdk/`) and `@fluffylabs/as-lan-ecalli-mocks` (from `sdk-ecalli-mocks/`) publish to npm with a shared version. The root `package.json` is `@fluffylabs/as-lan-workspace` (private) and carries the same version as a consistency sentinel.

**Never hand-bump versions.** Use the `Release: Prepare` GitHub Actions workflow — it bumps all three `package.json` files, opens a release PR, and creates a draft GitHub release. Publishing that release triggers `Release: Publish`, which asserts version consistency and publishes both packages. See `README.md` → *Releases* for the full flow.

`pvm-adapter.wat` lives at repo root for local dev; a `prepack`/`postpack` hook in `sdk/package.json` copies it into the tarball at publish time.

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
```
