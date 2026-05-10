---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/assurances.test.ts#L1-L114
title: packages/jam/transition/assurances.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 4
content_sha: 668684bfb65f2a56918b11f9a32dbf1312a13f68abc8ce08ecabd30ab14fa678
language: typescript
---
`packages/jam/transition/assurances.test.ts` (lines 1–114)

```typescript
import assert from "node:assert";
import { before, describe, it } from "node:test";
import {
  type HeaderHash,
  reencodeAsView,
  tryAsCoreIndex,
  tryAsPerValidator,
  tryAsTimeSlot,
  tryAsValidatorIndex,
} from "@typeberry/block";
import {
  type AssurancesExtrinsicView,
  AvailabilityAssurance,
  assurancesExtrinsicCodec,
} from "@typeberry/block/assurances.js";
import { testWorkReportHex } from "@typeberry/block/test-helpers.js";
import { WorkReport } from "@typeberry/block/work-report.js";
import { BitVec, Bytes, BytesBlob } from "@typeberry/bytes";
import { Decoder } from "@typeberry/codec";
import { type ChainSpec, tinyChainSpec } from "@typeberry/config";
import {
  BANDERSNATCH_KEY_BYTES,
  BLS_KEY_BYTES,
  ED25519_KEY_BYTES,
  ED25519_SIGNATURE_BYTES,
  initWasm,
} from "@typeberry/crypto";
import { Blake2b, HASH_SIZE } from "@typeberry/hash";
import {
  AvailabilityAssignment,
  type State,
  tryAsPerCore,
  VALIDATOR_META_BYTES,
  ValidatorData,
} from "@typeberry/state";
import { asOpaqueType, deepEqual } from "@typeberry/utils";
import { Assurances, AssurancesError, type AssurancesInput } from "./assurances.js";
import { copyAndUpdateState } from "./test.utils.js";

let blake2b: Blake2b;

before(async () => {
  await initWasm();
  blake2b = await Blake2b.createHasher();
});

function assurancesAsView(spec: ChainSpec, assurances: AvailabilityAssurance[]): AssurancesExtrinsicView {
  return reencodeAsView(assurancesExtrinsicCodec, asOpaqueType(assurances), spec);
}

const DEFAULT_HEADER_HASH: HeaderHash = Bytes.parseBytes(
  "0xd61a38a0f73beda90e8c1dfba731f65003742539f4260694f44e22cabef24a8e",
  HASH_SIZE,
).asOpaque();

describe("Assurances", () => {
  const testAssignment = (
    data: (AvailabilityAssignment | null)[] = INITIAL_ASSIGNMENT.slice(),
  ): State["availabilityAssignment"] => tryAsPerCore(data, tinyChainSpec);

  it("should perform a transition with empty state", async () => {
    const initialState = {
      availabilityAssignment: testAssignment([null, null]),
      currentValidatorData: tryAsPerValidator(VALIDATORS, tinyChainSpec),
    };
    const assurances = new Assurances(tinyChainSpec, initialState, blake2b);

    const input: AssurancesInput = {
      parentHash: DEFAULT_HEADER_HASH,
      slot: tryAsTimeSlot(12),
      assurances: assurancesAsView(tinyChainSpec, []),
      disputesAvailAssignment: initialState.availabilityAssignment,
    };

    const res = await assurances.transition(input);

    assert.strictEqual(res.isOk, true);
    deepEqual(res.ok.availableReports, []);
    const state = copyAndUpdateState(assurances.state, res.ok.stateUpdate);
    deepEqual(state, {
      availabilityAssignment: testAssignment([null, null]),
      currentValidatorData: tryAsPerValidator(VALIDATORS, tinyChainSpec),
    });
  });

  it("should perform some transition", async () => {
    const initialState = {
      availabilityAssignment: testAssignment([null, null]),
      currentValidatorData: tryAsPerValidator(VALIDATORS, tinyChainSpec),
    };
    const assurances = new Assurances(tinyChainSpec, initialState, blake2b);

    const input: AssurancesInput = {
      parentHash: DEFAULT_HEADER_HASH,
      slot: tryAsTimeSlot(12),
      assurances: assurancesAsView(
        tinyChainSpec,
        [
          {
            bitfield: "0x02",
            validatorIndex: 0,
            signature:
              "0x8ca67779a98b2cb44a45082ec9fd9222462b8310115e23df0b4df9959efe90055009dc9c11da1ae59abd076aeb455b4e82883fd0cf35f69ba2cb0f3a8ee3800e",
          },
          {
            bitfield: "0x01",
            validatorIndex: 1,
            signature:
              "0x08a112654c32d117fb4ceb0e6a7edf92e4de6cb27532d3ceda8bb2fcf8337aeec85a734f7c36531b61e34570a3e090ffe8ab1839f412eaebde451aabf786a500",
          },
          {
            bitfield: "0x03",
            validatorIndex: 2,
            signature:
```
