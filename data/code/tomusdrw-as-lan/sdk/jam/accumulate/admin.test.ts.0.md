---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/admin.test.ts#L1-L106
title: sdk/jam/accumulate/admin.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 0
chunk_total: 3
content_sha: f3d1cab1942afef68b3f2ae8e0f588a0f226a6b732ad08da66e960ac642b40ed
language: typescript
---
`sdk/jam/accumulate/admin.test.ts` (lines 1–106)

```typescript
import { Bytes32, BytesBlob } from "../../core/bytes";
import { Encoder } from "../../core/codec/encode";
import { readFromMemory } from "../../core/mem";
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
    const assignersEnc = Encoder.create();
    assignersEnc.u32(2);
    assignersEnc.u32(3);
    const assignersActual = BytesBlob.wrap(readFromMemory(TestPrivileged.getLastBlessAssignersPtr(), 8));
    a.isEqualBytes(assignersActual, assignersEnc.finish(), "assigners");

    // Verify autoAccumulate encoding: [{ serviceId: 100, gas: 500 }] → u32 LE + u64 LE = 12 bytes
    const autoAccumEnc = Encoder.create();
    autoAccumEnc.u32(100);
    autoAccumEnc.u64(500);
    const autoAccumActual = BytesBlob.wrap(readFromMemory(TestPrivileged.getLastBlessAutoAccumPtr(), 12));
    a.isEqualBytes(autoAccumActual, autoAccumEnc.finish(), "autoAccum[0]");
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
```
