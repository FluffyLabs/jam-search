---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/accumulate/self-service.test.ts#L1-L62
title: sdk/jam/accumulate/self-service.test.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 152dfe7ebe78716f5f4c2ec5e78d33ac887bbab82109c09a5196a4b89ecd837a
language: typescript
---
`sdk/jam/accumulate/self-service.test.ts` (lines 1–62)

```typescript
import { Bytes32 } from "../../core/bytes";
import { TestEcalli, TestServices } from "../../test/test-ecalli";
import { Assert, Test, test } from "../../test/utils";
import { SelfService } from "./self-service";

export const TESTS: Test[] = [
  test("SelfService.upgradeCode passes correct args to upgrade ecalli", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const svc = SelfService.create();

    const hash = Bytes32.zero();
    hash.raw[0] = 0xaa;
    hash.raw[31] = 0xbb;
    svc.upgradeCode(hash, 10_000, 50_000);

    const ptr = TestServices.getLastUpgradeCodeHashPtr();
    a.isEqual(load<u8>(ptr), 0xaa, "code hash byte 0");
    a.isEqual(load<u8>(ptr + 31), 0xbb, "code hash byte 31");
    a.isEqual(TestServices.getLastUpgradeGas(), 10_000, "gas");
    a.isEqual(TestServices.getLastUpgradeAllowance(), 50_000, "allowance");
    return a;
  }),

  test("SelfService.requestEjection sends correct ejection hash", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const svc = SelfService.create();

    const parentId: u32 = 0x01020304;
    svc.requestEjection(parentId);

    // Verify the code hash passed to upgrade is parentId as LE u32, zero-padded to 32 bytes
    const ptr = TestServices.getLastUpgradeCodeHashPtr();
    a.isEqual(load<u8>(ptr), 0x04, "byte 0 = LE low byte");
    a.isEqual(load<u8>(ptr + 1), 0x03, "byte 1");
    a.isEqual(load<u8>(ptr + 2), 0x02, "byte 2");
    a.isEqual(load<u8>(ptr + 3), 0x01, "byte 3 = LE high byte");
    a.isEqual(load<u8>(ptr + 4), 0, "byte 4 = 0 (zero-padded)");
    a.isEqual(load<u8>(ptr + 31), 0, "byte 31 = 0 (zero-padded)");

    // Verify gas and allowance are both 0
    a.isEqual(TestServices.getLastUpgradeGas(), 0, "gas = 0");
    a.isEqual(TestServices.getLastUpgradeAllowance(), 0, "allowance = 0");
    return a;
  }),

  test("SelfService.requestEjection with service ID 0", () => {
    TestEcalli.reset();
    const a = Assert.create();
    const svc = SelfService.create();

    svc.requestEjection(0);

    const ptr = TestServices.getLastUpgradeCodeHashPtr();
    // All 32 bytes should be zero
    a.isEqual(load<u8>(ptr), 0, "byte 0 = 0");
    a.isEqual(load<u8>(ptr + 3), 0, "byte 3 = 0");
    a.isEqual(load<u8>(ptr + 31), 0, "byte 31 = 0");
    return a;
  }),
];
```
