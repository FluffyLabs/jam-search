---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/child-services.test.ts#L1-L93
title: sdk/jam/accumulate/child-services.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 6af7c434c9eb6f7791d514cb0326be83031192e3664a7b6abd6a145affa486e9
language: typescript
---
`sdk/jam/accumulate/child-services.test.ts` (lines 1–93)

```typescript
import { Bytes32 } from "../../core/bytes";
import { EcalliResult } from "../../ecalli";
import { TestEcalli, TestServices } from "../../test/test-ecalli";
import { Assert, Test, test } from "../../test/utils";
import { ChildServices, EjectChildError, NewChildError } from "./child-services";

export const TESTS: Test[] = [
  // ─── newChild ──────────────────────────────────────────────────────

  test("ChildServices.newChild returns service ID on success", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const cs = ChildServices.create();

    const result = cs.newChild(Bytes32.zero(), 1024, 10_000, 50_000);
    a.isEqual(result.isOkay, true, "should be ok");
    // Default mock returns incrementing IDs starting from 256
    a.isEqual(result.okay, 256, "first service ID after reset = 256");
    return a;
  }),

  test("ChildServices.newChild returns Cash on CASH", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const cs = ChildServices.create();

    TestServices.setNewServiceResult(EcalliResult.CASH);
    const result = cs.newChild(Bytes32.zero(), 1024, 10_000, 50_000);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, NewChildError.Cash, "should be Cash");
    return a;
  }),

  test("ChildServices.newChild returns Huh on HUH", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const cs = ChildServices.create();

    TestServices.setNewServiceResult(EcalliResult.HUH);
    const result = cs.newChild(Bytes32.zero(), 1024, 10_000, 50_000);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, NewChildError.Huh, "should be Huh");
    return a;
  }),

  test("ChildServices.newChild returns Full on FULL", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const cs = ChildServices.create();

    TestServices.setNewServiceResult(EcalliResult.FULL);
    const result = cs.newChild(Bytes32.zero(), 1024, 10_000, 50_000);
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, NewChildError.Full, "should be Full");
    return a;
  }),

  // ─── ejectChild ───────────────────────────────────────────────────

  test("ChildServices.ejectChild returns ok on success", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const cs = ChildServices.create();

    const result = cs.ejectChild(100, Bytes32.zero());
    a.isEqual(result.isOkay, true, "should be ok");
    return a;
  }),

  test("ChildServices.ejectChild returns Who on WHO", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const cs = ChildServices.create();

    TestServices.setEjectResult(EcalliResult.WHO);
    const result = cs.ejectChild(100, Bytes32.zero());
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, EjectChildError.Who, "should be Who");
    return a;
  }),

  test("ChildServices.ejectChild returns Huh on HUH", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const cs = ChildServices.create();

    TestServices.setEjectResult(EcalliResult.HUH);
    const result = cs.ejectChild(100, Bytes32.zero());
    a.isEqual(result.isError, true, "should be error");
    a.isEqual(result.error, EjectChildError.Huh, "should be Huh");
    return a;
  }),
];
```
