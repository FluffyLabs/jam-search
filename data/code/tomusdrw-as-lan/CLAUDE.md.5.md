---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/CLAUDE.md#L253-L265'
title: CLAUDE.md
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 5
chunk_total: 6
content_sha: a46343d80e0970dff2863dd58cc39c5ecfbeba857d20913a31fbc370cf9e315b
language: markdown
---
`CLAUDE.md` (lines 253–265)

```markdown
  - **Function parameters**: if a function accepts bytes, the parameter type is `BytesBlob` (not `Uint8Array`). This includes SDK code, examples, AND test helpers under `sdk/test/`, `sdk/**/*.test.ts`, `examples/**/assembly/**`.
  - **Function returns**: same — return `BytesBlob`. If the returned bytes need to cross into JS (e.g. `writeToMem`), unwrap with `.raw` at the callsite, not inside the helper.
  - **Construction**: `BytesBlob.zero(n)` for zeroed buffers, `BytesBlob.wrap(uint8Array)` when you already have a `Uint8Array` from a lower layer, `BytesBlob.parseBlob("0x...")` in tests.
  - **Ecalli / host-call args**: `BytesBlob.ptr()` and `.length` (both are already `u32` / `i32`).
  - **Decoder input**: `Decoder.fromBytesBlob(blob)`. Never `Decoder.fromBlob(blob.raw)` from a `BytesBlob` — that's the anti-pattern.
  - **Only acceptable `Uint8Array` use**: low-level code doing `load<T>`/`store<T>` on a backing buffer. Comment each such occurrence with justification. Anywhere else (including *test fixtures*) use `BytesBlob`.
- **Use existing codec helpers instead of hand-encoding bytes.** The `Encoder` already has `u8`/`u16`/`u24`/`u32`/`u64`/`varU64`/`bytesFixLen`/`bytesVarLen`. `Decoder` mirrors them. Anti-patterns to avoid:
  - `e.u8(v & 0xff); e.u8((v >> 8) & 0xff); e.u8((v >> 16) & 0xff)` — use `e.u24(v)`.
  - `for (let i = 0; i < arr.length; i++) e.u8(arr[i])` — use `e.bytesFixLen(BytesBlob.wrap(arr))`.
  - `e.varU64(u64(blob.length)); for (…) e.u8(blob.raw[i])` — use `e.bytesVarLen(blob)`.
  If an LE-width helper you need doesn't exist yet, add it to the `Encoder`/`Decoder` (with a test). Don't hand-roll it at the callsite.
- **Always update `docs/src/` when adding or modifying SDK features.** Update `sdk-api.md` for new public API, `testing.md` for new mock helpers. Keep docs in sync with code.
- **Prefer `ByteBuf.strAscii()` / `BytesBlob.encodeAscii()` over `String.UTF8.encode`** for ASCII strings (log targets, storage keys, etc.). It avoids pulling in the full UTF-8 machinery (~520 B WASM / ~1.15 KB PVM). Use `ByteBuf.strUtf8()` / `BytesBlob.encodeUtf8()` when full UTF-8 is needed. Exception: `Logger` keeps `String.UTF8.encode` because code using `Logger` already pulls in string machinery via template literals — switching Logger has zero size benefit and causes AS compiler code-generation issues.
```
