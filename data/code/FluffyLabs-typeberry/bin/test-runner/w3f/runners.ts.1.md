---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/runners.ts#L73-L106
title: bin/test-runner/w3f/runners.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 2
content_sha: 34f476b66663251cdb68a463404d5678da405e4681d65bd0c06b43eff0f3eb30
language: typescript
---
`bin/test-runner/w3f/runners.ts` (lines 73–106)

```typescript
  runner("statistics/tiny", runStatisticsTestTiny, tiny).fromJson(StatisticsTestTiny.fromJson),
  runner("statistics/full", runStatisticsTestFull, full).fromJson(StatisticsTestFull.fromJson),
  runner("trie", runTrieTest).fromJson(trieTestSuiteFromJson),
  runner("traces", runStateTransition)
    .fromJson(StateTransition.fromJson)
    .fromBin(StateTransition.Codec)
    .withVariants(pvms),
  runner("crypto/ed25519", runEd25519Test).fromJson(ed25519TestsFromJson),
].map((b) => b.build());

function codecRunners(flavor: "tiny" | "full") {
  const spec = flavor === "tiny" ? tinyChainSpec : fullChainSpec;
  return [
    runner(`codec/${flavor}/assurances_extrinsic`, runAssurancesExtrinsicTest, [spec]).fromJson(
      getAssurancesExtrinsicFromJson(spec),
    ),
    runner(`codec/${flavor}/block`, runBlockTest, [spec]).fromJson(blockFromJson(spec)),
    runner(`codec/${flavor}/disputes_extrinsic`, runDisputesExtrinsicTest, [spec]).fromJson(disputesExtrinsicFromJson),
    runner(`codec/${flavor}/extrinsic`, runExtrinsicTest, [spec]).fromJson(getExtrinsicFromJson(spec)),
    runner(`codec/${flavor}/guarantees_extrinsic`, runGuaranteesExtrinsicTest, [spec]).fromJson(
      guaranteesExtrinsicFromJson,
    ),
    runner(`codec/${flavor}/header`, runHeaderTest, [spec]).fromJson(headerFromJson),
    runner(`codec/${flavor}/preimages_extrinsic`, runPreimagesExtrinsicTest, [spec]).fromJson(
      preimagesExtrinsicFromJson,
    ),
    runner(`codec/${flavor}/refine_context`, runRefineContextTest, [spec]).fromJson(refineContextFromJson),
    runner(`codec/${flavor}/tickets_extrinsic`, runTicketsExtrinsicTest, [spec]).fromJson(ticketsExtrinsicFromJson),
    runner(`codec/${flavor}/work_item`, runWorkItemTest, [spec]).fromJson(workItemFromJson),
    runner(`codec/${flavor}/work_package`, runWorkPackageTest, [spec]).fromJson(workPackageFromJson),
    runner(`codec/${flavor}/work_report`, runWorkReportTest, [spec]).fromJson(workReportFromJson),
    runner(`codec/${flavor}/work_result`, runWorkResultTest, [spec]).fromJson(workResultFromJson),
  ];
}
```
