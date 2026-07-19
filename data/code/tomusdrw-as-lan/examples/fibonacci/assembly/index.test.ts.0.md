---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/fibonacci/assembly/index.test.ts#L1-L47
title: examples/fibonacci/assembly/index.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 1
content_sha: af4bb29af1f9d5f91cb66faa7a28d24591e74e3b941777d4cb2768d604d1a141
language: typescript
---
`examples/fibonacci/assembly/index.test.ts` (lines 1–47)

```typescript
import { Bytes32, BytesBlob } from "@fluffylabs/as-lan";
import { AccumulateCall, Assert, RefineCall, Test, test } from "@fluffylabs/as-lan/test";
import { accumulate, refine } from "./fibonacci";

/** Build the expected `Some(CodeHash)` blob (1-byte tag + u64 LE in first 8 bytes of 32-byte hash). */
function expectedFibResult(fib: u64): BytesBlob {
  const hash = Bytes32.zero();
  for (let i = 0; i < 8; i++) hash.raw[i] = u8((fib >> (i * 8)) & 0xff);
  const buf = BytesBlob.zero(33);
  buf.raw[0] = 1; // Some tag
  buf.raw.set(hash.raw, 1);
  return buf;
}

export const TESTS: Test[] = [
  test("refine echoes payload", () => {
    const payload = BytesBlob.parseBlob("0xdeadbeef").okay!;
    const resp = RefineCall.create().call(refine, payload);
    const assert = Assert.create();
    assert.isEqualBytes(resp.data, payload, "refine output");
    return assert;
  }),
  test("refine with empty payload", () => {
    const resp = RefineCall.create().withCoreIndex(1).withServiceId(10).call(refine, BytesBlob.empty());
    const assert = Assert.create();
    assert.isEqualBytes(resp.data, BytesBlob.empty(), "empty refine output");
    return assert;
  }),
  test("accumulate default fib(10) = 55", () => {
    const result = AccumulateCall.create().withSlot(7).withServiceId(9).call(accumulate, 0);
    const assert = Assert.create();
    assert.isEqualBytes(result, expectedFibResult(55), "fib(10) result");
    return assert;
  }),
  test("accumulate fib(20) = 6765", () => {
    const result = AccumulateCall.create().withSlot(1).withServiceId(5).call(accumulate, 20);
    const assert = Assert.create();
    assert.isEqualBytes(result, expectedFibResult(6765), "fib(20) result");
    return assert;
  }),
  test("accumulate fib(1) = 1", () => {
    const result = AccumulateCall.create().withSlot(0).withServiceId(1).call(accumulate, 1);
    const assert = Assert.create();
    assert.isEqualBytes(result, expectedFibResult(1), "fib(1) result");
    return assert;
  }),
];
```
