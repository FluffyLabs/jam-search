---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/misc/benchmark/types.ts#L1-L44
title: packages/misc/benchmark/types.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 4a5b094e98809a0d24651b12a9865f7f747c345c3efb0cd3cc6769512fd4a4b7
language: typescript
---
`packages/misc/benchmark/types.ts` (lines 1–44)

```typescript
export type Result = {
  current: BennyResults;
  diff: ComparisonResult;
};

export type ErrorResult = {
  name: string;
  err: string;
};
export type OkResult = {
  ok: true;
  name: string;
  ops: [number, number];
  margin: [number, number];
};

export type ComparisonResult = (ErrorResult | OkResult)[];

export type BennyOps = {
  name: string;
  ops: number;
  margin: number;
  percentSlower?: number;
};

export type BennyResults = {
  name: string;
  date: string;
  version: string | null;
  results: BennyOps[] | null;
  fastest:
    | {
        name: string;
        index: number;
      }
    | {
        name: string;
        index: number;
      }[];
  slowest: {
    name: string;
    index: number;
  };
};
```
