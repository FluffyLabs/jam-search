---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/verify-order.test.ts#L1-L53
title: packages/jam/transition/reports/verify-order.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 927ebff0559101bffe0f4ae586ce3b198898e5d819a2abdb8ad365aa6078f8c6
language: typescript
---
`packages/jam/transition/reports/verify-order.test.ts` (lines 1–53)

```typescript
import { describe, it } from "node:test";
import { tryAsTimeSlot } from "@typeberry/block";
import { ReportGuarantee } from "@typeberry/block/guarantees.js";
import { tinyChainSpec } from "@typeberry/config";
import { asOpaqueType, deepEqual } from "@typeberry/utils";
import { ReportsError } from "./index.js";
import { guaranteesAsView, newCredential, newWorkReport } from "./test.utils.js";
import { verifyReportsOrder } from "./verify-order.js";

describe("Reports.verifyReportsOrder", () => {
  it("should reject out-of-order guarantees", async () => {
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(5),
        report: newWorkReport({ core: 1 }),
        credentials: asOpaqueType([1, 2].map((x) => newCredential(x))),
      }),
      ReportGuarantee.create({
        slot: tryAsTimeSlot(5),
        report: newWorkReport({ core: 0 }),
        credentials: asOpaqueType([1, 2].map((x) => newCredential(x))),
      }),
    ]);

    const res = verifyReportsOrder(guarantees, tinyChainSpec);

    deepEqual(res, {
      isOk: false,
      isError: true,
      error: ReportsError.OutOfOrderGuarantee,
      details: () => "Core indices of work reports are not unique or in order. Got: 0, expected at least: 2",
    });
  });

  it("should reject invalid core index", async () => {
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(5),
        report: newWorkReport({ core: 3 }),
        credentials: asOpaqueType([1, 2].map((x) => newCredential(x))),
      }),
    ]);

    const res = verifyReportsOrder(guarantees, tinyChainSpec);

    deepEqual(res, {
      isOk: false,
      isError: true,
      error: ReportsError.BadCoreIndex,
      details: () => "Invalid core index. Got: 3, max: 2",
    });
  });
});
```
