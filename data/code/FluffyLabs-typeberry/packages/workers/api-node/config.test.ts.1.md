---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/config.test.ts#L109-L153
title: packages/workers/api-node/config.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 2
content_sha: a89d5443ad59935a9cd3fa5025ec569296d7b865caaaec9292445b4499cad18a
language: typescript
---
`packages/workers/api-node/config.test.ts` (lines 109–153)

```typescript
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

  it("can borrow a shared fjall root for the values store", async () => {
    const blake2b = await Blake2b.createHasher();
    const dbPath = fs.mkdtempSync("typeberry-hybrid-fjall-shared-");
    const root = await FjallRoot.open(dbPath, { ephemeral: true });
    try {
      const config = await HybridWorkerConfig.new({
        nodeName: "node",
        chainSpec: spec,
        workerParams: undefined,
        blake2b,
        dbPath,
        ephemeral: true,
        sharedFjallKeyspace: root,
      });

      const db = await config.openDatabase({ readonly: false });
      const states = db.getStatesDb();
      try {
        assert.notStrictEqual(db.getBlocksDb(), undefined);
        assert.notStrictEqual(states, undefined);
      } finally {
        await states.close();
        await db.close();
      }

      await root.deletePartition("values");
    } finally {
      await root.close();
      fs.rmSync(dbPath, { recursive: true, force: true });
    }
  });
});
```
