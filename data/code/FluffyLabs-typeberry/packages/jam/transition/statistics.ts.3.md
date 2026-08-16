---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/statistics.ts#L304-L335
title: packages/jam/transition/statistics.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 3
chunk_total: 4
content_sha: ca5fbc0e216cbe38e0be8590a9922051c8dffc094deaf6f26e74abdeb942ff88
language: typescript
---
`packages/jam/transition/statistics.ts` (lines 304–335)

```typescript
      const { count: accumulatedCount, gasUsed: accumulatedGasUsed } = input.accumulationStatistics.get(serviceId) ?? {
        count: tryAsU32(0),
        gasUsed: tryAsServiceGas(0n),
      };

      /**
       * Service statistics are tracked only per-block basis, so we override previous values.
       * https://graypaper.fluffylabs.dev/#/cc517d7/190201190501?v=0.6.5
       */
      const serviceStatistics = ServiceStatistics.empty();
      serviceStatistics.refinementCount = tryAsU32(workResults.length);
      serviceStatistics.refinementGasUsed = gasUsed;
      serviceStatistics.imports = imported;
      serviceStatistics.extrinsicCount = extrinsicCount;
      serviceStatistics.extrinsicSize = extrinsicSize;
      serviceStatistics.exports = exported;
      serviceStatistics.providedCount = providedCount;
      serviceStatistics.providedSize = providedSize;
      serviceStatistics.providedCount = providedCount;
      serviceStatistics.providedSize = providedSize;
      serviceStatistics.accumulateCount = accumulatedCount;
      serviceStatistics.accumulateGasUsed = accumulatedGasUsed;

      services.set(serviceId, serviceStatistics);
    }

    /** Update state */
    return {
      statistics,
    };
  }
}
```
