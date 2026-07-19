---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/CLAUDE.md#L254-L273'
title: CLAUDE.md
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 5
chunk_total: 6
content_sha: 0499479913efd756a9992a5dfcaad223827188bd2f3e4905fb75400dd80b6b04
language: markdown
---
`CLAUDE.md` (lines 254–273)

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
- **Compare bytes via `Assert.isEqualBytes`, not byte-by-byte.** When verifying byte-shaped output, build the expected blob (`BytesBlob.parseBlob("0x...").okay!`, `Encoder.create()...finish()`, or `Bytes32.zero()` etc.) and call `assert.isEqualBytes(actual, expected, msg)` — it diffs the two `.toString()` hex representations. Anti-patterns to avoid in tests (the failure messages from these are useless when the test fails):
  - `assert.isEqual(blob.raw[i], v, "byte i")` — write the expected blob and use `isEqualBytes`.
  - `for (let i = 0; i < n; i++) assert.isEqual(actual[i], expected[i], ...)` — same; one `isEqualBytes` call.
  - `load<u8>(ptr + N)` for poking at host-received memory — wrap with `BytesBlob.wrap(readFromMemory(ptr, len))` and `isEqualBytes`.
  - `BytesBlob.wrap(bytes32.raw)` to feed `isEqualBytes` — use `bytes32.bytes` (already a `BytesBlob`).
  Length checks (`assert.isEqual(blob.length, N)`) and numeric field checks (`assert.isEqual(decoded.balance, 1000)`) stay as-is — those aren't byte-shape comparisons.
- **`TestAccumulate.setItem(i, blob)` accepts `BytesBlob`.** Use `OperandItem.create().withOkBlob(...).build()` or `TransferItem.create().with*().build()` from `@fluffylabs/as-lan/test`; both return `BytesBlob`. Don't hand-roll `Operand.create(...)` + `AccumulateContext.create().accumulateItem.encode(...)` at test sites.
- **Always update `docs/src/` when adding or modifying SDK features.** Update `sdk-api.md` for new public API, `testing.md` for new mock helpers. Keep docs in sync with code.
- **Prefer `ByteBuf.strAscii()` / `BytesBlob.encodeAscii()` over `String.UTF8.encode`** for ASCII strings (log targets, storage keys, etc.). It avoids pulling in the full UTF-8 machinery (~520 B WASM / ~1.15 KB PVM). Use `ByteBuf.strUtf8()` / `BytesBlob.encodeUtf8()` when full UTF-8 is needed. Exception: `Logger` keeps `String.UTF8.encode` because code using `Logger` already pulls in string machinery via template literals — switching Logger has zero size benefit and causes AS compiler code-generation issues.
```
