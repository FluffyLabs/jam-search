---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate.ts#L416-L514
title: packages/jam/transition/accumulate/accumulate.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 4
chunk_total: 7
content_sha: b30c6e7d8d0128cf236acaa2399175d2444690ebd168d793d7cd2d8475e7a9fa
language: typescript
---
`packages/jam/transition/accumulate/accumulate.ts` (lines 416–514)

```typescript
        } else {
          rootsSet.insert(yieldedRoot);
        }
      }
    }
  }

  /**
   * The parallelized accumulation function ∆∗ which,
   * with the help of the single-service accumulation function ∆1,
   * transforms an initial state-context, together with a sequence of work-reports
   * and a dictionary of privileged always-accumulate services,
   * into a tuple of the total gas utilized in pvm execution u, a posterior state-context
   * and the resultant accumulation-output pairings b and deferred-transfers.
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/174602174602?v=0.7.2
   */
  private async accumulateInParallel(
    accumulateData: AccumulateData,
    slot: TimeSlot,
    entropy: EntropyHash,
    inputStateUpdate: AccumulationStateUpdate,
  ): Promise<ParallelAccumulationResult> {
    const serviceIds = accumulateData.getServiceIds();
    const serviceIdsLength = serviceIds.length;
    const resultPromises: Promise<
      readonly [ServiceId, { consumedGas: ServiceGas; stateUpdate: AccumulationStateUpdate }]
    >[] = new Array(serviceIdsLength);

    for (let serviceIndex = 0; serviceIndex < serviceIdsLength; serviceIndex += 1) {
      const serviceId = serviceIds[serviceIndex];
      const checkpoint = AccumulationStateUpdate.copyFrom(inputStateUpdate);
      const promise = this.accumulateSingleService(
        serviceId,
        accumulateData.getTransfers(serviceId),
        accumulateData.getOperands(serviceId),
        accumulateData.getGasLimit(serviceId),
        slot,
        entropy,
        AccumulationStateUpdate.copyFrom(inputStateUpdate),
      ).then(({ consumedGas, stateUpdate }) => {
        const resultEntry: readonly [ServiceId, { consumedGas: ServiceGas; stateUpdate: AccumulationStateUpdate }] = [
          serviceId,
          {
            consumedGas,
            stateUpdate: stateUpdate === null ? checkpoint : stateUpdate,
          },
        ];

        return resultEntry;
      });

      if (this.options.accumulateSequentially === true) {
        await promise;
      }

      resultPromises[serviceIndex] = promise;
    }

    return Promise.all(resultPromises).then((results) => new Map(results));
  }

  /**
   * A method that updates `recentlyAccumulated`, `accumulationQueue` and `timeslot` in state
   */
  private getAccumulationStateUpdate(
    accumulated: WorkReport[],
    toAccumulateLater: NotYetAccumulatedReport[],
    slot: TimeSlot,
    accumulatedServices: ServiceId[],
    servicesUpdate: ServicesUpdate,
  ): Pick<AccumulateStateUpdate, "timeslot" | "recentlyAccumulated" | "accumulationQueue"> & ServicesUpdate {
    const epochLength = this.chainSpec.epochLength;
    const phaseIndex = slot % epochLength;
    const accumulatedSet = getWorkPackageHashes(accumulated);
    const accumulatedSorted = Array.from(accumulatedSet).sort((a, b) => hashComparator(a, b).value);
    const newRecentlyAccumulated = this.state.recentlyAccumulated.slice(1).concat(HashSet.from(accumulatedSorted));

    const recentlyAccumulated = tryAsPerEpochBlock(newRecentlyAccumulated, this.chainSpec);
    const accumulationQueue = this.state.accumulationQueue.slice();
    accumulationQueue[phaseIndex] = pruneQueue(toAccumulateLater, accumulatedSet);

    const timeslot = this.state.timeslot;
    for (let i = 1; i < epochLength; i++) {
      const queueIndex = (phaseIndex + epochLength - i) % epochLength;
      if (i < slot - timeslot) {
        accumulationQueue[queueIndex] = [];
      } else {
        accumulationQueue[queueIndex] = pruneQueue(accumulationQueue[queueIndex], accumulatedSet);
      }
    }

    // δ†
    const partialStateUpdate = PartiallyUpdatedState.new(this.state, AccumulationStateUpdate.new(servicesUpdate));
    // update last accumulation
    for (const serviceId of accumulatedServices) {
      // https://graypaper.fluffylabs.dev/#/7e6ff6a/181003185103?v=0.6.7
      const info = partialStateUpdate.getServiceInfo(serviceId);
      if (info === null) {
```
