---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/docs/src/testing.md#L345-L468'
title: docs/src/testing.md
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 3
chunk_total: 5
content_sha: b296c2a7903fe3c364092d70c5537288a85f196310fea51092a3cc60de5d9870
language: markdown
---
`docs/src/testing.md` (lines 345–468)

```markdown
// Pre-populate a key
const key = BytesBlob.encodeAscii("counter");
const value = BytesBlob.wrap(new Uint8Array(8));
TestStorage.set(key, value);

// Delete a key
TestStorage.set(key, null);
```

### TestPrivileged

Configure the return values of privileged governance ecallis (bless, assign, designate):

```typescript
import { TestPrivileged } from "@fluffylabs/as-lan/test";
import { EcalliResult } from "@fluffylabs/as-lan";

TestPrivileged.setBlessResult(EcalliResult.WHO);
TestPrivileged.setAssignResult(EcalliResult.CORE);
TestPrivileged.setDesignateResult(EcalliResult.HUH);
```

### TestServices

Configure the return values of service lifecycle ecallis (new_service, eject):

```typescript
import { TestServices } from "@fluffylabs/as-lan/test";
import { EcalliResult } from "@fluffylabs/as-lan";

TestServices.setNewServiceResult(EcalliResult.CASH);
TestServices.setEjectResult(EcalliResult.WHO);
```

By default, `new_service()` returns auto-incrementing service IDs (256, 257, ...).
Setting a result overrides this behavior until reset.

### TestTransfer

Configure the return value of the `transfer()` ecalli:

```typescript
import { TestTransfer } from "@fluffylabs/as-lan/test";
import { EcalliResult } from "@fluffylabs/as-lan";

TestTransfer.setTransferResult(EcalliResult.CASH);
```

### TestEcalli

Reset all configuration to defaults and clear storage:

```typescript
import { TestEcalli } from "@fluffylabs/as-lan/test";

TestEcalli.reset();
```

## Default Stub Behavior

**General (0-5, 100):**

| Ecalli | Default |
|--------|---------|
| `gas()` | Returns `1_000_000` |
| `fetch()` | Writes a 16-byte kind-dependent pattern, returns `16` |
| `lookup()` | Writes `"test-preimage"` (13 bytes), returns `13` |
| `read()` | Reads from in-memory Map; returns `NONE` (`-1`) if key missing |
| `write()` | Writes to in-memory Map; returns previous value length or `NONE` |
| `info()` | Returns a 96-byte structure (code\_hash=`0xAA...`, balance=`1000`) |
| `log()` | Prints `[LEVEL] target: message` to console |

**Refine (6-13):**

| Ecalli | Default |
|--------|---------|
| `historical_lookup()` | Writes `"test-historical"` (15 bytes), returns `15` |
| `export_segment()` | Returns incrementing segment index (0, 1, 2, ...) |
| `machine()` | Returns incrementing machine ID (0, 1, 2, ...) |
| `peek()` | Returns `OK` (0) |
| `poke()` | Returns `OK` (0) |
| `pages()` | Returns `OK` (0) |
| `invoke()` | Returns `HALT` (0), writes `r8 = 0` |
| `expunge()` | Returns `OK` (0) |

**Accumulate (14-26):**

| Ecalli | Default |
|--------|---------|
| `bless()` | Returns `OK` (0) |
| `assign()` | Returns `OK` (0) |
| `designate()` | Returns `OK` (0) |
| `checkpoint()` | Returns remaining gas (delegates to `gas()` mock) |
| `new_service()` | Returns incrementing service ID (256, 257, ...) |
| `upgrade()` | Returns `OK` (0) |
| `transfer()` | Returns `OK` (0) |
| `eject()` | Returns `OK` (0) |
| `query()` | Returns `NONE` (-1), writes `r8 = 0` |
| `solicit()` | Returns `OK` (0) |
| `forget()` | Returns `OK` (0) |
| `yield_result()` | Returns `OK` (0) |
| `provide()` | Returns `OK` (0) |


See the [fibonacci](https://github.com/tomusdrw/as-lan/tree/main/examples/fibonacci)
and [ecalli-test](https://github.com/tomusdrw/as-lan/tree/main/examples/ecalli-test)
examples for usage examples.

## Authoring new test helpers

Sometimes a test needs to reach past the stub ecalli surface — for example,
to simulate a block extrinsic (like `TestLookup.setAttachedPreimage`), seed
state that's not reachable via any host call, or configure mock behavior
that spans multiple ecallis. The pattern used across this repo has four
layers.

### Layer 1 — JS-side mock state

Add the state and the mutator function to the relevant file under
`sdk-ecalli-mocks/src/` (grouped by ecalli module: `general/`, `refine/`,
`accumulate/`). The function is called from WASM via `@external`, so it
**must take integer pointers**, not Uint8Arrays:

```typescript
```
