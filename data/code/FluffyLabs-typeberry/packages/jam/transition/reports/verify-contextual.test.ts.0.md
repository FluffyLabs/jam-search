---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/verify-contextual.test.ts#L1-L103
title: packages/jam/transition/reports/verify-contextual.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 5
content_sha: 22a870785438a08a7102979c23a79497bcdde5cbef4181b1561b80d43150c29a
language: typescript
---
`packages/jam/transition/reports/verify-contextual.test.ts` (lines 1–103)

```typescript
import { describe, it } from "node:test";
import { tryAsPerValidator, tryAsTimeSlot } from "@typeberry/block";
import { ReportGuarantee } from "@typeberry/block/guarantees.js";
import { WorkPackageInfo } from "@typeberry/block/refine-context.js";
import { Bytes } from "@typeberry/bytes";
import { asKnownSize, HashDictionary } from "@typeberry/collections";
import { HashSet } from "@typeberry/collections/hash-set.js";
import { tinyChainSpec } from "@typeberry/config";
import type { Ed25519Key } from "@typeberry/crypto";
import { HASH_SIZE } from "@typeberry/hash";
import { NotYetAccumulatedReport } from "@typeberry/state";
import { asOpaqueType, deepEqual } from "@typeberry/utils";
import { ReportsError } from "./error.js";
import {
  ENTROPY,
  guaranteesAsView,
  initialServices,
  initialValidators,
  newCredential,
  newReports,
  newWorkReport,
} from "./test.utils.js";

describe("Reports.verifyContextualValidity", () => {
  it("should reject when code hash is not matching", async () => {
    const reports = await newReports({
      services: initialServices({ withDummyCodeHash: true }),
    });
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(10),
        report: newWorkReport({ core: 0 }),
        credentials: asOpaqueType([0, 3].map((x) => newCredential(x))),
      }),
    ]);
    const input = {
      slot: tryAsTimeSlot(10),
      guarantees,
      newEntropy: ENTROPY,
      recentBlocksPartialUpdate: reports.state.recentBlocks, // note: for full fidelity this should be partially updated state, not prior state as it is now
      assurancesAvailAssignment: reports.state.availabilityAssignment,
      offenders: HashSet.new<Ed25519Key>(),
      currentValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
      previousValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
    };
    const res = reports.verifyContextualValidity(input);

    deepEqual(res, {
      isOk: false,
      isError: true,
      error: ReportsError.BadCodeHash,
      details: () =>
        "Service (129) code hash mismatch. Got: 0x8178abf4f459e8ed591be1f7f629168213a5ac2a487c28c0ef1a806198096c7a, expected: 0x0101010101010101010101010101010101010101010101010101010101010101",
    });
  });

  it("should reject duplicate work packages", async () => {
    const reports = await newReports({
      services: initialServices(),
    });
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(10),
        report: newWorkReport({ core: 0 }),
        credentials: asOpaqueType([0, 3].map((x) => newCredential(x))),
      }),
      ReportGuarantee.create({
        slot: tryAsTimeSlot(10),
        report: newWorkReport({ core: 0 }),
        credentials: asOpaqueType([0, 3].map((x) => newCredential(x))),
      }),
    ]);
    const input = {
      slot: tryAsTimeSlot(10),
      guarantees,
      newEntropy: ENTROPY,
      recentBlocksPartialUpdate: reports.state.recentBlocks,
      assurancesAvailAssignment: reports.state.availabilityAssignment,
      offenders: HashSet.new<Ed25519Key>(),
      currentValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
      previousValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
    };
    const res = reports.verifyContextualValidity(input);

    deepEqual(res, {
      isOk: false,
      isError: true,
      error: ReportsError.DuplicatePackage,
      details: () => "Duplicate work package detected.",
    });
  });

  it("should reject anchor not recent", async () => {
    const reports = await newReports({
      services: initialServices(),
    });
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(10),
        report: newWorkReport({
          core: 0,
          anchorBlock: Bytes.fill(HASH_SIZE, 1),
        }),
```
