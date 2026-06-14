---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/verify-basic.test.ts#L1-L106
title: packages/jam/transition/reports/verify-basic.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 370c7eaab8fdf1c16558c52f6baf2469695ad64201c15307b472c8d88d63ceb6
language: typescript
---
`packages/jam/transition/reports/verify-basic.test.ts` (lines 1–106)

```typescript
import { describe, it } from "node:test";
import { tryAsTimeSlot } from "@typeberry/block";
import { ReportGuarantee } from "@typeberry/block/guarantees.js";
import type { WorkResult } from "@typeberry/block/work-result.js";
import { Bytes } from "@typeberry/bytes";
import { FixedSizeArray } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import { HASH_SIZE } from "@typeberry/hash";
import { tryAsU8, type U8 } from "@typeberry/numbers";
import { asOpaqueType, deepEqual, OK } from "@typeberry/utils";
import { ReportsError } from "./error.js";
import { guaranteesAsView, newCredential, newWorkReport } from "./test.utils.js";
import { MAX_WORK_REPORT_SIZE_BYTES, verifyReportsBasic } from "./verify-basic.js";

describe("Reports.verifyReportsBasic", () => {
  it("should reject if report has too many dependencies", () => {
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(10),
        report: newWorkReport({
          core: 0,
          prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((x) => Bytes.fill(HASH_SIZE, x)),
        }),
        credentials: asOpaqueType([0, 3].map((x) => newCredential(x))),
      }),
    ]);

    const result = verifyReportsBasic(guarantees);

    deepEqual(result, {
      isOk: false,
      isError: true,
      error: ReportsError.TooManyDependencies,
      details: () => "Report at 0 has too many dependencies. Got 9 + 0, max: 8",
    });
  });

  it("should reject if total size is too big", () => {
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(10),
        report: newWorkReport({ core: 0, resultSize: MAX_WORK_REPORT_SIZE_BYTES + 1 }),
        credentials: asOpaqueType([0, 3].map((x) => newCredential(x))),
      }),
    ]);

    const result = verifyReportsBasic(guarantees);

    deepEqual(result, {
      isOk: false,
      isError: true,
      error: ReportsError.WorkReportTooBig,
      details: () => "Work report at 0 too big. Got 0 + 49153, max: 49152",
    });
  });

  it("should reject if report has invalid number of work results (0)", () => {
    // Create a minimal work report with 0 results by manually constructing it
    const emptyResults = FixedSizeArray.new<WorkResult, U8>([], tryAsU8(0));
    const report = newWorkReport({ core: 0 });

    // Bypass the type system to set 0 results
    const invalidReport = {
      ...report,
      results: emptyResults,
    };

    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(10),
        report: invalidReport,
        credentials: asOpaqueType([0, 3].map((x) => newCredential(x))),
      }),
    ]);

    const result = verifyReportsBasic(guarantees);

    deepEqual(result, {
      isOk: false,
      isError: true,
      error: ReportsError.InvalidWorkItemsCount,
      details: () => `Number of work results is invalid.
          Got: 0,
          expected between 1 and 16
          `,
    });
  });

  it("should verify correctly", () => {
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(10),
        report: newWorkReport({ core: 0 }),
        credentials: asOpaqueType([0, 3].map((x) => newCredential(x))),
      }),
    ]);

    const result = verifyReportsBasic(guarantees);

    deepEqual(result, {
      isOk: true,
      isError: false,
      ok: OK,
    });
  });
});
```
