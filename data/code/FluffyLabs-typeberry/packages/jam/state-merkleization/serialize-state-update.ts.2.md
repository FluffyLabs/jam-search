---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/serialize-state-update.ts#L218-L258
title: packages/jam/state-merkleization/serialize-state-update.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 2
chunk_total: 3
content_sha: da0d769a0cf2c91e5453eda180697db89626111b8fb760c3411090a95824772a
language: typescript
---
`packages/jam/state-merkleization/serialize-state-update.ts` (lines 218–258)

```typescript
    yield doSerialize(update.statistics, serialize.statistics); // C(13)
  }

  if (update.accumulationQueue !== undefined) {
    yield doSerialize(update.accumulationQueue, serialize.accumulationQueue); // C(14)
  }

  if (update.recentlyAccumulated !== undefined) {
    yield doSerialize(update.recentlyAccumulated, serialize.recentlyAccumulated); // C(15)
  }

  if (update.accumulationOutputLog !== undefined) {
    yield doSerialize(update.accumulationOutputLog, serialize.accumulationOutputLog); // C(16)
  }
}

function getSafroleData(
  nextValidatorData: SafroleData["nextValidatorData"] | undefined,
  epochRoot: SafroleData["epochRoot"] | undefined,
  sealingKeySeries: SafroleData["sealingKeySeries"] | undefined,
  ticketsAccumulator: SafroleData["ticketsAccumulator"] | undefined,
): SafroleData | undefined {
  if (
    nextValidatorData === undefined ||
    epochRoot === undefined ||
    sealingKeySeries === undefined ||
    ticketsAccumulator === undefined
  ) {
    if ([nextValidatorData, epochRoot, sealingKeySeries, ticketsAccumulator].some((x) => x !== undefined)) {
      throw new Error("SafroleData needs to be updated all at once!");
    }
    return undefined;
  }

  return SafroleData.create({
    nextValidatorData,
    epochRoot,
    sealingKeySeries,
    ticketsAccumulator,
  });
}
```
