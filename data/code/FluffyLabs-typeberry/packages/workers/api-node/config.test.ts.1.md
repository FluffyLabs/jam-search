---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/config.test.ts#L103-L135
title: packages/workers/api-node/config.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: bc8eee880323839a95ffa8fc51150c5b6c286a8d8f68e0d2b6aa02d4d5b2b4a4
language: typescript
---
`packages/workers/api-node/config.test.ts` (lines 103–135)

```typescript
  // working db. fjall is the experimental backend we want to benchmark.
  for (const backend of ["lmdb", "fjall"] as const) {
    it(`constructs and opens a ${backend}-backed hybrid db`, async () => {
      const blake2b = await Blake2b.createHasher();
      const dbPath = fs.mkdtempSync(`typeberry-hybrid-${backend}-`);
      try {
        const config = await HybridWorkerConfig.new({
          nodeName: "node",
          chainSpec: spec,
          workerParams: undefined,
          blake2b,
          dbPath,
          ephemeral: true,
          backend,
        });

        const db = await config.openDatabase({ readonly: false });
        const states = db.getStatesDb();
        try {
          assert.notStrictEqual(db.getBlocksDb(), undefined);
          assert.notStrictEqual(states, undefined);
        } finally {
          // The values store owns the on-disk resources (the no-op db.close()
          // does not), so close it explicitly to release the fjall keyspace.
          await states.close();
          await db.close();
        }
      } finally {
        fs.rmSync(dbPath, { recursive: true, force: true });
      }
    });
  }
});
```
