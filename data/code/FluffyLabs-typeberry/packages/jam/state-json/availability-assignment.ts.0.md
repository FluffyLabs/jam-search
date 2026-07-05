---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-json/availability-assignment.ts#L1-L20
title: packages/jam/state-json/availability-assignment.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2c2998c58abf013aea5a6bbd5719adaaf84b46b8419aa9162efdf54b2d0e7b2f
language: typescript
---
`packages/jam/state-json/availability-assignment.ts` (lines 1–20)

```typescript
import type { TimeSlot } from "@typeberry/block";
import type { WorkReport } from "@typeberry/block/work-report.js";
import { workReportFromJson } from "@typeberry/block-json";
import { json } from "@typeberry/json-parser";
import { AvailabilityAssignment } from "@typeberry/state";

export const availabilityAssignmentFromJson = json.object<JsonAvailabilityAssignment, AvailabilityAssignment>(
  {
    report: workReportFromJson,
    timeout: "number",
  },
  ({ report, timeout }) => {
    return AvailabilityAssignment.create({ workReport: report, timeout });
  },
);

type JsonAvailabilityAssignment = {
  report: WorkReport;
  timeout: TimeSlot;
};
```
