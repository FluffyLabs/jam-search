---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/admin.test.ts#L104-L224
title: sdk/jam/accumulate/admin.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-21T20:48:10+01:00'
last_modified: '2026-04-21T20:48:10+01:00'
chunk_index: 1
chunk_total: 3
content_sha: fd4522ab3624cdb6775ae2df3d7310b94a526fdbc3c0c6b2e6302abeaf6dc862
language: typescript
---
`sdk/jam/accumulate/admin.test.ts` (lines 104–224)

```typescript
    const result = admin.blessRegistrar(99);
    a.isEqual(result.isOkay, true, "should be ok");
    return a;
  }),

  test("Admin.blessRegistrar returns Who on WHO", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const admin = Admin.create();

    TestPrivileged.setBlessResult(EcalliResult.WHO);
    const result = admin.blessRegistrar(99);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, BlessError.Who, "should be Who");
    return a;
  }),

  test("Admin.blessRegistrar returns Huh on HUH", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const admin = Admin.create();

    TestPrivileged.setBlessResult(EcalliResult.HUH);
    const result = admin.blessRegistrar(99);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, BlessError.Huh, "should be Huh");
    return a;
  }),

  // ─── assign ────────────────────────────────────────────────────────

  test("Admin.assign encodes auth queue and uses default newAssigner", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const admin = Admin.create();

    const hash1 = Bytes32.zero();
    hash1.raw[0] = 0xaa;
    const hash2 = Bytes32.zero();
    hash2.raw[0] = 0xbb;
    const result = admin.assign(7, [hash1, hash2]);
    a.isEqual(result.isOkay, true, "should be ok");

    // Verify scalar args
    a.isEqual(TestPrivileged.getLastAssignCore(), 7, "core = 7");
    a.isEqual(TestPrivileged.getLastAssignNewAssigner(), CURRENT_SERVICE, "default newAssigner = CURRENT_SERVICE");

    // Verify auth queue encoding: 2 × Bytes32 = 64 bytes, sequential
    const ptr = TestPrivileged.getLastAssignAuthQueuePtr();
    a.isEqual(load<u8>(ptr), 0xaa, "hash1[0] = 0xaa");
    a.isEqual(load<u8>(ptr + 32), 0xbb, "hash2[0] = 0xbb");
    return a;
  }),

  test("Admin.assign with explicit newAssigner passes it through", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const admin = Admin.create();

    const result = admin.assign(0, [Bytes32.zero()], 42);
    a.isEqual(result.isOkay, true, "should be ok");
    a.isEqual(TestPrivileged.getLastAssignNewAssigner(), 42, "newAssigner = 42");
    return a;
  }),

  test("Admin.assign returns Core on CORE", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const admin = Admin.create();

    TestPrivileged.setAssignResult(EcalliResult.CORE);
    const result = admin.assign(999, []);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, AssignError.Core, "should be Core");
    return a;
  }),

  test("Admin.assign returns Who on WHO", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const admin = Admin.create();

    TestPrivileged.setAssignResult(EcalliResult.WHO);
    const result = admin.assign(0, []);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, AssignError.Who, "should be Who");
    return a;
  }),

  test("Admin.assign returns Huh on HUH", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const admin = Admin.create();

    TestPrivileged.setAssignResult(EcalliResult.HUH);
    const result = admin.assign(0, []);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, AssignError.Huh, "should be Huh");
    return a;
  }),

  // ─── designate ─────────────────────────────────────────────────────

  test("Admin.designate encodes validator keys", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const admin = Admin.create();

    const ed = Bytes32.zero();
    ed.raw[0] = 0xe0;
    const band = Bytes32.zero();
    band.raw[0] = 0xb0;
    const bls = BytesBlob.zero(144);
    bls.raw[0] = 0xbb;
    const meta = BytesBlob.zero(128);
    meta.raw[0] = 0xaa;

    const key = ValidatorKey.create(ed, band, bls, meta);
    const result = admin.designate([key]);
    a.isEqual(result.isOkay, true, "should be ok");

```
