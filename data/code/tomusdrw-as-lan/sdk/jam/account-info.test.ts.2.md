---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/account-info.test.ts#L207-L246
title: sdk/jam/account-info.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 2
chunk_total: 3
content_sha: 60d7507061f15c1c3517f65b0997d42ae1e60c1d811b03cdd8dcdb1667f6ed58
language: typescript
---
`sdk/jam/account-info.test.ts` (lines 207–246)

```typescript
    const key = ByteBuf.create(32).strAscii("overkey").finishBlob();
    const val1 = BytesBlob.zero(5);
    val1.raw.fill(0xaa);
    const val2 = BytesBlob.zero(3);
    val2.raw.fill(0xbb);

    // First write — no previous value
    svc.write(key, val1);

    // Second write — should return previous length (5)
    const key2 = ByteBuf.create(32).strAscii("overkey").finishBlob();
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
    const data = result.val!;
    a.isEqual(data.length, 4, "length");
    a.isEqual(data.raw[0], 0xca, "byte 0");
    a.isEqual(data.raw[1], 0xfe, "byte 1");
    a.isEqual(data.raw[2], 0xba, "byte 2");
    a.isEqual(data.raw[3], 0xbe, "byte 3");
    return a;
  }),
];
```
