---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/codec/index.ts#L1-L56
title: bin/test-runner/w3f/codec/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 9f6f43b0e5a3d00b2870bef72b5633743b51d5f0d87caec9f28608ceabeda268
language: typescript
---
`bin/test-runner/w3f/codec/index.ts` (lines 1–56)

```typescript
import { Header } from "@typeberry/block";
import { type AssurancesExtrinsic, assurancesExtrinsicCodec } from "@typeberry/block/assurances.js";
import { Block, Extrinsic } from "@typeberry/block/block.js";
import { DisputesExtrinsic } from "@typeberry/block/disputes.js";
import { type GuaranteesExtrinsic, guaranteesExtrinsicCodec } from "@typeberry/block/guarantees.js";
import { type PreimagesExtrinsic, preimagesExtrinsicCodec } from "@typeberry/block/preimage.js";
import { RefineContext } from "@typeberry/block/refine-context.js";
import { type TicketsExtrinsic, ticketsExtrinsicCodec } from "@typeberry/block/tickets.js";
import { WorkReport } from "@typeberry/block/work-report.js";
import { WorkResult } from "@typeberry/block/work-result.js";
import type { RunOptions } from "../../common.js";
import { runCodecTest } from "./common.js";

export async function runAssurancesExtrinsicTest(test: AssurancesExtrinsic, { path: file }: RunOptions) {
  runCodecTest(assurancesExtrinsicCodec, test, file);
}

export async function runBlockTest(test: Block, { path: file }: RunOptions) {
  runCodecTest(Block.Codec, test, file);
}

export async function runDisputesExtrinsicTest(test: DisputesExtrinsic, { path: file }: RunOptions) {
  runCodecTest(DisputesExtrinsic.Codec, test, file);
}

export async function runExtrinsicTest(test: Extrinsic, { path: file }: RunOptions) {
  runCodecTest(Extrinsic.Codec, test, file);
}

export async function runGuaranteesExtrinsicTest(test: GuaranteesExtrinsic, { path: file }: RunOptions) {
  runCodecTest(guaranteesExtrinsicCodec, test, file);
}

export async function runHeaderTest(test: Header, { path: file }: RunOptions) {
  runCodecTest(Header.Codec, test, file);
}

export async function runPreimagesExtrinsicTest(test: PreimagesExtrinsic, { path: file }: RunOptions) {
  runCodecTest(preimagesExtrinsicCodec, test, file);
}

export async function runRefineContextTest(test: RefineContext, { path: file }: RunOptions) {
  runCodecTest(RefineContext.Codec, test, file);
}

export async function runTicketsExtrinsicTest(test: TicketsExtrinsic, { path: file }: RunOptions) {
  runCodecTest(ticketsExtrinsicCodec, test, file);
}

export async function runWorkReportTest(test: WorkReport, { path: file }: RunOptions) {
  runCodecTest(WorkReport.Codec, test, file);
}

export async function runWorkResultTest(test: WorkResult, { path: file }: RunOptions) {
  runCodecTest(WorkResult.Codec, test, file);
}
```
