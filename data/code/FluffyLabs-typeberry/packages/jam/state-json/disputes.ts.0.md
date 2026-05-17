---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-json/disputes.ts#L1-L37
title: packages/jam/state-json/disputes.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 8dae3a020b1cc17acb51a2ce3fdd9682d4fcdc19cf7a6e767d21da3abcbee77f
language: typescript
---
`packages/jam/state-json/disputes.ts` (lines 1–37)

```typescript
import type { WorkReportHash } from "@typeberry/block";
import { fromJson } from "@typeberry/block-json";
import type { Ed25519Key } from "@typeberry/crypto";
import { type FromJson, json } from "@typeberry/json-parser";
import { DisputesRecords } from "@typeberry/state";

export const disputesRecordsFromJson: FromJson<DisputesRecords> = json.object<JsonDisputesRecords, DisputesRecords>(
  {
    good: json.array(fromJson.bytes32<WorkReportHash>()),
    bad: json.array(fromJson.bytes32<WorkReportHash>()),
    wonky: json.array(fromJson.bytes32<WorkReportHash>()),
    offenders: json.array(fromJson.bytes32<Ed25519Key>()),
  },
  ({ good, bad, wonky, offenders }) => {
    return DisputesRecords.fromSortedArrays({
      goodSet: good,
      badSet: bad,
      wonkySet: wonky,
      punishSet: offenders,
    });
  },
);

class JsonDisputesRecords {
  /**
   * psi = {psi_g, psi_b, psi_w, psi_o}
   * GP: https://graypaper.fluffylabs.dev/#/364735a/121400123100
   */
  /** "Good" set */
  good!: WorkReportHash[];
  /** "Bad" set */
  bad!: WorkReportHash[];
  /** "Wonky" set */
  wonky!: WorkReportHash[];
  /** "Punish" set */
  offenders!: Ed25519Key[];
}
```
