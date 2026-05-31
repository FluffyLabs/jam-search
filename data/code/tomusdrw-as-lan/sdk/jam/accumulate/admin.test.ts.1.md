---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/admin.test.ts#L99-L219
title: sdk/jam/accumulate/admin.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 7e9d05ee54b577ecf85938fe82019ff9a7fa02e1e3c59b5af48a68e6609cad96
language: typescript
---
`sdk/jam/accumulate/admin.test.ts` (lines 99–219)

```typescript
    a.isEqual(result.error, BlessError.Huh, "should be Huh");
    return a;
  }),

  // ─── blessRegistrar ────────────────────────────────────────────────

  test("Admin.blessRegistrar returns ok on success", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const admin = Admin.create();

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
    const authQueueEnc = Encoder.create();
    authQueueEnc.bytesFixLen(hash1.bytes);
    authQueueEnc.bytesFixLen(hash2.bytes);
    const authQueueActual = BytesBlob.wrap(readFromMemory(TestPrivileged.getLastAssignAuthQueuePtr(), 64));
    a.isEqualBytes(authQueueActual, authQueueEnc.finish(), "authQueue");
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

```
