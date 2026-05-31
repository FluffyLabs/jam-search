---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-json/dump.ts#L1-L113
title: packages/jam/state-json/dump.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 7ea0505e7421ce68f344760c0d705539fd192ca1c957439972cc33f49b1a73a5
language: typescript
---
`packages/jam/state-json/dump.ts` (lines 1–113)

```typescript
import { type EntropyHash, type PerEpochBlock, tryAsPerEpochBlock, tryAsServiceGas } from "@typeberry/block";
import type { AuthorizerHash, WorkPackageHash } from "@typeberry/block/refine-context.js";
import { fromJson } from "@typeberry/block-json";
import { Bytes } from "@typeberry/bytes";
import { asKnownSize, HashSet, SortedArray } from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import { BANDERSNATCH_RING_ROOT_BYTES } from "@typeberry/crypto/bandersnatch.js";
import { json } from "@typeberry/json-parser";
import {
  type AccumulationOutput,
  AUTHORIZATION_QUEUE_SIZE,
  accumulationOutputComparator,
  type InMemoryService,
  InMemoryState,
  MAX_AUTH_POOL_SIZE,
  PrivilegedServices,
  RecentBlocks,
  type State,
  tryAsPerCore,
} from "@typeberry/state";
import { JsonServicePre072 } from "./accounts.js";
import { accumulationOutput } from "./accumulation-output.js";
import { availabilityAssignmentFromJson } from "./availability-assignment.js";
import { disputesRecordsFromJson } from "./disputes.js";
import { notYetAccumulatedFromJson } from "./not-yet-accumulated.js";
import { recentBlocksHistoryFromJson } from "./recent-history.js";
import { TicketsOrKeys, ticketFromJson } from "./safrole.js";
import { JsonStatisticsData } from "./statistics.js";
import { validatorDataFromJson } from "./validator-data.js";

// NOTE State in line with GP ^0.7.0
type JsonStateDump = {
  alpha: AuthorizerHash[][];
  varphi: AuthorizerHash[][];
  beta: State["recentBlocks"] | null;
  gamma: {
    gamma_k: State["nextValidatorData"];
    gamma_z: State["epochRoot"];
    gamma_s: TicketsOrKeys;
    gamma_a: State["ticketsAccumulator"];
  };
  psi: State["disputesRecords"];
  eta: State["entropy"];
  iota: State["designatedValidatorData"];
  kappa: State["currentValidatorData"];
  lambda: State["previousValidatorData"];
  rho: State["availabilityAssignment"];
  tau: State["timeslot"];
  chi: {
    chi_m: PrivilegedServices["manager"];
    chi_a: PrivilegedServices["assigners"];
    chi_v: PrivilegedServices["delegator"];
    chi_r: PrivilegedServices["registrar"];
    chi_g: PrivilegedServices["autoAccumulateServices"] | null;
  };
  pi: JsonStatisticsData;
  omega: State["accumulationQueue"];
  xi: PerEpochBlock<WorkPackageHash[]>;
  theta: AccumulationOutput[] | null;
  accounts: InMemoryService[];
};

export const fullStateDumpFromJson = (spec: ChainSpec) =>
  json.object<JsonStateDump, InMemoryState>(
    {
      alpha: json.array(json.array(fromJson.bytes32<AuthorizerHash>())),
      varphi: json.array(json.array(fromJson.bytes32<AuthorizerHash>())),
      beta: json.nullable(recentBlocksHistoryFromJson),
      gamma: {
        gamma_k: json.array(validatorDataFromJson),
        gamma_a: json.array(ticketFromJson),
        gamma_s: TicketsOrKeys.fromJson(),
        gamma_z: json.fromString((v) => Bytes.parseBytes(v, BANDERSNATCH_RING_ROOT_BYTES).asOpaque()),
      },
      psi: disputesRecordsFromJson,
      eta: json.array(fromJson.bytes32<EntropyHash>()),
      iota: json.array(validatorDataFromJson),
      kappa: json.array(validatorDataFromJson),
      lambda: json.array(validatorDataFromJson),
      rho: json.array(json.nullable(availabilityAssignmentFromJson)),
      tau: "number",
      chi: {
        chi_m: "number",
        chi_a: json.array("number"),
        chi_v: "number",
        chi_r: "number",
        chi_g: json.nullable(
          json.map(
            "number",
            json.fromNumber((v) => tryAsServiceGas(v)),
          ),
        ),
      },
      pi: JsonStatisticsData.fromJson,
      omega: json.array(json.array(notYetAccumulatedFromJson)),
      xi: json.array(json.array(fromJson.bytes32())),
      theta: json.nullable(json.array(accumulationOutput)),
      accounts: json.array(JsonServicePre072.fromJson),
    },
    ({
      alpha,
      varphi,
      beta,
      gamma,
      psi,
      eta,
      iota,
      kappa,
      lambda,
      rho,
      tau,
      chi,
      pi,
```
