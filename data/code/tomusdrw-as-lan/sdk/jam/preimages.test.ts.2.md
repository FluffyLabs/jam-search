---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/preimages.test.ts#L214-L266
title: sdk/jam/preimages.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 882f4a13b3fd61d464b7ba39dc15ce3a4e7eb207d5211bbfeec3aaed34d91534
language: typescript
---
`sdk/jam/preimages.test.ts` (lines 214–266)

```typescript
    a.isEqual(result.isOkay, true, "should be ok");
    return a;
  }),

  test("AccumulatePreimages.forget returns Huh error", () => {
    TestEcalli.reset();
    const a = Assert.create();
    TestPreimages.setForgetResult(EcalliResult.HUH);

    const ap = AccumulatePreimages.create();
    const result = ap.forget(Bytes32.zero(), 64);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, ForgetError.Huh, "error kind");
    return a;
  }),

  // ─── AccumulatePreimages.provide ──────────────────────────────────────

  test("AccumulatePreimages.provide returns ok on success", () => {
    TestEcalli.reset();
    const a = Assert.create();
    TestPreimages.setProvideResult(0); // OK

    const ap = AccumulatePreimages.create();
    const result = ap.provide(BytesBlob.zero(64));
    a.isEqual(result.isOkay, true, "should be ok");
    return a;
  }),

  test("AccumulatePreimages.provide returns Who error", () => {
    TestEcalli.reset();
    const a = Assert.create();
    TestPreimages.setProvideResult(EcalliResult.WHO);

    const ap = AccumulatePreimages.create();
    const result = ap.provide(BytesBlob.zero(64));
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, ProvideError.Who, "error kind");
    return a;
  }),

  test("AccumulatePreimages.provide returns Huh error", () => {
    TestEcalli.reset();
    const a = Assert.create();
    TestPreimages.setProvideResult(EcalliResult.HUH);

    const ap = AccumulatePreimages.create();
    const result = ap.provide(BytesBlob.zero(64));
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, ProvideError.Huh, "error kind");
    return a;
  }),
];
```
