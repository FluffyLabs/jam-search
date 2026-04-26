---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/library/assembly/refine.test.ts#L391-L406
title: examples/library/assembly/refine.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 4
chunk_total: 5
content_sha: 19dfa3948f0bfe1d120bad3ee3a8692abb50a84ae6ff2ad4ade619f07c0926a9
language: typescript
---
`examples/library/assembly/refine.test.ts` (lines 391–406)

```typescript
    TestMachine.setPeekResult(0);
    const payload = BytesBlob.parseBlob("0xdeadbeef").okay!;
    TestMachine.setPeekData(payload.raw);

    const r = Machine.create(BytesBlob.zero(4), 0);
    if (r.isError) {
      assert.fail("machine create failed");
      return assert;
    }
    const m = r.okay;
    const buf = BytesBlob.zero(4);
    m.peek(0, buf);
    assert.isEqualBytes(buf, payload, "peek data");
    return assert;
  }),
];
```
