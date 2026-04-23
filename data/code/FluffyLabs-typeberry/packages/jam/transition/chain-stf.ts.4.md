---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/chain-stf.ts#L404-L434
title: packages/jam/transition/chain-stf.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 4
chunk_total: 5
content_sha: 00421f7c51599ea23400cae20d6306d6409d07594802a504504fafc830350f39
language: typescript
---
`packages/jam/transition/chain-stf.ts` (lines 404–434)

```typescript
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
