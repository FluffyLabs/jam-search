---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/statistics.test.ts#L1-L106
title: packages/jam/transition/statistics.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 7
content_sha: dcbc3c9884ce442618629d816a2c823446b5f431e25ad35998f7373d7bcdd75c
language: typescript
---
`packages/jam/transition/statistics.test.ts` (lines 1–106)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import {
  type CoreIndex,
  Extrinsic,
  tryAsCoreIndex,
  tryAsPerValidator,
  tryAsServiceGas,
  tryAsServiceId,
  tryAsTimeSlot,
  tryAsValidatorIndex,
} from "@typeberry/block";
import { type AssurancesExtrinsic, AvailabilityAssurance } from "@typeberry/block/assurances.js";
import { I, T, W_M, W_X } from "@typeberry/block/gp-constants.js";
import type { GuaranteesExtrinsic } from "@typeberry/block/guarantees.js";
import type { PreimagesExtrinsic } from "@typeberry/block/preimage.js";
import { testWorkReportHex } from "@typeberry/block/test-helpers.js";
import type { TicketsExtrinsic } from "@typeberry/block/tickets.js";
import { WorkReport } from "@typeberry/block/work-report.js";
import { BitVec, Bytes, BytesBlob } from "@typeberry/bytes";
import { Decoder } from "@typeberry/codec";
import { asKnownSize, FixedSizeArray } from "@typeberry/collections";
import { EC_SEGMENT_SIZE, tinyChainSpec } from "@typeberry/config";
import {
  BANDERSNATCH_KEY_BYTES,
  BLS_KEY_BYTES,
  ED25519_KEY_BYTES,
  ED25519_SIGNATURE_BYTES,
  type Ed25519Key,
} from "@typeberry/crypto";
import { currentValidatorData } from "@typeberry/disputes/disputes.test.data.js";
import { HASH_SIZE } from "@typeberry/hash";
import { isU16, isU32, tryAsU32 } from "@typeberry/numbers";
import {
  CoreStatistics,
  ServiceStatistics,
  type State,
  StatisticsData,
  tryAsPerCore,
  ValidatorData,
  ValidatorStatistics,
} from "@typeberry/state";
import { asOpaqueType } from "@typeberry/utils";
import { MAX_WORK_REPORT_SIZE_BYTES } from "./reports/verify-basic.js";
import { Statistics, type StatisticsState } from "./statistics.js";
import { copyAndUpdateState } from "./test.utils.js";

describe("Statistics", () => {
  describe("formulas", () => {
    it("max import score formula should fit into U16", () => {
      assert.strictEqual(isU16(W_M * I), true);
    });

    it("max export score formula should fit into U16", () => {
      assert.strictEqual(isU16(W_X * I), true);
    });

    it("max extrinsic count score formula should fit into U16", () => {
      assert.strictEqual(isU16(T * I), true);
    });

    it("max extrinsic size score formula should fit into U32", () => {
      assert.strictEqual(isU32(MAX_WORK_REPORT_SIZE_BYTES * I), true);
    });

    it("max data availability score formula should fit into U32", () => {
      assert.strictEqual(isU32(MAX_WORK_REPORT_SIZE_BYTES + EC_SEGMENT_SIZE * ((W_M * 65) / 64)), true);
    });
  });

  function getExtrinsic(overrides: Partial<Extrinsic> = {}): Extrinsic {
    return Extrinsic.create({
      assurances: overrides.assurances ?? asKnownSize([]),
      guarantees: overrides.guarantees ?? asKnownSize([]),
      disputes: overrides.disputes ?? asKnownSize([]),
      preimages: overrides.preimages ?? asKnownSize([]),
      tickets: overrides.tickets ?? asKnownSize([]),
    });
  }

  const emptyValidatorStatistics = () =>
    tryAsPerValidator(
      Array.from({ length: tinyChainSpec.validatorsCount }, () => {
        return ValidatorStatistics.empty();
      }),
      tinyChainSpec,
    );

  function prepareData({ previousSlot, currentSlot }: { previousSlot: number; currentSlot: number }) {
    const validatorIndex = tryAsValidatorIndex(0);
    const currentStatistics = emptyValidatorStatistics();
    const lastStatistics = emptyValidatorStatistics();
    const coreStatistics = tryAsPerCore(
      FixedSizeArray.fill(() => CoreStatistics.empty(), tinyChainSpec.coresCount),
      tinyChainSpec,
    );
    const serviceStatistics = new Map([[tryAsServiceId(0), ServiceStatistics.empty()]]);
    const statisticsData = StatisticsData.create({
      current: currentStatistics,
      previous: lastStatistics,
      cores: coreStatistics,
      services: serviceStatistics,
    });
    const state: StatisticsState = {
      statistics: statisticsData,
      timeslot: tryAsTimeSlot(previousSlot),
```
