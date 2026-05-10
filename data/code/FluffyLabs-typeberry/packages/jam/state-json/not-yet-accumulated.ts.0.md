---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-json/not-yet-accumulated.ts#L1-L11
title: packages/jam/state-json/not-yet-accumulated.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 93fb1b8a68c65eafe3203401aca8b80e64095b0ded2edaca55bba3d19fc933d6
language: typescript
---
`packages/jam/state-json/not-yet-accumulated.ts` (lines 1–11)

```typescript
import { fromJson, workReportFromJson } from "@typeberry/block-json";
import { json } from "@typeberry/json-parser";
import { NotYetAccumulatedReport } from "@typeberry/state/accumulation-queue.js";

export const notYetAccumulatedFromJson = json.object<NotYetAccumulatedReport>(
  {
    report: workReportFromJson,
    dependencies: json.array(fromJson.bytes32()),
  },
  ({ report, dependencies }) => NotYetAccumulatedReport.create({ report, dependencies }),
);
```
