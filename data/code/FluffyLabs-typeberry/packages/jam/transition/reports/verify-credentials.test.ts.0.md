---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/verify-credentials.test.ts#L1-L108
title: packages/jam/transition/reports/verify-credentials.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 3
content_sha: 8692663a3227feac7a3d623da8d76fafdc8b5aa12f587393f86e6bdb2321b3a8
language: typescript
---
`packages/jam/transition/reports/verify-credentials.test.ts` (lines 1–108)

```typescript
import { describe, it } from "node:test";
import { tryAsPerValidator, tryAsTimeSlot } from "@typeberry/block";
import { ReportGuarantee } from "@typeberry/block/guarantees.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { HashSet } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import { ED25519_SIGNATURE_BYTES, type Ed25519Key } from "@typeberry/crypto";
import { Blake2b } from "@typeberry/hash";
import { asOpaqueType, deepEqual } from "@typeberry/utils";
import { ReportsError } from "./error.js";
import {
  ENTROPY,
  guaranteesAsView,
  initialValidators,
  newCredential,
  newReports,
  newWorkReport,
} from "./test.utils.js";

describe("Reports.verifyCredentials", () => {
  it("should reject insufficient credentials", async () => {
    const reports = await newReports();
    const guarantees = guaranteesAsView(
      tinyChainSpec,
      [
        ReportGuarantee.create({
          slot: tryAsTimeSlot(5),
          report: newWorkReport({ core: 0 }),
          credentials: asOpaqueType([1].map((x) => newCredential(x))),
        }),
      ],
      { disableCredentialsRangeCheck: true },
    );

    const input = {
      guarantees,
      slot: tryAsTimeSlot(1),
      newEntropy: ENTROPY,
      recentBlocksPartialUpdate: reports.state.recentBlocks, // note: for full fidelity this should be partially updated state, not prior state as it is now
      assurancesAvailAssignment: reports.state.availabilityAssignment,
      offenders: HashSet.new<Ed25519Key>(),
      currentValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
      previousValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
    };
    const hashes = reports.workReportHashes(guarantees, await Blake2b.createHasher());
    const res = reports.verifyCredentials(input, hashes);

    deepEqual(res, {
      isOk: false,
      isError: true,
      error: ReportsError.InsufficientGuarantees,
      details: () => "Invalid number of credentials. Expected 2,3, got 1",
    });
  });

  it("should reject too many credentials", async () => {
    const reports = await newReports();
    const guarantees = guaranteesAsView(
      tinyChainSpec,
      [
        ReportGuarantee.create({
          slot: tryAsTimeSlot(5),
          report: newWorkReport({ core: 1 }),
          credentials: asOpaqueType([1, 2, 3, 4].map((x) => newCredential(x))),
        }),
      ],
      { disableCredentialsRangeCheck: true },
    );

    const input = {
      guarantees,
      slot: tryAsTimeSlot(1),
      newEntropy: ENTROPY,
      recentBlocksPartialUpdate: reports.state.recentBlocks,
      assurancesAvailAssignment: reports.state.availabilityAssignment,
      offenders: HashSet.new<Ed25519Key>(),
      currentValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
      previousValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
    };
    const hashes = reports.workReportHashes(guarantees, await Blake2b.createHasher());
    const res = reports.verifyCredentials(input, hashes);

    deepEqual(res, {
      isOk: false,
      isError: true,
      error: ReportsError.InsufficientGuarantees,
      details: () => "Invalid number of credentials. Expected 2,3, got 4",
    });
  });

  it("should reject out-of-order credentials", async () => {
    const reports = await newReports();
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(5),
        report: newWorkReport({ core: 0 }),
        credentials: asOpaqueType([1, 0].map((x) => newCredential(x))),
      }),
    ]);

    const input = {
      guarantees,
      slot: tryAsTimeSlot(6),
      newEntropy: ENTROPY,
      recentBlocksPartialUpdate: reports.state.recentBlocks,
      assurancesAvailAssignment: reports.state.availabilityAssignment,
      offenders: HashSet.new<Ed25519Key>(),
      currentValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
```
