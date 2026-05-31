---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/preimages.test.ts#L110-L222
title: sdk/jam/preimages.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 1
chunk_total: 3
content_sha: d52a53cbfdd1f2dc59d1d6d3a2e08f8fb6bafe887e8fdf33f527a2a08b12dd70
language: typescript
---
`sdk/jam/preimages.test.ts` (lines 110–222)

```typescript
    const ap = AccumulatePreimages.create();
    const result = ap.query(Bytes32.zero(), 64);
    a.isEqual(result.isSome, true, "should be some");
    a.isEqual(result.val!.kind, PreimageStatusKind.Requested, "kind");
    return a;
  }),

  test("AccumulatePreimages.query decodes Available", () => {
    TestEcalli.reset();
    const a = Assert.create();
    // Available: r7 = (slot0 << 32) | 1, r8 = 0
    const slot0: u64 = 42;
    TestPreimages.setQueryResult(i64((slot0 << 32) | 1), 0);

    const ap = AccumulatePreimages.create();
    const result = ap.query(Bytes32.zero(), 64);
    a.isEqual(result.isSome, true, "should be some");
    a.isEqual(result.val!.kind, PreimageStatusKind.Available, "kind");
    a.isEqual(result.val!.slot0, 42, "slot0");
    return a;
  }),

  test("AccumulatePreimages.query decodes Unavailable", () => {
    TestEcalli.reset();
    const a = Assert.create();
    // Unavailable: r7 = (slot0 << 32) | 2, r8 = slot1
    const slot0: u64 = 10;
    const slot1: u64 = 20;
    TestPreimages.setQueryResult(i64((slot0 << 32) | 2), i64(slot1));

    const ap = AccumulatePreimages.create();
    const result = ap.query(Bytes32.zero(), 64);
    a.isEqual(result.isSome, true, "should be some");
    a.isEqual(result.val!.kind, PreimageStatusKind.Unavailable, "kind");
    a.isEqual(result.val!.slot0, 10, "slot0");
    a.isEqual(result.val!.slot1, 20, "slot1");
    return a;
  }),

  test("AccumulatePreimages.query decodes Reavailable", () => {
    TestEcalli.reset();
    const a = Assert.create();
    // Reavailable: r7 = (slot0 << 32) | 3, r8 = (slot2 << 32) | slot1
    const slot0: u64 = 5;
    const slot1: u64 = 15;
    const slot2: u64 = 25;
    TestPreimages.setQueryResult(i64((slot0 << 32) | 3), i64((slot2 << 32) | slot1));

    const ap = AccumulatePreimages.create();
    const result = ap.query(Bytes32.zero(), 64);
    a.isEqual(result.isSome, true, "should be some");
    a.isEqual(result.val!.kind, PreimageStatusKind.Reavailable, "kind");
    a.isEqual(result.val!.slot0, 5, "slot0");
    a.isEqual(result.val!.slot1, 15, "slot1");
    a.isEqual(result.val!.slot2, 25, "slot2");
    return a;
  }),

  // ─── AccumulatePreimages.solicit ──────────────────────────────────────

  test("AccumulatePreimages.solicit returns ok on success", () => {
    TestEcalli.reset();
    const a = Assert.create();
    TestPreimages.setSolicitResult(0); // OK

    const ap = AccumulatePreimages.create();
    const result = ap.solicit(Bytes32.zero(), 64);
    a.isEqual(result.isOkay, true, "should be ok");
    return a;
  }),

  test("AccumulatePreimages.solicit returns Huh error", () => {
    TestEcalli.reset();
    const a = Assert.create();
    TestPreimages.setSolicitResult(EcalliResult.HUH);

    const ap = AccumulatePreimages.create();
    const result = ap.solicit(Bytes32.zero(), 64);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, SolicitError.Huh, "error kind");
    return a;
  }),

  test("AccumulatePreimages.solicit returns Full error", () => {
    TestEcalli.reset();
    const a = Assert.create();
    TestPreimages.setSolicitResult(EcalliResult.FULL);

    const ap = AccumulatePreimages.create();
    const result = ap.solicit(Bytes32.zero(), 64);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, SolicitError.Full, "error kind");
    return a;
  }),

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

```
