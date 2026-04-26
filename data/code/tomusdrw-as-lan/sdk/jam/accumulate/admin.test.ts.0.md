---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/admin.test.ts#L1-L110
title: sdk/jam/accumulate/admin.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 3
content_sha: b82afe3082e5e46c016498660be5aafa466898fdf92d372b27099f875e8d84b5
language: typescript
---
`sdk/jam/accumulate/admin.test.ts` (lines 1–110)

```typescript
import { Bytes32, BytesBlob } from "../../core/bytes";
import { EcalliResult } from "../../ecalli";
import { TestEcalli, TestPrivileged } from "../../test/test-ecalli";
import { Assert, Test, test } from "../../test/utils";
import { AutoAccumulateEntry, CURRENT_SERVICE, ValidatorKey } from "../types";
import { Admin, AssignError, BlessError, DesignateError } from "./admin";

export const TESTS: Test[] = [
  // ─── bless ─────────────────────────────────────────────────────────

  test("Admin.bless encodes args and returns ok", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const admin = Admin.create();

    const result = admin.bless(1, [2, 3], 4, 5, [AutoAccumulateEntry.create(100, 500)]);
    a.isEqual(result.isOkay, true, "should be ok");

    // Verify scalar args passed through correctly
    a.isEqual(TestPrivileged.getLastBlessManager(), 1, "manager");
    a.isEqual(TestPrivileged.getLastBlessDelegator(), 4, "delegator");
    a.isEqual(TestPrivileged.getLastBlessRegistrar(), 5, "registrar");
    a.isEqual(TestPrivileged.getLastBlessAutoAccumCount(), 1, "autoAccum count");

    // Verify assigners encoding: [2, 3] → 2 × u32 LE = 8 bytes
    const aPtr = TestPrivileged.getLastBlessAssignersPtr();
    a.isEqual(load<u32>(aPtr), 2, "assigners[0] = 2");
    a.isEqual(load<u32>(aPtr + 4), 3, "assigners[1] = 3");

    // Verify autoAccumulate encoding: [{ serviceId: 100, gas: 500 }] → u32 LE + u64 LE = 12 bytes
    const aaPtr = TestPrivileged.getLastBlessAutoAccumPtr();
    a.isEqual(load<u32>(aaPtr), 100, "autoAccum[0].serviceId = 100");
    a.isEqual(load<u64>(aaPtr + 4), 500, "autoAccum[0].gas = 500");
    return a;
  }),

  test("Admin.bless returns Who on WHO", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const admin = Admin.create();

    TestPrivileged.setBlessResult(EcalliResult.WHO);
    const result = admin.bless(1, [], 4, 5, []);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, BlessError.Who, "should be Who");
    return a;
  }),

  test("Admin.bless returns Huh on HUH", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const admin = Admin.create();

    TestPrivileged.setBlessResult(EcalliResult.HUH);
    const result = admin.bless(1, [], 4, 5, []);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, BlessError.Huh, "should be Huh");
    return a;
  }),

  // ─── blessDelegator ────────────────────────────────────────────────

  test("Admin.blessDelegator returns ok on success", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const admin = Admin.create();

    const result = admin.blessDelegator(42);
    a.isEqual(result.isOkay, true, "should be ok");
    return a;
  }),

  test("Admin.blessDelegator returns Who on WHO", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const admin = Admin.create();

    TestPrivileged.setBlessResult(EcalliResult.WHO);
    const result = admin.blessDelegator(42);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, BlessError.Who, "should be Who");
    return a;
  }),

  test("Admin.blessDelegator returns Huh on HUH", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const admin = Admin.create();

    TestPrivileged.setBlessResult(EcalliResult.HUH);
    const result = admin.blessDelegator(42);
    a.isEqual(result.isError, true, "should be error");
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
```
