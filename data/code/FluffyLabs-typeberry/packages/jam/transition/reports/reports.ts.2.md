---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/reports.ts#L197-L289
title: packages/jam/transition/reports/reports.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 2
chunk_total: 3
content_sha: f4a1ffd7c20a512fc528b5cd77530c6d8d5511e35e5e119befe67af57ada16ac
language: typescript
---
`packages/jam/transition/reports/reports.ts` (lines 197–289)

```typescript
  getGuarantorAssignment(
    headerTimeSlot: TimeSlot,
    guaranteeTimeSlot: TimeSlot,
    newEntropy: SafroleStateUpdate["entropy"],
    currentValidatorData: SafroleStateUpdate["currentValidatorData"],
    previousValidatorData: SafroleStateUpdate["previousValidatorData"],
  ): Result<PerValidator<GuarantorAssignment>, ReportsError> {
    const epochLength = this.chainSpec.epochLength;
    const rotationPeriod = this.chainSpec.rotationPeriod;
    const headerRotation = rotationIndex(headerTimeSlot, rotationPeriod);
    const guaranteeRotation = rotationIndex(guaranteeTimeSlot, rotationPeriod);
    const minTimeSlot = Math.max(0, headerRotation - 1) * rotationPeriod;

    // https://graypaper.fluffylabs.dev/#/ab2cdbd/15980115be01?v=0.7.2
    if (guaranteeTimeSlot > headerTimeSlot) {
      return Result.error(
        ReportsError.FutureReportSlot,
        () => `Report slot is in future. Block ${headerTimeSlot}, Report: ${guaranteeTimeSlot}`,
      );
    }

    if (guaranteeTimeSlot < minTimeSlot) {
      return Result.error(
        ReportsError.ReportEpochBeforeLast,
        () => `Report slot is too old. Block ${headerTimeSlot}, Report: ${guaranteeTimeSlot}`,
      );
    }

    // TODO [ToDr] [opti] below code needs cache.
    // The `M` and `M*` sets should only be computed once per rotation.

    // Default data for the current rotation
    let entropy = newEntropy[2];
    let validatorData = currentValidatorData;
    let timeSlot = headerTimeSlot;

    // we might need a different set of data
    if (headerRotation > guaranteeRotation) {
      // we can safely subtract here, because if `guaranteeRotation` is less
      // than header rotation it must be greater than the `rotationPeriod`.
      timeSlot = tryAsTimeSlot(headerTimeSlot - rotationPeriod);

      // if the epoch changed, we need to take previous entropy and previous validator data.
      if (isPreviousRotationPreviousEpoch(timeSlot, headerTimeSlot, epochLength)) {
        entropy = newEntropy[3];
        validatorData = previousValidatorData;
      }
    }

    // we know which entropy, timeSlot and validatorData should be used,
    // so we can compute `M` or `M*` here.
    const coreAssignment = generateCoreAssignment(this.chainSpec, this.blake2b, entropy, timeSlot);
    return Result.ok(
      zip(coreAssignment, validatorData, (core, validator) => ({
        core,
        ed25519: validator.ed25519,
      })),
    );
  }
}

function isPreviousRotationPreviousEpoch(
  previousRotationTimeSlot: TimeSlot,
  currentRotationTimeSlot: TimeSlot,
  epochLength: number,
) {
  const currentEpoch = Math.floor(currentRotationTimeSlot / epochLength);
  const maybePreviousEpoch = Math.floor(previousRotationTimeSlot / epochLength);
  const isPrevious = maybePreviousEpoch !== currentEpoch;
  return isPrevious;
}

/**
 * Compose two collections of the same size into a single one
 * containing some amalgamation of both items.
 */
function zip<A, B, R>(a: PerValidator<A>, b: PerValidator<B>, fn: (a: A, b: B) => R): PerValidator<R> {
  return asKnownSize(
    a.map((aValue, index) => {
      return fn(aValue, b[index]);
    }),
  );
}

function hasAnyOffenders(reporters: Ed25519Key[], offenders: HashSet<Ed25519Key>) {
  for (const key of reporters) {
    if (offenders.has(key)) {
      return true;
    }
  }

  return false;
}
```
