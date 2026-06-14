---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/test.utils.ts#L1-L127
title: packages/jam/state/test.utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 47
content_sha: fb1aefb9be1203ce17bcdbc7cfe881f9ee5bb8d8141ed53f524c581e413dbfef
language: typescript
---
`packages/jam/state/test.utils.ts` (lines 1–127)

```typescript
import {
  codecPerValidator,
  tryAsPerEpochBlock,
  tryAsPerValidator,
  tryAsServiceGas,
  tryAsServiceId,
  tryAsTimeSlot,
  type WorkReportHash,
} from "@typeberry/block";
import type { AuthorizerHash } from "@typeberry/block/refine-context.js";
import { Ticket, tryAsTicketAttempt } from "@typeberry/block/tickets.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { Decoder } from "@typeberry/codec";
import { asKnownSize, FixedSizeArray, HashDictionary, HashSet, SortedArray, SortedSet } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import type { Ed25519Key } from "@typeberry/crypto";
import { BANDERSNATCH_RING_ROOT_BYTES } from "@typeberry/crypto/bandersnatch.js";
import { HASH_SIZE } from "@typeberry/hash";
import { MAX_VALUE_U32, tryAsU16, tryAsU32, tryAsU64 } from "@typeberry/numbers";
import {
  AUTHORIZATION_QUEUE_SIZE,
  AvailabilityAssignment,
  accumulationOutputComparator,
  BlockState,
  CoreStatistics,
  DisputesRecords,
  ENTROPY_ENTRIES,
  hashComparator,
  InMemoryService,
  InMemoryState,
  LookupHistoryItem,
  PreimageItem,
  PrivilegedServices,
  RecentBlocks,
  SafroleSealingKeysData,
  ServiceAccountInfo,
  ServiceStatistics,
  StatisticsData,
  tryAsPerCore,
  ValidatorData,
  ValidatorStatistics,
} from "./index.js";

const spec = tinyChainSpec;

// based on jamduna/assurances/state_snapshots/1_004.json
export const testState = (): InMemoryState => {
  const state = InMemoryState.new(spec, {
    // rho
    availabilityAssignment: tryAsPerCore(
      [
        Decoder.decodeObject(AvailabilityAssignment.Codec, BytesBlob.parseBlob(TEST_AVAILABILITY_ASSIGNMENT), spec),
        null,
      ],
      spec,
    ),
    // iota
    designatedValidatorData: testValidatorData(),
    // gamma_k
    nextValidatorData: testValidatorData(),
    // kappa
    currentValidatorData: testValidatorData(),
    // lambda
    previousValidatorData: testValidatorData(),
    // psi
    disputesRecords: DisputesRecords.create({
      goodSet: SortedSet.fromArray<WorkReportHash>(hashComparator),
      badSet: SortedSet.fromArray<WorkReportHash>(hashComparator),
      wonkySet: SortedSet.fromArray<WorkReportHash>(hashComparator),
      punishSet: SortedSet.fromArray<Ed25519Key>(hashComparator),
    }),
    // tau
    timeslot: tryAsTimeSlot(16),
    // eta
    entropy: FixedSizeArray.new(
      [
        b32("0x592170100ab4055c92a269faf579e29e7e453d13549c0dc4f0120fc670ff357d"),
        b32("0x6f6ad2224d7d58aec6573c623ab110700eaca20a48dc2965d535e466d524af2a"),
        b32("0x835ac82bfa2ce8390bb50680d4b7a73dfa2a4cff6d8c30694b24a605f9574eaf"),
        b32("0xd2d34655ebcad804c56d2fd5f932c575b6a5dbb3f5652c5202bcc75ab9c2cc95"),
      ],
      ENTROPY_ENTRIES,
    ),
    // alpha
    authPools: tryAsPerCore(
      [
        asKnownSize([
          emptyHash(),
          emptyHash(),
          emptyHash(),
          emptyHash(),
          testAuth(),
          testAuth(),
          testAuth(),
          testAuth(),
        ]),
        asKnownSize([
          emptyHash(),
          emptyHash(),
          emptyHash(),
          testAuth(),
          testAuth(),
          testAuth(),
          testAuth(),
          testAuth(),
        ]),
      ],
      spec,
    ),
    // varphi
    authQueues: tryAsPerCore(
      [
        asKnownSize(repeat<AuthorizerHash>(AUTHORIZATION_QUEUE_SIZE, testAuth)),
        asKnownSize(repeat<AuthorizerHash>(AUTHORIZATION_QUEUE_SIZE, testAuth)),
      ],
      spec,
    ),
    // beta
    recentBlocks: RecentBlocks.create({
      blocks: asKnownSize([
        BlockState.create({
          headerHash: b32("0xc83b057ac60f3029edafc4a005f97c965ab8c2c19f3e4469c6e280356737d07c"),
          accumulationResult: emptyHash(),
          postStateRoot: b32("0x59642abe3120e645f4cda9e464d1e594743f146404dd948f146cf5daf2e99660"),
          reported: HashDictionary.new(),
        }),
        BlockState.create({
```
