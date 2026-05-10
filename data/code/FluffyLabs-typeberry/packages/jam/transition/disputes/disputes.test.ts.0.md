---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/disputes.test.ts#L1-L89
title: packages/jam/transition/disputes/disputes.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 2
content_sha: 4d220289c1330be16e197e5af5c901b8ef6dbe2e42b4e676f291ff1063cfc8d4
language: typescript
---
`packages/jam/transition/disputes/disputes.test.ts` (lines 1–89)

```typescript
import assert from "node:assert";
import { before, describe, it } from "node:test";
import { tryAsTimeSlot } from "@typeberry/block";
import { DisputesExtrinsic } from "@typeberry/block/disputes.js";
import { WorkReport } from "@typeberry/block/work-report.js";
import { Bytes } from "@typeberry/bytes";
import { Encoder } from "@typeberry/codec";
import { SortedSet } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import { ED25519_KEY_BYTES, type Ed25519Key, initWasm } from "@typeberry/crypto";
import { Blake2b, HASH_SIZE } from "@typeberry/hash";
import { AvailabilityAssignment, DisputesRecords, hashComparator, tryAsPerCore } from "@typeberry/state";
import { resultToString } from "@typeberry/utils";
import { Disputes } from "./disputes.js";
import * as testData from "./disputes.test.data.js";
import * as testData2 from "./disputes.test.data2.js";
import type { DisputesState } from "./disputes-state.js";

const createOffender = (blob: string): Ed25519Key => Bytes.parseBytes(blob, ED25519_KEY_BYTES).asOpaque();

describe("Disputes", () => {
  let blake2b: Blake2b;
  before(async () => {
    await initWasm();
    blake2b = await Blake2b.createHasher();
  });

  const preState: DisputesState = {
    disputesRecords: DisputesRecords.create({
      goodSet: SortedSet.fromArray(hashComparator),
      badSet: SortedSet.fromArray(hashComparator),
      wonkySet: SortedSet.fromArray(hashComparator),
      punishSet: SortedSet.fromArray(hashComparator),
    }),
    timeslot: tryAsTimeSlot(0),
    availabilityAssignment: tryAsPerCore([null, null], tinyChainSpec),
    currentValidatorData: testData.currentValidatorData,
    previousValidatorData: testData.previousValidatorData,
  };

  it("should perform correct state transition and return offenders", async () => {
    const disputes = new Disputes(tinyChainSpec, blake2b, preState);
    const { verdicts, culprits, faults } = testData;
    const disputesExtrinsic = DisputesExtrinsic.create({ verdicts, culprits, faults });
    const offenders = [
      "0x22351e22105a19aabb42589162ad7f1ea0df1c25cebf0e4a9fcd261301274862",
      "0xe68e0cf7f26c59f963b5846202d2327cc8bc0c4eff8cb9abd4012f9a71decf00",
      "0x3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29",
    ].map(createOffender);

    const result = await disputes.transition(disputesExtrinsic);
    const ok = result.isOk ? Array.from(result.ok.offendersMark) : undefined;

    assert.strictEqual(`${resultToString(result)}`, "OK: [object Object]");
    assert.deepStrictEqual(ok, offenders);
  });

  it("should return incorrect validator index error", async () => {
    const { verdictsWithIncorrectValidatorIndex, culprits, faults } = testData;
    const disputes = new Disputes(tinyChainSpec, blake2b, preState);
    const disputesExtrinsic = DisputesExtrinsic.create({
      verdicts: verdictsWithIncorrectValidatorIndex,
      culprits,
      faults,
    });

    const result = await disputes.transition(disputesExtrinsic);
    const ok = result.isOk ? Array.from(result.ok.offendersMark) : undefined;

    assert.strictEqual(
      `${resultToString(result)}`,
      "Bad validator index in signature verification: 65000\nError: bad_validator_index",
    );
    assert.strictEqual(ok, undefined);
  });

  // NOTE [ToDr] This test is so far disabled for 0.7.0+ because we need
  // to get the test data for it from w3f test vectors or regenerate the current
  // data.
  it.skip("should clear work-reports which were judged as invalid", async () => {
    const workReport0 = testData2.workReport(
      Bytes.parseBytes("0x11da6d1f761ddf9bdb4c9d6e5303ebd41f61858d0a5647a1a7bfe089bf921be9", HASH_SIZE).asOpaque(),
      0,
    );
    const workReport1 = testData2.workReport(
      Bytes.parseBytes("0xe12c22d4f162d9a012c9319233da5d3e923cc5e1029b8f90e47249c9ab256b35", HASH_SIZE).asOpaque(),
      1,
    );

```
