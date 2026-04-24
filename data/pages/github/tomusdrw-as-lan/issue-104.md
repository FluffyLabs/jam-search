---
type: page
url: 'https://github.com/tomusdrw/as-lan/issues/104'
title: 'sdk: unify ServiceData.read/write to use BytesBlob for keys and values'
site: github.com/tomusdrw/as-lan
created_at: '2026-04-20T15:30:45.000Z'
last_modified: '2026-04-20T15:30:45.000Z'
content_kind: issue
---

# sdk: unify ServiceData.read/write to use BytesBlob for keys and values

## Issue by @tomusdrw

## Background

PR #102 changed `CurrentServiceData.write(key, value)` to take `value: BytesBlob`, matching the SDK-wide [coding guideline](../blob/main/CLAUDE.md) that says:

> Use `BytesBlob` by default, not raw `Uint8Array`.

That PR deliberately scoped the change narrowly — only the `value` parameter on `write`. The `key` parameter on both `read` and `write`, and the `Uint8Array` that `read` returns, still break the convention.

## Current signatures

```ts
class ServiceData {
  read(key: Uint8Array): Optional<Uint8Array>
}

class CurrentServiceData extends ServiceData {
  write(key: Uint8Array, value: BytesBlob): Result<OptionalN<u64>, WriteError>
}
```

Mixed `Uint8Array` / `BytesBlob` in one method signature is an open wart.

## Proposed signatures

```ts
class ServiceData {
  read(key: BytesBlob): Optional<BytesBlob>
}

class CurrentServiceData extends ServiceData {
  write(key: BytesBlob, value: BytesBlob): Result<OptionalN<u64>, WriteError>
}
```

Internals use `key.ptr()` / `key.length` and wrap the internal read buffer with `BytesBlob.wrap(buf)` before returning.

## Call sites to migrate

At the time of writing (verify with a fresh grep when tackling this):

- `sdk/jam/account-info.test.ts` — several `read(key)` / `write(key, ...)` calls using `ByteBuf...finish()` keys; will need either `BytesBlob.wrap(ByteBuf...finish())` or a `ByteBuf.finishBlob()` helper.
- `examples/library/assembly/refine.ts` — `storage.read(libraryKeyFromBlob(name))` call.
- `examples/library/assembly/accumulate.ts` — `ctx.serviceData().write(libraryKeyFromBlob(cmd.name!), ...)` calls.
- `examples/library/assembly/accumulate.test.ts` — `read(libraryKey(\"...\"))` calls.
- `examples/library/assembly/storage.ts` — `libraryKey(name: string): Uint8Array` and `libraryKeyFromBlob(name: BytesBlob): Uint8Array` should both return `BytesBlob` and the internal byte-concat can live behind `BytesBlob.wrap`.
- Any other consumers surfaced by `rg '\\.(read|write)\\(' --type ts`.

## Knock-on changes worth considering

- **`ByteBuf.finish()`** currently returns `Uint8Array`. A parallel `finishBlob(): BytesBlob` helper (or swapping the default) would keep call sites tidy.
- **`libraryKey*` helpers in the library example** become trivially `BytesBlob`-producing, dropping the `*FromBlob` variant.

## Non-goals

- Lower-level `write/read` ecalli wrappers in `sdk/ecalli/general/` — those stay `(ptr, len)` as the ecalli ABI is raw.
- Any other SDK method's `Uint8Array` parameters — this issue is scoped to `ServiceData` / `CurrentServiceData`.

## Verification

- `npm run qa` clean
- `npm test` green
- No new `Uint8Array` typed arguments or returns in `ServiceData` / `CurrentServiceData` public API


## Comment by @coderabbitai[bot]

<!-- This is an auto-generated issue plan by CodeRabbit -->
<details>
<summary>🔗 Related PRs</summary>

tomusdrw/as-lan#79 - Add panic, ServiceData wrapper, and simplify fetch API [merged]
tomusdrw/as-lan#81 - Add example authorizer service and ByteBuf builder [merged]
tomusdrw/as-lan#83 - Rename fetch kinds and drop AuthorizerInfo [merged]
tomusdrw/as-lan#86 - Add ASCII/UTF-8 encoding to ByteBuf and BytesBlob [merged]
tomusdrw/as-lan#91 - Add high-level Preimages abstraction [merged]
</details>

---
<details>
<summary>📝 Issue Planner</summary>

<sub>Check the box below or use the `@coderabbitai plan` command to generate an implementation plan and prompts that you can use with your favorite coding assistant.</sub>

- [ ] <!-- {"checkboxId": "8d4f2b9c-3e1a-4f7c-a9b2-d5e8f1c4a7b9"} --> Create Plan
</details>


---
<details>
<summary> 🧪 Issue enrichment is currently in open beta.</summary>


To disable automatic issue enrichment, add the following to your `.coderabbit.yaml`:
```yaml
issue_enrichment:
  auto_enrich:
    enabled: false
```
</details>

💬 Have feedback or questions? Drop into our [discord](https://discord.gg/coderabbit)!
