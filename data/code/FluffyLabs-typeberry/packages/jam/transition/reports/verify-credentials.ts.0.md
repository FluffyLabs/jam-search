---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/verify-credentials.ts#L1-L105
title: packages/jam/transition/reports/verify-credentials.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 48b0def7fac0a3282a8d2af184f94673d4361a9c27d69c132bef01c9cf864899
language: typescript
---
`packages/jam/transition/reports/verify-credentials.ts` (lines 1–105)

```typescript
import type { CoreIndex, PerValidator, TimeSlot, WorkReportHash } from "@typeberry/block";
import { type GuaranteesExtrinsicView, REQUIRED_CREDENTIALS_RANGE } from "@typeberry/block/guarantees.js";
import { BytesBlob } from "@typeberry/bytes";
import type { KnownSizeArray } from "@typeberry/collections";
import type { Ed25519Key, ed25519 } from "@typeberry/crypto";
import { Result } from "@typeberry/utils";
import { ReportsError } from "./error.js";

export type GuarantorAssignment = {
  core: CoreIndex;
  ed25519: Ed25519Key;
};

type GetGuarantorAssignment = (
  headerTimeSlot: TimeSlot,
  guaranteeTimeSlot: TimeSlot,
) => Result<PerValidator<GuarantorAssignment>, ReportsError>;

/**
 * Verify guarantee credentials and return the signatures to verification.
 */
export function verifyCredentials(
  guarantees: GuaranteesExtrinsicView,
  // same number of items as in guarantees view
  workReportHashes: KnownSizeArray<WorkReportHash, "Guarantees">,
  slot: TimeSlot,
  getGuarantorAssignment: GetGuarantorAssignment,
): Result<ed25519.Input[], ReportsError> {
  /**
   * Collect signatures payload for later verification
   * and construct the `reporters set G` from that data.
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/153002153002?v=0.7.2
   */
  const signaturesToVerify: ed25519.Input[] = [];
  const headerTimeSlot = slot;
  let index = 0;
  for (const guarantee of guarantees) {
    const guaranteeView = guarantee.view();
    const coreIndex = guaranteeView.report.view().coreIndex.materialize();
    const workReportHash = workReportHashes[index];
    index += 1;
    /**
     * The credential is a sequence of two or three tuples of a
     * unique validator index and a signature.
     *
     * https://graypaper.fluffylabs.dev/#/ab2cdbd/152b01152d01?v=0.7.2
     */
    const credentialsView = guaranteeView.credentials.view();
    if (
      credentialsView.length < REQUIRED_CREDENTIALS_RANGE[0] ||
      credentialsView.length > REQUIRED_CREDENTIALS_RANGE[1]
    ) {
      return Result.error(
        ReportsError.InsufficientGuarantees,
        () => `Invalid number of credentials. Expected ${REQUIRED_CREDENTIALS_RANGE}, got ${credentialsView.length}`,
      );
    }

    /** Retrieve current core assignment. */
    const timeSlot = guaranteeView.slot.materialize();
    const maybeGuarantorAssignments = getGuarantorAssignment(headerTimeSlot, timeSlot);
    if (maybeGuarantorAssignments.isError) {
      return maybeGuarantorAssignments;
    }
    const guarantorAssignments = maybeGuarantorAssignments.ok;

    /** Credentials must be ordered by their validator index. */
    let lastValidatorIndex = -1;
    for (const credential of credentialsView) {
      const credentialView = credential.view();
      const validatorIndex = credentialView.validatorIndex.materialize();

      if (lastValidatorIndex >= validatorIndex) {
        return Result.error(
          ReportsError.NotSortedOrUniqueGuarantors,
          () =>
            `Credentials must be sorted by validator index. Got ${validatorIndex}, expected at least ${lastValidatorIndex + 1}`,
        );
      }

      lastValidatorIndex = validatorIndex;

      const signature = credentialView.signature.materialize();
      const guarantorData = guarantorAssignments[validatorIndex];
      if (guarantorData === undefined) {
        return Result.error(ReportsError.BadValidatorIndex, () => `Invalid validator index: ${validatorIndex}`);
      }

      /**
       * Verify core assignment.
       *
       * https://graypaper.fluffylabs.dev/#/ab2cdbd/155201155401?v=0.7.2
       */
      if (guarantorData.core !== coreIndex) {
        return Result.error(
          ReportsError.WrongAssignment,
          () =>
            `Invalid core assignment for validator ${validatorIndex}. Expected: ${guarantorData.core}, got: ${coreIndex}`,
        );
      }

      signaturesToVerify.push({
        signature,
        key: guarantorData.ed25519,
```
