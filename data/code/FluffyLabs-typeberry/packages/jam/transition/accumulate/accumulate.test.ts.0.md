---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate.test.ts#L1-L101
title: packages/jam/transition/accumulate/accumulate.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 13
content_sha: 7eef0c5280c77a9043a7dfd6210a7610878e118c26ab2b1c31a0e694331dbd67
language: typescript
---
`packages/jam/transition/accumulate/accumulate.test.ts` (lines 1–101)

```typescript
import assert from "node:assert";
import { before, describe, it } from "node:test";
import {
  type EntropyHash,
  type ServiceId,
  type TimeSlot,
  tryAsCoreIndex,
  tryAsPerEpochBlock,
  tryAsServiceGas,
  tryAsServiceId,
  tryAsTimeSlot,
  type WorkReportHash,
} from "@typeberry/block";
import { MIN_PUBLIC_SERVICE_INDEX } from "@typeberry/block/gp-constants.js";
import type { PreimageHash } from "@typeberry/block/preimage.js";
import { RefineContext, type WorkPackageHash } from "@typeberry/block/refine-context.js";
import { tryAsWorkItemsCount } from "@typeberry/block/work-package.js";
import { WorkPackageSpec, WorkReport } from "@typeberry/block/work-report.js";
import { WorkExecResult, WorkRefineLoad, WorkResult } from "@typeberry/block/work-result.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { asKnownSize, FixedSizeArray, HashDictionary, HashSet } from "@typeberry/collections";
import { type ChainSpec, PvmBackend, PvmBackendNames, tinyChainSpec } from "@typeberry/config";
import { Blake2b, HASH_SIZE, type OpaqueHash } from "@typeberry/hash";
import { tryAsU16, tryAsU32, tryAsU64 } from "@typeberry/numbers";
import {
  type AccumulationOutput,
  InMemoryService,
  InMemoryState,
  NotYetAccumulatedReport,
  PreimageItem,
  PrivilegedServices,
  ServiceAccountInfo,
  tryAsPerCore,
} from "@typeberry/state";
import { deepEqual, resultToString } from "@typeberry/utils";
import { Accumulate } from "./accumulate.js";
import type { AccumulateInput, AccumulateState } from "./accumulate-state.js";

let blake2b: Blake2b;

before(async () => {
  blake2b = await Blake2b.createHasher();
});

type TestServiceInfo = {
  lastAccumulation?: TimeSlot;
};

[PvmBackend.BuiltIn, PvmBackend.Ananas].forEach((pvm) => {
  [false, true].forEach((accumulateSequentially) => {
    const options = { pvm, accumulateSequentially };
    describe(`accumulate: ${PvmBackendNames[pvm]} (sequential accumulation: ${accumulateSequentially})`, () => {
      // based on tiny/enqueue_and_unlock_chain_wraps-5.json
      it("should do correct state transition", async () => {
        const entropy = hashFromString<EntropyHash>(
          "0xae85d6635e9ae539d0846b911ec86a27fe000f619b78bcac8a74b77e36f6dbcf",
        );

        const input: AccumulateInput = {
          reports: [
            createWorkReport(hashFromString("0xdf49de52326d7d3c99391cdd32b2ca7c06398e798b520970347160ecf8d9ce32")),
            createWorkReport(hashFromString("0xd3d0ac423a2e9451db2e88bd75cc143b19424747fbcf2696792987436e8722a6")),
          ],
          slot: tryAsTimeSlot(47),
          entropy,
        };

        const services = createServices([
          [
            tryAsServiceId(1729),
            hashFromString("0x3ecc56accce719e5214e8dbb034f49d5cf0c6942da3e5f3f047d1693cc60c74a"),
            preimageBlob,
            { lastAccumulation: undefined },
          ],
        ]);
        const state = InMemoryState.partial(tinyChainSpec, {
          timeslot: tryAsTimeSlot(46),
          services,
          privilegedServices: createPrivilegedServices(tinyChainSpec),
          recentlyAccumulated: tryAsPerEpochBlock(
            [
              [],
              [],
              [],
              [],
              [],
              ["0x04f5f2b6509d847d49487d5db1275e8105225018952c7aec9d2d90f039c50e45"],
              ["0x506524cb141b83715705c05983d17ebc7760c64d2ce81f15b6bc2dd1eeb55551"],
              ["0x7bbdd7961afb2db642f7cdb87021fb053c67d2ac79d69a87fc9fbcf6786e30b9"],
              [],
              ["0x07b08ccece1b01a9202152a6fa99d23cf0160da721374ccaabd40885d8fc15d3"],
              [],
              ["0x9d7588b469d529d9a058c12bef3ce96106babf54aa3ba251066832cd160aa2c6"],
            ].map((x) => HashSet.from(x.map((x) => hashFromString<WorkPackageHash>(x)))),
            tinyChainSpec,
          ),
          accumulationQueue: tryAsPerEpochBlock(
            [
              [],
              [
                createNotAccumulatedWorkReport(
```
