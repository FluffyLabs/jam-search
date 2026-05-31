---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/test.utils.ts#L1-L107
title: packages/jam/transition/reports/test.utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 4
content_sha: d2795a753ec03c9dc966eefe2e8993373583fd440d2c037b0a8f9be67810f04c
language: typescript
---
`packages/jam/transition/reports/test.utils.ts` (lines 1–107)

```typescript
import {
  reencodeAsView,
  type ServiceId,
  type TimeSlot,
  tryAsCoreIndex,
  tryAsPerEpochBlock,
  tryAsServiceGas,
  tryAsServiceId,
  tryAsTimeSlot,
  tryAsValidatorIndex,
} from "@typeberry/block";
import { codecKnownSizeArray, codecWithContext } from "@typeberry/block/codec-utils.js";
import {
  Credential,
  GuaranteesExtrinsicBounds,
  type GuaranteesExtrinsicView,
  guaranteesExtrinsicCodec,
  ReportGuarantee,
} from "@typeberry/block/guarantees.js";
import { RefineContext, type WorkPackageHash, type WorkPackageInfo } from "@typeberry/block/refine-context.js";
import { testWorkReportHex } from "@typeberry/block/test-helpers.js";
import { WorkReport } from "@typeberry/block/work-report.js";
import { WorkExecResult, WorkRefineLoad, WorkResult } from "@typeberry/block/work-result.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { codec, Decoder } from "@typeberry/codec";
import { asKnownSize, FixedSizeArray, HashDictionary } from "@typeberry/collections";
import { HashSet } from "@typeberry/collections/hash-set.js";
import { type ChainSpec, tinyChainSpec } from "@typeberry/config";
import {
  BANDERSNATCH_KEY_BYTES,
  BLS_KEY_BYTES,
  ED25519_KEY_BYTES,
  ED25519_SIGNATURE_BYTES,
  type Ed25519Signature,
} from "@typeberry/crypto";
import { Blake2b, HASH_SIZE, type OpaqueHash } from "@typeberry/hash";
import { tryAsU32, tryAsU64 } from "@typeberry/numbers";
import type { AuthorizationPool, NotYetAccumulatedReport, PerCore } from "@typeberry/state";
import {
  AvailabilityAssignment,
  ENTROPY_ENTRIES,
  InMemoryService,
  InMemoryState,
  ServiceAccountInfo,
  tryAsPerCore,
  VALIDATOR_META_BYTES,
  ValidatorData,
} from "@typeberry/state";
import { RecentBlocks } from "@typeberry/state/recent-blocks.js";
import { asOpaqueType } from "@typeberry/utils";
import type { HeaderChain } from "./input.js";
import { Reports, type ReportsState } from "./reports.js";

export const ENTROPY = getEntropy(1, 2, 3, 4);

type WorkReportOptions = {
  core: number;
  authorizer?: OpaqueHash;
  anchorBlock?: OpaqueHash;
  stateRoot?: OpaqueHash;
  beefyRoot?: OpaqueHash;
  lookupAnchorSlot?: TimeSlot;
  lookupAnchor?: OpaqueHash;
  prerequisites?: OpaqueHash[];
  resultSize?: number;
};

export function newWorkReport({
  core,
  authorizer,
  anchorBlock,
  stateRoot,
  beefyRoot,
  lookupAnchorSlot,
  lookupAnchor,
  prerequisites,
  resultSize,
}: WorkReportOptions): WorkReport {
  const source = BytesBlob.parseBlob(testWorkReportHex());
  const report = Decoder.decodeObject(WorkReport.Codec, source, tinyChainSpec);
  const context = RefineContext.create({
    anchor: anchorBlock !== undefined ? anchorBlock.asOpaque() : report.context.anchor,
    stateRoot: stateRoot !== undefined ? stateRoot.asOpaque() : report.context.stateRoot,
    beefyRoot: beefyRoot !== undefined ? beefyRoot.asOpaque() : report.context.beefyRoot,
    lookupAnchor: lookupAnchor !== undefined ? lookupAnchor.asOpaque() : report.context.lookupAnchor,
    lookupAnchorSlot: lookupAnchorSlot ?? report.context.lookupAnchorSlot,
    prerequisites: prerequisites !== undefined ? prerequisites.map((x) => x.asOpaque()) : report.context.prerequisites,
  });
  return WorkReport.create({
    workPackageSpec: report.workPackageSpec,
    context,
    coreIndex: tryAsCoreIndex(core),
    authorizerHash: authorizer !== undefined ? authorizer.asOpaque() : report.authorizerHash,
    authorizationOutput: report.authorizationOutput,
    segmentRootLookup: report.segmentRootLookup,
    results: FixedSizeArray.new(
      report.results.map((x) =>
        WorkResult.create({
          serviceId: x.serviceId,
          codeHash: x.codeHash,
          payloadHash: x.payloadHash,
          gas: x.gas,
          result: resultSize !== undefined ? WorkExecResult.ok(Bytes.fill(resultSize, 0)) : x.result,
          load: WorkRefineLoad.create({
            gasUsed: tryAsServiceGas(5),
            importedSegments: tryAsU32(0),
            exportedSegments: tryAsU32(0),
```
