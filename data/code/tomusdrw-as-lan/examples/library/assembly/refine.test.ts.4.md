---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/library/assembly/refine.test.ts#L400-L418
title: examples/library/assembly/refine.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 4
chunk_total: 5
content_sha: 94aa09aecb4ef9c3db212838eadf65e98f2aaa1fdf6858445e0f35d114a7f39b
language: typescript
---
`examples/library/assembly/refine.test.ts` (lines 400–418)

```typescript
    const assert = Assert.create();
    // Clear any error sentinel a prior test may have left in peekResult;
    // the mock now skips the memory write when peekResult is a negative sentinel.
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
