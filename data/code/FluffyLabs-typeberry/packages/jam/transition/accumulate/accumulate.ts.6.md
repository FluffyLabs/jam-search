---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate.ts#L609-L654
title: packages/jam/transition/accumulate/accumulate.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 6
chunk_total: 7
content_sha: ef148cd9dbf72cf74836fac5ceb78d0c82fe6e60881eac420c3197ec1c234e3a
language: typescript
---
`packages/jam/transition/accumulate/accumulate.ts` (lines 609–654)

```typescript
    const _transfers = transfers;
    const _yieldedRoot = yieldedRoot;

    if (this.hasDuplicatedServiceIdCreated(services.created)) {
      logger.trace`Duplicated Service creation detected. Block is invalid.`;
      return Result.error(ACCUMULATION_ERROR, () => "Accumulate: duplicate service created");
    }

    const accStateUpdate = this.getAccumulationStateUpdate(
      accumulated.toArray(),
      toAccumulateLater,
      slot,
      Array.from(statistics.keys()),
      services,
    );

    const accumulationOutputUnsorted: AccumulationOutput[] = Array.from(yieldedRoots).flatMap(([serviceId, roots]) =>
      Array.from(roots).map((root) => {
        return { serviceId, output: root };
      }),
    );
    const accumulationOutput = SortedArray.fromArray(accumulationOutputComparator, accumulationOutputUnsorted);
    const authQueues = (() => {
      if (authorizationQueues.size === 0) {
        return {};
      }

      const updatedAuthQueues = this.state.authQueues.slice();
      for (const [core, queue] of authorizationQueues.entries()) {
        updatedAuthQueues[core] = queue;
      }
      return { authQueues: tryAsPerCore(updatedAuthQueues, this.chainSpec) };
    })();

    return Result.ok({
      stateUpdate: {
        ...accStateUpdate,
        ...(validatorsData === null ? {} : { designatedValidatorData: validatorsData }),
        ...(privilegedServices === null ? {} : { privilegedServices: privilegedServices }),
        ...authQueues,
      },
      accumulationStatistics: statistics,
      accumulationOutputLog: accumulationOutput,
    });
  }
}
```
