---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/hasher.test.ts#L1-L82
title: packages/jam/transition/hasher.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 5
content_sha: 93975cc5e486424c18ca88ccdd0b04bfe3eebb8bc1f2371745e08491239d8019
language: typescript
---
`packages/jam/transition/hasher.test.ts` (lines 1–82)

```typescript
import { describe, it } from "node:test";

import {
  Extrinsic,
  type ExtrinsicHash,
  tryAsCoreIndex,
  tryAsServiceGas,
  tryAsServiceId,
  tryAsTimeSlot,
  tryAsValidatorIndex,
} from "@typeberry/block";
import { Credential, ReportGuarantee } from "@typeberry/block/guarantees.js";
import { RefineContext, WorkPackageInfo } from "@typeberry/block/refine-context.js";
import { SignedTicket, tryAsTicketAttempt } from "@typeberry/block/tickets.js";
import { WorkPackageSpec, WorkReport } from "@typeberry/block/work-report.js";
import { WorkExecResult, WorkRefineLoad, WorkResult } from "@typeberry/block/work-result.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { Decoder, Encoder } from "@typeberry/codec";
import { asKnownSize } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import { ED25519_SIGNATURE_BYTES } from "@typeberry/crypto";
import { BANDERSNATCH_PROOF_BYTES } from "@typeberry/crypto/bandersnatch.js";
import { Blake2b, HASH_SIZE, keccak } from "@typeberry/hash";
import { tryAsU16, tryAsU32 } from "@typeberry/numbers";
import { asOpaqueType, deepEqual } from "@typeberry/utils";
import { TransitionHasher } from "./hasher.js";

describe("TransitionHasher", () => {
  describe("extrinsic", () => {
    async function prepareHasher() {
      const keccakHasher = await keccak.KeccakHasher.create();
      const blake2b = await Blake2b.createHasher();
      return TransitionHasher.new(keccakHasher, blake2b);
    }

    function prepareExtrinsicView(partialExtrinsic: Partial<Extrinsic>) {
      const spec = tinyChainSpec;
      const extrinsic = Extrinsic.create({
        tickets: partialExtrinsic.tickets ?? asOpaqueType([]),
        preimages: partialExtrinsic.preimages ?? [],
        guarantees: partialExtrinsic.guarantees ?? asOpaqueType([]),
        assurances: partialExtrinsic.assurances ?? asOpaqueType([]),
        disputes: partialExtrinsic.disputes ?? {
          verdicts: [],
          culprits: [],
          faults: [],
        },
      });
      const encodedBlock = Encoder.encodeObject(Extrinsic.Codec, extrinsic, spec);
      return Decoder.decodeObject(Extrinsic.Codec.View, encodedBlock, spec);
    }

    function prepareTickets() {
      return rawTickets.map(({ attempt, signature }) =>
        SignedTicket.create({
          attempt: tryAsTicketAttempt(attempt),
          signature: Bytes.parseBytes(signature, BANDERSNATCH_PROOF_BYTES).asOpaque(),
        }),
      );
    }

    function prepareGuarantees() {
      return rawGuarantees.map(({ report, slot, signatures }) =>
        ReportGuarantee.create({
          report: WorkReport.create({
            workPackageSpec: WorkPackageSpec.create({
              erasureRoot: Bytes.parseBytes(report.package_spec.erasure_root, HASH_SIZE).asOpaque(),
              exportsCount: tryAsU16(report.package_spec.exports_count),
              exportsRoot: Bytes.parseBytes(report.package_spec.exports_root, HASH_SIZE).asOpaque(),
              hash: Bytes.parseBytes(report.package_spec.hash, HASH_SIZE).asOpaque(),
              length: tryAsU32(report.package_spec.length),
            }),
            authorizationGasUsed: tryAsServiceGas(report.auth_gas_used),
            authorizationOutput: BytesBlob.parseBlob(report.auth_output),
            authorizerHash: Bytes.parseBytes(report.authorizer_hash, HASH_SIZE).asOpaque(),
            context: RefineContext.create({
              anchor: Bytes.parseBytes(report.context.anchor, HASH_SIZE).asOpaque(),
              beefyRoot: Bytes.parseBytes(report.context.beefy_root, HASH_SIZE).asOpaque(),
              lookupAnchor: Bytes.parseBytes(report.context.lookup_anchor, HASH_SIZE).asOpaque(),
              lookupAnchorSlot: tryAsTimeSlot(report.context.lookup_anchor_slot),
              prerequisites: report.context.prerequisites.map((p) => Bytes.parseBytes(p, HASH_SIZE).asOpaque()),
              stateRoot: Bytes.parseBytes(report.context.state_root, HASH_SIZE).asOpaque(),
```
