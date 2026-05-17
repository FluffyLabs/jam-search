---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/assurances.ts#L102-L212
title: packages/jam/transition/assurances.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 3
content_sha: d919c9da0bb040e14b95041726f69c9dd42462202d64f58701afbc0424fc62b9
language: typescript
---
`packages/jam/transition/assurances.ts` (lines 102–212)

```typescript
        return Result.error(
          AssurancesError.InvalidOrder,
          () => `order: expected: ${prevValidatorIndex + 1}, got: ${validatorIndex}`,
        );
      }
      prevValidatorIndex = assurance.validatorIndex;

      check`${bitfield.bitLength === coresCount} Invalid bitfield length of ${bitfield.bitLength}`;
      const setBits = bitfield.indicesOfSetBits();
      for (const idx of setBits) {
        perCoreAssurances[idx] += 1;
      }
    }

    const availableReports: WorkReport[] = [];
    const coresToClear: number[] = [];
    const validatorsSuperMajority = this.chainSpec.validatorsSuperMajority;
    const availabilityAssignment = input.disputesAvailAssignment.slice();

    for (let c = 0; c < coresCount; c++) {
      const noOfAssurances = perCoreAssurances[c];
      const workReport = availabilityAssignment[c];
      const isReportPending = workReport !== null;
      /**
       * Verify if availability is pending: A bit may only be set if the corresponding
       * core has a report pending availability on it:
       * https://graypaper.fluffylabs.dev/#/579bd12/14e90014ea00
       */
      if (noOfAssurances > 0 && !isReportPending) {
        return Result.error(
          AssurancesError.NoReportPending,
          () => `no report pending for core ${c} yet we got an assurance`,
        );
      }

      /**
       * Remove work report if it's became available or timed out.
       * https://graypaper.fluffylabs.dev/#/1c979cb/141302144402?v=0.7.1
       */
      if (isReportPending) {
        if (input.slot >= workReport.timeout + REPORT_TIMEOUT_GRACE_PERIOD) {
          coresToClear.push(c);
        }
        if (noOfAssurances >= validatorsSuperMajority) {
          availableReports.push(workReport.workReport);
          coresToClear.push(c);
        }
      }
    }

    // asynchronously verify the signatures
    const allSignaturesValid = await signaturesVerification;
    if (allSignaturesValid.isError) {
      return allSignaturesValid;
    }

    /**
     * ρ‡ - equivalent to ρ† except for the removal of items
     * which are either now available or have timed out
     * https://graypaper.fluffylabs.dev/#/1c979cb/141302144402?v=0.7.1
     */
    for (const c of coresToClear) {
      availabilityAssignment[c] = null;
    }

    return Result.ok({
      availableReports,
      stateUpdate: {
        // Since we are copying the original array and only assigning to
        // existing cores, this cast is safe here.
        availabilityAssignment: asKnownSize(availabilityAssignment),
      },
    });
  }

  /** Asynchronously verify all signatures. */
  private async verifySignatures(assurances: AssurancesExtrinsicView): Promise<Result<OK, AssurancesError>> {
    const validatorData = this.state.currentValidatorData;
    const signatures: ed25519.Input<BytesBlob>[] = [];
    for (const assurance of assurances) {
      const v = assurance.view();
      const key = validatorData[v.validatorIndex.materialize()];
      if (key === undefined) {
        return Result.error(
          AssurancesError.InvalidValidatorIndex,
          () => `Invalid validator index: ${v.validatorIndex.materialize()}`,
        );
      }
      signatures.push({
        signature: v.signature.materialize(),
        key: key.ed25519,
        message: signingPayload(this.blake2b, v.anchor.encoded(), v.bitfield.encoded()),
      });
    }
    const signaturesValid = await ed25519.verify(signatures);

    const isAllSignaturesValid = signaturesValid.every((x) => x);
    if (!isAllSignaturesValid) {
      const invalidIndices = signaturesValid.reduce(
        (acc, isValid, idx) => (isValid ? acc : acc.concat(idx)),
        [] as number[],
      );
      return Result.error(AssurancesError.InvalidSignature, () => `invalid signatures at ${invalidIndices.join(", ")}`);
    }

    return Result.ok(OK);
  }
}

const JAM_AVAILABLE = BytesBlob.blobFromString("jam_available").raw;

```
