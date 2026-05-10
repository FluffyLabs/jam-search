---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/docs/src/testing.md#L464-L576'
title: docs/src/testing.md
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 4
chunk_total: 5
content_sha: aefdad810e9e28b51fc932c9e4b49a50fcaa8fba470d8d9712e79d9b01f1d4d5
language: markdown
---
`docs/src/testing.md` (lines 464–576)

```markdown
`sdk-ecalli-mocks/src/` (grouped by ecalli module: `general/`, `refine/`,
`accumulate/`). The function is called from WASM via `@external`, so it
**must take integer pointers**, not Uint8Arrays:

```typescript
// sdk-ecalli-mocks/src/general/lookup.ts
import { readBytes, writeToMem } from "../memory.js";

const attached: Map<string, Uint8Array> = new Map();

/**
 * Simulate a preimage arriving via the `xtpreimages` extrinsic.
 */
export function setPreimageAttached(
  hash_ptr: number,
  preimage_ptr: number,
  preimage_len: number,
): void {
  const hashBytes = readBytes(hash_ptr, 32);
  if (hashBytes.length !== 32) throw new Error("setPreimageAttached: hash must be 32 bytes");
  const preimage = readBytes(preimage_ptr, preimage_len);
  attached.set(toHex(hashBytes), preimage);
}

// Hook into the existing reset function so TestEcalli.reset() clears it:
export function resetLookup(): void {
  // ... existing resets ...
  attached.clear();
}
```

Key rules:
- **Pointers, not Uint8Arrays.** WASM imports pass integer offsets into
  WASM memory. Use `readBytes(ptr, len)` to materialize a `Uint8Array`.
- **Validate lengths.** Throw on wrong-sized inputs — this is a test
  helper, loud failures are a feature.
- **Hook into reset.** Extend the module's `resetXxx()` function so
  `TestEcalli.reset()` clears the new state automatically.

### Layer 2 — JS barrel re-exports

Expose the function at the package root so WASM imports can find it by
name. Add it to BOTH the sub-barrel (`general/index.ts`, `accumulate/index.ts`,
or `refine/index.ts`) AND the top-level `src/index.ts`:

```typescript
// sdk-ecalli-mocks/src/general/index.ts
export {
  lookup, setLookupPreimage, setLookupNone, resetLookup,
  setPreimageAttached, clearPreimageAttachments,
} from "./lookup.js";

// sdk-ecalli-mocks/src/index.ts
export {
  lookup, setLookupPreimage, setLookupNone,
  setPreimageAttached, clearPreimageAttachments,
} from "./general/index.js";
```

The top-level re-export is what satisfies the WASM imports — the name must
match exactly what you declare as `@external("ecalli", "<name>")` on the
AS side.

### Layer 3 — AS-side wrapper

Add an `@external` declaration and a static wrapper class in
`sdk/test/test-ecalli/` (usually alongside the stub of the ecalli it
augments — `lookup.ts` for lookup-related helpers, `preimages.ts` for
accumulate preimage stubs, etc.):

```typescript
// sdk/test/test-ecalli/lookup.ts
import { Bytes32, BytesBlob } from "../../core/bytes";

// @ts-expect-error: decorator
@external("ecalli", "setPreimageAttached")
declare function _setPreimageAttached(
  hash_ptr: u32,
  preimage_ptr: u32,
  preimage_len: u32,
): void;

export class TestLookup {
  /**
   * Simulate a preimage arriving via the `xtpreimages` block extrinsic.
   */
  static setAttachedPreimage(hash: Bytes32, preimage: BytesBlob): void {
    _setPreimageAttached(hash.ptr(), preimage.ptr(), preimage.length);
  }
}
```

Key rules:
- **Static class + static methods.** Matches the style of every other
  `Test*` helper (`TestGas`, `TestFetch`, `TestStorage`, ...).
- **Ergonomic AS types in, pointers to WASM out.** Accept `Bytes32` /
  `BytesBlob` and pass `.ptr()` + `.length` to the `@external` binding.
- **Place where it conceptually belongs.** If the helper configures the
  `lookup()` mock, put it on `TestLookup`, not `TestPreimages` — even if
  the underlying JS state lives elsewhere.

### Layer 4 — documentation

Document the new helper in the relevant `Test*` subsection of this file
above. If it captures a production-only mechanism (extrinsic delivery,
gossip, etc.), explain the mechanism in a short paragraph so future
readers understand what path the mock is emulating.

### End-to-end example

The `TestLookup.setAttachedPreimage` helper exercises this whole pattern;
search `git log --all -- sdk-ecalli-mocks/src/general/lookup.ts` for the
commit that introduced it as a minimal reference.
```
