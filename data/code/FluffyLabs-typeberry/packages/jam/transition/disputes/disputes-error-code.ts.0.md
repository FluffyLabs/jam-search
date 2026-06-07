---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/disputes-error-code.ts#L1-L18
title: packages/jam/transition/disputes/disputes-error-code.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 033deddd90c5cb8b1a507328ad8d84952e5c266d2d50632d6c68ec707e61b9df
language: typescript
---
`packages/jam/transition/disputes/disputes-error-code.ts` (lines 1–18)

```typescript
export enum DisputesErrorCode {
  AlreadyJudged = "already_judged",
  BadVoteSplit = "bad_vote_split",
  VerdictsNotSortedUnique = "verdicts_not_sorted_unique",
  JudgementsNotSortedUnique = "judgements_not_sorted_unique",
  CulpritsNotSortedUnique = "culprits_not_sorted_unique",
  FaultsNotSortedUnique = "faults_not_sorted_unique",
  NotEnoughCulprits = "not_enough_culprits",
  NotEnoughFaults = "not_enough_faults",
  CulpritsVerdictNotBad = "culprits_verdict_not_bad",
  FaultVerdictWrong = "fault_verdict_wrong",
  OffenderAlreadyReported = "offender_already_reported",
  BadJudgementAge = "bad_judgement_age",
  BadValidatorIndex = "bad_validator_index",
  BadSignature = "bad_signature",
  BadGuarantorKey = "bad_guarantor_key",
  BadAuditorKey = "bad_auditor_key",
}
```
