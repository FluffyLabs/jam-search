---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/CLAUDE.md#L251-L257'
title: CLAUDE.md
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 5
chunk_total: 6
content_sha: 7f93b188d73a457a72372205f449cf6dbcc8e39d69b5712fe84fc8a825f7e56b
language: markdown
---
`CLAUDE.md` (lines 251–257)

```markdown
- **Use existing codec helpers instead of hand-encoding bytes.** The `Encoder` already has `u8`/`u16`/`u24`/`u32`/`u64`/`varU64`/`bytesFixLen`/`bytesVarLen`. `Decoder` mirrors them. Anti-patterns to avoid:
  - `e.u8(v & 0xff); e.u8((v >> 8) & 0xff); e.u8((v >> 16) & 0xff)` — use `e.u24(v)`.
  - `for (let i = 0; i < arr.length; i++) e.u8(arr[i])` — use `e.bytesFixLen(BytesBlob.wrap(arr))`.
  - `e.varU64(u64(blob.length)); for (…) e.u8(blob.raw[i])` — use `e.bytesVarLen(blob)`.
  If an LE-width helper you need doesn't exist yet, add it to the `Encoder`/`Decoder` (with a test). Don't hand-roll it at the callsite.
- **Always update `docs/src/` when adding or modifying SDK features.** Update `sdk-api.md` for new public API, `testing.md` for new mock helpers. Keep docs in sync with code.
- **Prefer `ByteBuf.strAscii()` / `BytesBlob.encodeAscii()` over `String.UTF8.encode`** for ASCII strings (log targets, storage keys, etc.). It avoids pulling in the full UTF-8 machinery (~520 B WASM / ~1.15 KB PVM). Use `ByteBuf.strUtf8()` / `BytesBlob.encodeUtf8()` when full UTF-8 is needed. Exception: `Logger` keeps `String.UTF8.encode` because code using `Logger` already pulls in string machinery via template literals — switching Logger has zero size benefit and causes AS compiler code-generation issues.
```
