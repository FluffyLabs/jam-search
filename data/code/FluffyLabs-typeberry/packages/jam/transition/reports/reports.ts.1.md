---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/reports.ts#L84-L201
title: packages/jam/transition/reports/reports.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 3
content_sha: ca0c99a8ae6f979101b8ff855aa2bed44e9615af64d403c3d48d8615e1c1b4bd
language: typescript
---
`packages/jam/transition/reports/reports.ts` (lines 84–201)

```typescript
    // confirm contextual validity
    const contextualValidity = this.verifyContextualValidity(input);
    if (contextualValidity.isError) {
      return contextualValidity;
    }

    // check signatures correctness
    const signaturesOk = this.checkSignatures(signaturesToVerify.ok, await verifySignaturesLater);
    if (signaturesOk.isError) {
      return signaturesOk;
    }

    /**
     * ρ′ - equivalent to ρ‡, except where the extrinsic replaced
     * an entry. In the case an entry is replaced, the new value
     * includes the present time τ' allowing for the value to be
     * replaced without respect to its availability once sufficient
     * time has elapsed.
     *
     * https://graypaper.fluffylabs.dev/#/ab2cdbd/161e00165900?v=0.7.2
     */
    const availabilityAssignment = input.assurancesAvailAssignment.slice();

    for (const guarantee of input.guarantees) {
      const workReport = guarantee.view().report.materialize();
      availabilityAssignment[workReport.coreIndex] = AvailabilityAssignment.create({
        workReport,
        timeout: input.slot,
      });
    }

    const reporters = SortedSet.fromArray(
      bytesBlobComparator,
      signaturesToVerify.ok.map((x) => x.key),
    ).slice();

    if (hasAnyOffenders(reporters, input.offenders)) {
      return Result.error(ReportsError.BannedValidator, () => "One or more reporters are banned validators");
    }

    return Result.ok({
      stateUpdate: {
        availabilityAssignment: tryAsPerCore(availabilityAssignment, this.chainSpec),
      },
      reported: contextualValidity.ok,
      reporters: asKnownSize(reporters),
    });
  }

  workReportHashes(input: GuaranteesExtrinsicView, blake2b: Blake2b): KnownSizeArray<WorkReportHash, "Guarantees"> {
    const workReportHashes: WorkReportHash[] = [];
    for (const guarantee of input) {
      workReportHashes.push(asOpaqueType(blake2b.hashBytes(guarantee.view().report.encoded())));
    }
    return asKnownSize(workReportHashes);
  }

  verifyCredentials(input: ReportsInput, workReportHashes: KnownSizeArray<WorkReportHash, "Guarantees">) {
    return verifyCredentials(input.guarantees, workReportHashes, input.slot, (headerTimeSlot, guaranteeTimeSlot) =>
      this.getGuarantorAssignment(
        headerTimeSlot,
        guaranteeTimeSlot,
        input.newEntropy,
        input.currentValidatorData,
        input.previousValidatorData,
      ),
    );
  }

  verifyPostSignatureChecks(
    input: GuaranteesExtrinsicView,
    assurancesAvailAssignment: ReportsInput["assurancesAvailAssignment"],
  ) {
    const authPoolsView = this.state.view().authPoolsView();
    return verifyPostSignatureChecks(input, assurancesAvailAssignment, authPoolsView, (id) =>
      this.state.getService(id),
    );
  }

  verifyContextualValidity(input: ReportsInput) {
    return verifyContextualValidity(input, this.state, this.headerChain, this.chainSpec.maxLookupAnchorAge);
  }

  checkSignatures(
    signaturesToVerify: ed25519.Input<BytesBlob>[],
    signaturesValid: boolean[],
  ): Result<OK, ReportsError> {
    if (signaturesValid.every((isValid) => isValid)) {
      return Result.ok(OK);
    }

    // we have invalid signatures, let's return nice error messages
    const invalidKeys = signaturesValid
      .map((isValid, idx) => {
        if (isValid) {
          return null;
        }
        return signaturesToVerify[idx].key;
      })
      .filter((x) => x !== null);

    return Result.error(
      ReportsError.BadSignature,
      () => `Invalid signatures for validators with keys: ${invalidKeys.join(", ")}`,
    );
  }

  /**
   * Get the guarantor assignment (both core and validator data)
   * depending on the rotation.
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/15df0115df01?v=0.7.2
   */
  getGuarantorAssignment(
    headerTimeSlot: TimeSlot,
    guaranteeTimeSlot: TimeSlot,
    newEntropy: SafroleStateUpdate["entropy"],
    currentValidatorData: SafroleStateUpdate["currentValidatorData"],
```
