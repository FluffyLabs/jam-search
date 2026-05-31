---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/docs/src/testing.md#L115-L230'
title: docs/src/testing.md
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 1
chunk_total: 5
content_sha: 591d6a562fda0505bfc3bf89ddbdeb185817d45b95f3fa9103e813dac2b37ee3
language: markdown
---
`docs/src/testing.md` (lines 115–230)

```markdown
// the number of items the service should fetch via `fetch(kind=15, i)` —
// seed each one beforehand with `TestAccumulate.setItem(i, ...)`.
// Returns raw response bytes (since accumulate response shape varies:
// `ctx.respond` for Response, `ctx.yieldHash` for an OptionalCodeHash, etc.).
const result = AccumulateCall.create().withSlot(1).withServiceId(5).call(accumulate, 0);
```

### Building accumulate items

`OperandItem` and `TransferItem` build the encoded `AccumulateItem` blobs
that `TestAccumulate.setItem(i, ...)` expects:

```typescript
import { OperandItem, TestAccumulate, TransferItem } from "@fluffylabs/as-lan/test";

// Operand: defaults all four hashes zeros, gas=100000, result=Ok with empty
// okBlob. Use `withOkBlob` for the common case; `withResultKind(...)` to
// drive Panic / OutOfGas / etc. paths.
TestAccumulate.setItem(0, OperandItem.create().withOkBlob(payload).build());

// Transfer: defaults source=0, dest=0, amount=0, memo=empty (auto-padded to
// 128 bytes by the codec), gas=10000.
TestAccumulate.setItem(1, TransferItem.create().withSource(1).withDest(2).withAmount(100).build());
```

The fibonacci example demonstrates `RefineCall` / `AccumulateCall` with no
items; `pastebin`, `library`, and `ecalli-test` show the operand/transfer
builders driving multi-item flows.

### Comparing byte output

When a test verifies byte-shaped output, build the expected blob and compare
both sides as hex via `Assert.isEqualBytes`. It diffs `actual.toString()` vs
`expected.toString()`, so a failing assertion shows the full hex of both —
debug-friendly even for long blobs.

```typescript
// ✅ One assertion, full hex on failure.
assert.isEqualBytes(actual, BytesBlob.parseBlob("0xdeadbeef").okay!, "data");

// ❌ Don't reach into .raw[i] / Uint8Array indices in assertions —
// when one byte is wrong you only see one byte, not the surrounding context.
assert.isEqual(actual.raw[0], 0xde, "byte 0");
assert.isEqual(actual.raw[1], 0xad, "byte 1");
```

For `Bytes32` values, use `.bytes` (already a `BytesBlob`) instead of
wrapping `.raw` in `BytesBlob.wrap(...)`:

```typescript
assert.isEqualBytes(decoded.codeHash.bytes, expected.codeHash.bytes, "codeHash");
```

When the expected bytes are an encoded structure, build the expected with
`Encoder` so the test verifies the exact wire format:

```typescript
const expected = Encoder.create();
expected.u32(2);
expected.u32(3);
const actual = BytesBlob.wrap(readFromMemory(somePtr, 8));
assert.isEqualBytes(actual, expected.finish(), "two u32s");
```

Length checks (`assert.isEqual(blob.length, 33, ...)`) and numeric-field
checks on decoded structs (`assert.isEqual(decoded.balance, 1000, ...)`) are
not byte comparisons — leave those as-is.

## Configuring Ecalli Mocks

By default the stubs provide sensible test values (e.g. `gas()` returns
`1_000_000`, `lookup()` returns `"test-preimage"`, `read()`/`write()` use an
in-memory Map). You can override these from within your AS test code.

### TestGas

Set the value returned by the `gas()` ecalli:

```typescript
import { TestGas } from "@fluffylabs/as-lan/test";

TestGas.set(500);  // gas() will now return 500
```

### TestFetch

Set fixed data returned by the `fetch()` ecalli (overrides the default
kind-dependent pattern):

```typescript
import { TestFetch } from "@fluffylabs/as-lan/test";

const data = new Uint8Array(4);
data[0] = 0xde; data[1] = 0xad; data[2] = 0xbe; data[3] = 0xef;
TestFetch.setData(data);
```

### TestLookup

Set the preimage returned by the `lookup()` ecalli:

```typescript
import { TestLookup } from "@fluffylabs/as-lan/test";

const preimage = new Uint8Array(3);
preimage[0] = 1; preimage[1] = 2; preimage[2] = 3;
TestLookup.setPreimage(preimage);

// Make lookup return NONE (preimage not found)
TestLookup.setNone();
```

#### Simulating extrinsic-driven preimage delivery

In production, preimages arrive out-of-band via the `xtpreimages` block
extrinsic and CE 142 gossip — a service that only calls `solicit()` (never
```
