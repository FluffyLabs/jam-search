---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/work-package.test.ts#L307-L342
title: sdk/jam/work-package.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 3
chunk_total: 4
content_sha: 27d7477520088a98a48e7781965b9d53e6b67eba2c2078480e97741c2ca14b7d
language: typescript
---
`sdk/jam/work-package.test.ts` (lines 307–342)

```typescript
    const authToken = BytesBlob.parseBlob("0xaabbccdd").okay!;
    const authConfig = BytesBlob.parseBlob("0x1234").okay!;
    const original = WorkPackage.create(authToken, 10, bytes32Fill(0xcc), authConfig, ctx, items);
    const decoded = roundtrip<WorkPackage>(original, _workPackage, _workPackage);

    const assert = Assert.create();
    assert.isEqualBytes(decoded.authToken, authToken, "authToken");
    assert.isEqual(decoded.authServiceId, 10, "authServiceId");
    assert.isEqualBytes(
      BytesBlob.wrap(decoded.authCodeHash.raw),
      BytesBlob.wrap(bytes32Fill(0xcc).raw),
      "authCodeHash",
    );
    assert.isEqualBytes(decoded.authConfig, authConfig, "authConfig");
    assert.isEqual(decoded.context.timeslot, 7777, "context.timeslot");
    assert.isEqual(decoded.workItems.length, 1, "workItem count");
    assert.isEqual(decoded.workItems[0].serviceId, 42, "workItems[0].serviceId");
    assert.isEqual(decoded.workItems[0].gasRefine, 100000, "workItems[0].gasRefine");
    return assert;
  }),

  // ─── Negative decode tests ───

  test("ImportRef decode rejects invalid tag", () => {
    const e = Encoder.create();
    e.u8(2); // invalid tag (only 0 and 1 valid)
    e.bytesFixLen(bytes32Fill(0x00).bytes);
    e.varU64(0);
    const d = Decoder.fromBlob(e.finishRaw());
    const r = _importRef.decode(d);

    const assert = Assert.create();
    assert.isEqual(r.isError, true, "should fail");
    return assert;
  }),
];
```
