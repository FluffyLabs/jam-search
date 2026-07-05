---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/runners.ts#L1-L76
title: bin/test-runner/w3f/runners.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 2
content_sha: b0d9bed45fd488b2d00fe498dbd2453887d307d8bd226b64784833e2e4504ffa
language: typescript
---
`bin/test-runner/w3f/runners.ts` (lines 1–76)

```typescript
import {
  blockFromJson,
  disputesExtrinsicFromJson,
  getAssurancesExtrinsicFromJson,
  getExtrinsicFromJson,
  guaranteesExtrinsicFromJson,
  headerFromJson,
  preimagesExtrinsicFromJson,
  refineContextFromJson,
  ticketsExtrinsicFromJson,
  workReportFromJson,
  workResultFromJson,
} from "@typeberry/block-json";
import { fullChainSpec, tinyChainSpec } from "@typeberry/config";
import { StateTransition } from "@typeberry/state-vectors";
import { runner, SelectedPvm } from "../common.js";
import { runStateTransition } from "../state-transition/state-transition.js";
import { AccumulateTest, runAccumulateTest } from "./accumulate.js";
import { AssurancesTestFull, AssurancesTestTiny, runAssurancesTestFull, runAssurancesTestTiny } from "./assurances.js";
import { AuthorizationsTest, runAuthorizationsTest } from "./authorizations.js";
import {
  runAssurancesExtrinsicTest,
  runBlockTest,
  runDisputesExtrinsicTest,
  runExtrinsicTest,
  runGuaranteesExtrinsicTest,
  runHeaderTest,
  runPreimagesExtrinsicTest,
  runRefineContextTest,
  runTicketsExtrinsicTest,
  runWorkReportTest,
  runWorkResultTest,
} from "./codec/index.js";
import { runWorkItemTest, workItemFromJson } from "./codec/work-item.js";
import { runWorkPackageTest, workPackageFromJson } from "./codec/work-package.js";
import { DisputesTest, runDisputesTest } from "./disputes.js";
import { ed25519TestsFromJson, runEd25519Test } from "./ed25519.js";
import { EcTest, runEcTest } from "./erasure-coding.js";
import { PreImagesTest, runPreImagesTest } from "./preimages.js";
import { PvmTest, runPvmTest } from "./pvm.js";
import { PvmGasCostTest, runPvmGasCostTest } from "./pvm-gas-cost.js";
import { HistoryTest, runHistoryTest } from "./recent-history.js";
import { ReportsTest, runReportsTest } from "./reports.js";
import { runSafroleTest, SafroleTest } from "./safrole.js";
import { ignoreSchemaFiles, JsonSchema } from "./schema.js";
import { runShufflingTests, shufflingTestsFromJson } from "./shuffling.js";
import { runStatisticsTestFull, runStatisticsTestTiny, StatisticsTestFull, StatisticsTestTiny } from "./statistics.js";
import { runTrieTest, trieTestSuiteFromJson } from "./trie.js";

const pvms: SelectedPvm[] = [SelectedPvm.Ananas, SelectedPvm.Builtin];
const tiny = [tinyChainSpec];
const full = [fullChainSpec];
const tinyFull = [...tiny, ...full];

export const runners = [
  runner("accumulate", runAccumulateTest, tinyFull).fromJson(AccumulateTest.fromJson).withVariants(pvms),
  runner("assurances/tiny", runAssurancesTestTiny, tiny).fromJson(AssurancesTestTiny.fromJson),
  runner("assurances/full", runAssurancesTestFull, full).fromJson(AssurancesTestFull.fromJson),
  runner("authorizations", runAuthorizationsTest, tinyFull).fromJson(AuthorizationsTest.fromJson),
  ...codecRunners("tiny"),
  ...codecRunners("full"),
  runner("disputes", runDisputesTest, tinyFull).fromJson(DisputesTest.fromJson),
  runner("erasure_coding", runEcTest, tinyFull).fromJson(EcTest.fromJson),
  runner("history", runHistoryTest, tinyFull).fromJson(HistoryTest.fromJson),
  runner("schema", ignoreSchemaFiles).fromJson(JsonSchema.fromJson), // ignore schema files
  runner("preimages", runPreImagesTest, tinyFull).fromJson(PreImagesTest.fromJson),
  runner("pvm", runPvmTest).fromJson(PvmTest.fromJson),
  runner("gas-cost-tests", runPvmGasCostTest).fromJson(PvmGasCostTest.fromJson),
  runner("reports", runReportsTest, tinyFull).fromJson(ReportsTest.fromJson),
  runner("safrole", runSafroleTest, tiny).fromJson(SafroleTest.fromJson),
  runner("safrole", runSafroleTest, full).fromJson(SafroleTest.fromJson),
  runner("shuffle", runShufflingTests).fromJson(shufflingTestsFromJson),
  runner("statistics/tiny", runStatisticsTestTiny, tiny).fromJson(StatisticsTestTiny.fromJson),
  runner("statistics/full", runStatisticsTestFull, full).fromJson(StatisticsTestFull.fromJson),
  runner("trie", runTrieTest).fromJson(trieTestSuiteFromJson),
  runner("traces", runStateTransition)
```
