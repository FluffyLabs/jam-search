---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/misc/benchmark/index.ts#L114-L196
title: packages/misc/benchmark/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 2
content_sha: 09a8dba12fb257a28c6527a318377c2503e06bb4233c839bd996a1e795a53d6d
language: typescript
---
`packages/misc/benchmark/index.ts` (lines 114–196)

```typescript
    return null;
  }
}

function compareResults(currentResults: BennyResults, expectedResults: BennyResults): ComparisonResult {
  const curr = currentResults.results;
  let prev = expectedResults.results;

  // should not happen, since BennyResults always have some results.
  if (curr === null) {
    return [];
  }

  // if there is no expectation on the results, just check which case is the fastest.
  prev = prev ?? curr;

  const res: ComparisonResult = [];

  const currMinOps = Math.min(...Array.from(curr.values()).map((x) => x.ops));
  const prevMinOps = Math.min(...Array.from(prev.values()).map((x) => x.ops));

  for (let i = 0; i < Math.max(curr.length, prev.length); i += 1) {
    if (curr[i]?.name !== prev[i]?.name) {
      res.push({
        name: curr[i]?.name ?? prev[i]?.name,
        err: `Mismatching name (current) "${curr[i]?.name}" vs "${prev[i]?.name}" (expected)`,
      });
      continue;
    }

    // we work on normalized results
    const currNormalized = Math.sqrt(curr[i].ops / currMinOps);
    const prevNormalized = Math.sqrt(prev[i].ops / prevMinOps);

    // compare the difference between results
    const diff = Math.abs(currNormalized - prevNormalized);
    // be generous with the margin
    const margin = 5 + curr[i].margin + prev[i].margin;
    // but take the slower result to comparison.
    const min = Math.min(currNormalized, prevNormalized);
    if (diff > (min * margin) / 100) {
      res.push({
        name: curr[i].name,
        err: errMsg(curr[i], prev[i], currNormalized, prevNormalized),
        ops: [curr[i].ops, prev[i].ops],
        margin: [curr[i].margin, prev[i].margin],
      });
    } else {
      res.push({
        name: curr[i].name,
        ok: true,
        ops: [curr[i].ops, prev[i].ops],
        margin: [curr[i].margin, prev[i].margin],
      });
    }
  }

  return [...res, ...compareFastest(currentResults, expectedResults)];
}

function compareFastest(currentResults: BennyResults, expectedResults: BennyResults): ComparisonResult {
  const current = Array.isArray(currentResults.fastest) ? currentResults.fastest[0] : currentResults.fastest;
  const expected = Array.isArray(expectedResults.fastest) ? expectedResults.fastest : [expectedResults.fastest];

  const expectedNames: string[] = [];
  for (const e of expected) {
    if (current.name === e.name && current.index === e.index) {
      return [];
    }
    expectedNames.push(`${e.name}[${e.index}]`);
  }

  return [
    {
      name: current.name,
      err: `Fastest result changed to (current) "${current.name}[${current.index}]" from "${expectedNames.join(" or ")}" (expected) ❌`,
    },
  ];
}

function errMsg(curr: BennyOps, prev: BennyOps, currNormalized: number, prevNormalized: number) {
  return `Significant speed difference: (current) "${curr.ops} (${currNormalized}) ±${curr.margin}%" vs "${prev.ops} (${prevNormalized}) ± ${prev.margin}%" (previous)`;
}
```
