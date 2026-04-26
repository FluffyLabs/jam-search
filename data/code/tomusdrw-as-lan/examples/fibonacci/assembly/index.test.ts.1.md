---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/fibonacci/assembly/index.test.ts#L115-L146
title: examples/fibonacci/assembly/index.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 1
chunk_total: 2
content_sha: e9dc96035fb58e2dbff893d30bb52dd122e4c37486c34539f1ac53ebf274b28a
language: typescript
---
`examples/fibonacci/assembly/index.test.ts` (lines 115–146)

```typescript
    const out: u8[] = [];
    const zeros32 = fromHex("0x0000000000000000000000000000000000000000000000000000000000000000");

    pushVarU64(out, 1); // coreIndex
    pushVarU64(out, 0); // itemIndex
    pushVarU64(out, 10); // serviceId
    pushBytesVarLen(out, BytesBlob.empty().raw); // empty payload
    pushBytes(out, zeros32); // workPackageHash

    const result = callWithArgs(refine, toBytes(out));
    const assert = Assert.create();
    assert.isEqual(result.length, 0, "empty refine output");
    return assert;
  }),
  test("accumulate fib(1) = 1", () => {
    const out: u8[] = [];

    pushVarU64(out, 0); // slot
    pushVarU64(out, 1); // serviceId
    pushVarU64(out, 1); // argsLength=1 means n=1

    const result = callWithArgs(accumulate, toBytes(out));
    const assert = Assert.create();
    assert.isEqual(result.length, 33, "result length");
    assert.isEqual(result[0], 1, "some tag");
    assert.isEqual(result[1], 1, "fib(1) = 1");
    for (let i = 2; i < 9; i++) {
      assert.isEqual(result[i], 0, `fib result byte[${i}]`);
    }
    return assert;
  }),
];
```
