---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/account-info.test.ts#L209-L232
title: sdk/jam/account-info.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 2
chunk_total: 3
content_sha: e4becdd25d5ee91ac9d43cfb6f57e96d055ff12a15c31ef6e051b186a17ffd4c
language: typescript
---
`sdk/jam/account-info.test.ts` (lines 209–232)

```typescript
    const result = svc.write(key2, val2);
    a.isEqual(result.isOkay, true, "should be ok");
    a.isEqual(result.okay!.isSome, true, "has previous value");
    a.isEqual(result.okay!.val, 5, "previous length");
    return a;
  }),

  test("CurrentServiceData read/write roundtrip", () => {
    TestEcalli.reset();
    const a = Assert.create();

    const svc = CurrentServiceData.create();
    const key = ByteBuf.create(32).strAscii("rtkey").finishBlob();
    const val = BytesBlob.parseBlob("0xcafebabe").okay!;

    svc.write(key, val);

    const key2 = ByteBuf.create(32).strAscii("rtkey").finishBlob();
    const result = svc.read(key2);
    a.isEqual(result.isSome, true, "should be some");
    a.isEqualBytes(result.val!, val, "data");
    return a;
  }),
];
```
