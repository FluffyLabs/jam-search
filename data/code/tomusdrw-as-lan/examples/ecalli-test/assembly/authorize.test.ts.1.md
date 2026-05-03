---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/authorize.test.ts#L112-L130
title: examples/ecalli-test/assembly/authorize.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 1
chunk_total: 2
content_sha: b1a12c73244a4b34f03ba10c9aefa780d1db144626ede7fc8cb3979446b3f0e3
language: typescript
---
`examples/ecalli-test/assembly/authorize.test.ts` (lines 112–130)

```typescript
    assert.isEqual(resp.result, 96, "info total length");
    assert.isEqual(resp.data.raw.length, 96, "info data length");
    return assert;
  }),

  test("authorize: log emits debug message", () => {
    TestEcalli.reset();
    const p = Encoder.create();
    p.varU64(EcalliIndex.Log);
    p.varU64(2); // level: Important
    p.bytesVarLen(strBlob("auth-target"));
    p.bytesVarLen(strBlob("hello from authorize"));

    const resp = callAuthorize(p.finishRaw());
    const assert = Assert.create();
    assert.isEqual(resp.result, 0, "log returns 0");
    return assert;
  }),
];
```
