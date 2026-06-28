---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/chain-stf.ts#L397-L445
title: packages/jam/transition/chain-stf.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 4
chunk_total: 5
content_sha: dbad3f84366e43e65b411461fa77c7701eaf658ff9dc9fc722429d19549f569b
language: typescript
---
`packages/jam/transition/chain-stf.ts` (lines 397–445)

```typescript
      recentBlocks,
      statistics,
      timeslot,
      epochRoot,
      entropy,
      currentValidatorData,
      nextValidatorData,
      previousValidatorData,
      sealingKeySeries,
      ticketsAccumulator,
      accumulationQueue,
      recentlyAccumulated,
      accumulationOutputLog,
      ...servicesUpdate,
      preimages,
    });
  }

  private getUsedAuthorizerHashes(guarantees: GuaranteesExtrinsicView) {
    const map = new Map<CoreIndex, HashSet<AuthorizerHash>>();
    for (const guarantee of guarantees) {
      const reportView = guarantee.view().report.view();
      const coreIndex = reportView.coreIndex.materialize();
      const ofCore = map.get(coreIndex) ?? HashSet.new();
      ofCore.insert(reportView.authorizerHash.materialize());
      map.set(coreIndex, ofCore);
    }
    return map;
  }
}

function checkOffendersMatch(
  offendersMark: HashSet<Ed25519Key>,
  headerOffendersMark: Ed25519Key[],
): Result<OK, OFFENDERS_ERROR> {
  if (offendersMark.size !== headerOffendersMark.length) {
    return Result.error(
      OFFENDERS_ERROR,
      () => `Length mismatch: ${offendersMark.size} vs ${headerOffendersMark.length}`,
    );
  }
  for (const key of headerOffendersMark) {
    if (!offendersMark.has(key)) {
      return Result.error(OFFENDERS_ERROR, () => `Missing key: ${key}`);
    }
  }

  return Result.ok(OK);
}
```
