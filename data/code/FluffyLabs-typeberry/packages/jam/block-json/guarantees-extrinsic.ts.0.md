---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block-json/guarantees-extrinsic.ts#L1-L32
title: packages/jam/block-json/guarantees-extrinsic.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 7d5e2ba80211a980268874694dcca754f932619351687a997bc302d6ce6dcf44
language: typescript
---
`packages/jam/block-json/guarantees-extrinsic.ts` (lines 1–32)

```typescript
import type { TimeSlot } from "@typeberry/block";
import { Credential, ReportGuarantee } from "@typeberry/block/guarantees.js";
import type { WorkReport } from "@typeberry/block/work-report.js";
import { json } from "@typeberry/json-parser";
import { fromJson } from "./common.js";
import type { JsonObject } from "./json-format.js";
import { workReportFromJson } from "./work-report.js";

const validatorSignatureFromJson = json.object<JsonObject<Credential>, Credential>(
  {
    validator_index: "number",
    signature: fromJson.ed25519Signature,
  },
  ({ validator_index, signature }) => Credential.create({ validatorIndex: validator_index, signature }),
);

const reportGuaranteeFromJson = json.object<JsonReportGuarantee, ReportGuarantee>(
  {
    report: workReportFromJson,
    slot: "number",
    signatures: json.array(validatorSignatureFromJson),
  },
  ({ report, slot, signatures }) => ReportGuarantee.create({ report, slot, credentials: signatures }),
);

type JsonReportGuarantee = {
  report: WorkReport;
  slot: TimeSlot;
  signatures: ReportGuarantee["credentials"];
};

export const guaranteesExtrinsicFromJson = json.array(reportGuaranteeFromJson);
```
