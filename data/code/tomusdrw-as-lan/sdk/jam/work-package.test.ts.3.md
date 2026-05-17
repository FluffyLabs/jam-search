---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/work-package.test.ts#L302-L326
title: sdk/jam/work-package.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 3
chunk_total: 4
content_sha: 10f1834d3a86d4c3271605a615670626ca2ebf14d9faab9514ca3009a651ecd2
language: typescript
---
`sdk/jam/work-package.test.ts` (lines 302–326)

```typescript
    assert.isEqual(decoded.authServiceId, 10, "authServiceId");
    assert.isEqualBytes(decoded.authCodeHash.bytes, bytes32Fill(0xcc).bytes, "authCodeHash");
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
