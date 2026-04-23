---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/preimages.test.ts#L212-L273
title: sdk/jam/preimages.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 2
chunk_total: 3
content_sha: 52d24a448cf8c6b33c9d7ad1dc3277bfb5ea46a403656d848cce7c6e427ca3b5
language: typescript
---
`sdk/jam/preimages.test.ts` (lines 212–273)

```typescript
  // ─── AccumulatePreimages.forget ───────────────────────────────────────

  test("AccumulatePreimages.forget returns ok on success", () => {
    TestEcalli.reset();
    const a = Assert.create();
    TestPreimages.setForgetResult(0); // OK

    const ap = AccumulatePreimages.create();
    const result = ap.forget(Bytes32.zero(), 64);
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
