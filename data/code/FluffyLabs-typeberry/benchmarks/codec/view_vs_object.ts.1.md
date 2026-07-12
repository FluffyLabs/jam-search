---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/codec/view_vs_object.ts#L135-L168
title: benchmarks/codec/view_vs_object.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 2794fc56aaf01ce55a2b9e77b6ba7d89a9a15970023dc7533e49961a7cb82e6f
language: typescript
---
`benchmarks/codec/view_vs_object.ts` (lines 135–168)

```typescript
      assert.deepStrictEqual(headerView.blockNumber, 10_000_000n);
      return headerView.priorStateRoot;
    }),

    ...compare("two fields as views", (view) => {
      const headerView = view.header2.view();
      assert.deepStrictEqual(headerView.blockNumber.view(), 10_000_000n);
      return headerView.priorStateRoot.view();
    }),

    ...compare(
      "only third field",
      (view) => {
        return view.header2.view().parentHeaderHash.materialize();
      },
      (block) => {
        return block.header2.parentHeaderHash;
      },
    ),

    ...compare("only third field as view", (view) => {
      view.header2.view().parentHeaderHash.view();
    }),

    cycle(),
    complete(),
    configure({}),
    ...save(import.meta.filename),
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
```
