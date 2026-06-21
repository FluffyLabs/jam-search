---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/disputes.ts#L1-L103
title: packages/jam/transition/disputes/disputes.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 5
content_sha: c3feca3e0f4906ef8908ae9e23d4c0f5035b7a24a7a9e7307790e916232e55b1
language: typescript
---
`packages/jam/transition/disputes/disputes.ts` (lines 1–103)

```typescript
import type { WorkReportHash } from "@typeberry/block";
import type { DisputesExtrinsic } from "@typeberry/block/disputes.js";
import { WorkReport } from "@typeberry/block/work-report.js";
import { Encoder } from "@typeberry/codec";
import { HashDictionary, HashSet, SortedArray, SortedSet } from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import type { Ed25519Key } from "@typeberry/crypto";
import type { Blake2b } from "@typeberry/hash";
import {
  type AvailabilityAssignment,
  DisputesRecords,
  hashComparator,
  type PerCore,
  tryAsPerCore,
} from "@typeberry/state";
import { Result } from "@typeberry/utils";
import { DisputesErrorCode } from "./disputes-error-code.js";
import type { DisputesState, DisputesStateUpdate } from "./disputes-state.js";
import { isUniqueSortedBy, isUniqueSortedByIndex } from "./sort-utils.js";
import {
  prepareCulpritSignature,
  prepareFaultSignature,
  prepareJudgementSignature,
  type VerificationInput,
  type VerificationOutput,
  vefifyAllSignatures,
} from "./verification-utils.js";

type VotesForWorkReports = HashDictionary<WorkReportHash, number>;

type Ok = null;
export class Disputes {
  constructor(
    private readonly chainSpec: ChainSpec,
    private readonly blake2b: Blake2b,
    public readonly state: DisputesState,
  ) {}

  private verifyCulprits(
    disputes: DisputesExtrinsic,
    newItems: DisputesRecords,
    verificationResult: VerificationOutput,
    allValidatorKeys: HashSet<Ed25519Key>,
  ): Result<Ok, DisputesErrorCode> {
    // check if culprits are sorted by key
    // https://graypaper.fluffylabs.dev/#/579bd12/12c50112c601
    if (!isUniqueSortedBy(disputes.culprits, "key")) {
      return Result.error(DisputesErrorCode.CulpritsNotSortedUnique, () => "Culprits are not uniquely sorted by key");
    }

    const culpritsLength = disputes.culprits.length;
    for (let i = 0; i < culpritsLength; i++) {
      const { key, workReportHash } = disputes.culprits[i];
      // check if some offenders weren't reported earlier
      // https://graypaper.fluffylabs.dev/#/579bd12/125501125501
      const isInPunishSet = this.state.disputesRecords.asDictionaries().punishSet.has(key);
      if (isInPunishSet) {
        return Result.error(
          DisputesErrorCode.OffenderAlreadyReported,
          () => `Offender already reported: culprit ${i}, key=${key}`,
        );
      }

      // check if the guarantor key is correct
      // https://graypaper.fluffylabs.dev/#/85129da/125501125501?v=0.6.3
      if (!allValidatorKeys.has(key)) {
        return Result.error(DisputesErrorCode.BadGuarantorKey, () => `Bad guarantor key: culprit ${i}, key=${key}`);
      }

      // verify if the culprit will be in new bad set
      // https://graypaper.fluffylabs.dev/#/579bd12/124601124601
      const isInNewBadSet = newItems.asDictionaries().badSet.has(workReportHash);
      if (!isInNewBadSet) {
        return Result.error(
          DisputesErrorCode.CulpritsVerdictNotBad,
          () => `Culprit verdict not bad: culprit ${i}, work report=${workReportHash}`,
        );
      }

      // verify culprit signature
      // https://graypaper.fluffylabs.dev/#/579bd12/125c01125c01
      const result = verificationResult.culprits[i];
      if (!result?.isValid) {
        return Result.error(DisputesErrorCode.BadSignature, () => `Invalid signature for culprit: ${i}`);
      }
    }

    return Result.ok(null);
  }

  private verifyFaults(
    disputes: DisputesExtrinsic,
    newItems: DisputesRecords,
    verificationResult: VerificationOutput,
    allValidatorKeys: HashSet<Ed25519Key>,
  ): Result<Ok, DisputesErrorCode> {
    // check if faults are sorted by key
    // https://graypaper.fluffylabs.dev/#/579bd12/12c50112c601
    if (!isUniqueSortedBy(disputes.faults, "key")) {
      return Result.error(DisputesErrorCode.FaultsNotSortedUnique, () => "Faults are not uniquely sorted by key");
    }

    const faultsLength = disputes.faults.length;
```
