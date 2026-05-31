---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/transfer.test.ts#L109-L119
title: sdk/jam/accumulate/transfer.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 61ef3f695a0ab8eec09908df1229849b565088f4e2aa0c85e0cb664ba51a0918
language: typescript
---
`sdk/jam/accumulate/transfer.test.ts` (lines 109–119)

```typescript
  test("scheduleTransfer accepts explicit Memo", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = AccumulateContext.create();

    const memo = Memo.create(BytesBlob.parseBlob("0xdeadbeef").okay!);
    const result = ctx.scheduleTransfer(100, 5000, 100, memo);
    a.isEqual(result.isOkay, true, "should be ok with explicit memo");
    return a;
  }),
];
```
