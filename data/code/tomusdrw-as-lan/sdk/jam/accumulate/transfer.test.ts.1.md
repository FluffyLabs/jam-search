---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/transfer.test.ts#L101-L127
title: sdk/jam/accumulate/transfer.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 1
chunk_total: 2
content_sha: 5c65b083ae7307dc4a945ca758a23d10ae601f9be6ab8142a6ad5a52d9ee8f3e
language: typescript
---
`sdk/jam/accumulate/transfer.test.ts` (lines 101–127)

```typescript
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, TransferError.Cash, "should be Cash");
    return a;
  }),

  test("scheduleTransfer uses zero memo when none provided", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const ctx = AccumulateContext.create();

    // Should succeed with default null memo (128 zero bytes)
    const result = ctx.scheduleTransfer(100, 5000, 100);
    a.isEqual(result.isOkay, true, "should be ok with null memo");
    return a;
  }),

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
