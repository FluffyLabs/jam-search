---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block-json/disputes-extrinsic.ts#L1-L75
title: packages/jam/block-json/disputes-extrinsic.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 8a4ce597c58d3aa0faec5443cc8f8cfb410adc7c6091c73bd939df88ce03e73b
language: typescript
---
`packages/jam/block-json/disputes-extrinsic.ts` (lines 1–75)

```typescript
import type { Epoch, ValidatorIndex, WorkReportHash } from "@typeberry/block";
import { Culprit, DisputesExtrinsic, Fault, Judgement, Verdict } from "@typeberry/block/disputes.js";
import { asKnownSize } from "@typeberry/collections";
import type { Ed25519Key, Ed25519Signature } from "@typeberry/crypto";
import { json } from "@typeberry/json-parser";
import { fromJson } from "./common.js";

type JsonFault = {
  target: WorkReportHash;
  vote: boolean;
  key: Ed25519Key;
  signature: Ed25519Signature;
};
const faultFromJson = json.object<JsonFault, Fault>(
  {
    target: fromJson.bytes32(),
    vote: "boolean",
    key: fromJson.bytes32(),
    signature: fromJson.ed25519Signature,
  },
  ({ target, vote, key, signature }) =>
    Fault.create({ workReportHash: target, wasConsideredValid: vote, key, signature }),
);

type JsonCulprit = {
  target: WorkReportHash;
  key: Ed25519Key;
  signature: Ed25519Signature;
};
const culpritFromJson = json.object<JsonCulprit, Culprit>(
  {
    target: fromJson.bytes32(),
    key: fromJson.bytes32(),
    signature: fromJson.ed25519Signature,
  },
  ({ target, key, signature }) => Culprit.create({ workReportHash: target, key, signature }),
);

type JsonJudgement = {
  vote: boolean;
  index: ValidatorIndex;
  signature: Ed25519Signature;
};
const judgementFromJson = json.object<JsonJudgement, Judgement>(
  {
    vote: "boolean",
    index: "number",
    signature: fromJson.ed25519Signature,
  },
  ({ vote, index, signature }) => Judgement.create({ isWorkReportValid: vote, index, signature }),
);

type JsonVerdict = {
  target: WorkReportHash;
  age: Epoch;
  votes: Judgement[];
};

const verdictFromJson = json.object<JsonVerdict, Verdict>(
  {
    target: fromJson.bytes32(),
    age: "number",
    votes: json.array(judgementFromJson),
  },
  ({ target, age, votes }) => Verdict.create({ workReportHash: target, votesEpoch: age, votes: asKnownSize(votes) }),
);

export const disputesExtrinsicFromJson = json.object<DisputesExtrinsic>(
  {
    verdicts: json.array(verdictFromJson),
    culprits: json.array(culpritFromJson),
    faults: json.array(faultFromJson),
  },
  ({ verdicts, culprits, faults }) => DisputesExtrinsic.create({ verdicts, culprits, faults }),
);
```
