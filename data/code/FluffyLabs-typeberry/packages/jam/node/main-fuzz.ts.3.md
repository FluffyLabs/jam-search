---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main-fuzz.ts#L251-L287
title: packages/jam/node/main-fuzz.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 3
chunk_total: 4
content_sha: 03021f89646d8c031c0e7c66d452372de5040841e3c4844a5580f4eae8af8dbd
language: typescript
---
`packages/jam/node/main-fuzz.ts` (lines 251–287)

```typescript
      reset.then(clearActiveReset, clearActiveReset);
      return reset;
    },
  });

  return {
    close: async () => {
      isClosing = true;
      // Stop accepting connections + unlink the socket.
      closeFuzzTarget();
      // Drain the active reset (flush + close DB). Swallow errors so a
      // failing close still lets the process exit 0; the db is wiped next.
      // The node references the shared fjall keyspace, so it must close first.
      if (activeReset !== null) {
        await activeReset.catch((e) => logger.error`Error waiting for fuzz reset: ${e}`);
      }
      if (runningNode !== null) {
        const node = runningNode;
        runningNode = null;
        await node.close().catch((e) => logger.error`Error closing fuzz node: ${e}`);
      }
      // Release the reused fjall keyspace before wiping its files.
      if (fjallKeyspace !== null) {
        const keyspace = fjallKeyspace;
        fjallKeyspace = null;
        await keyspace.close().catch((e) => logger.error`Error closing fjall keyspace: ${e}`);
      }
      if (fuzzDbBase !== undefined) {
        await wipeFuzzDb(fuzzDbBase).catch(() => {});
      }
    },
  };
}

function isValidStateBackend(val: string): val is StateBackend {
  return FUZZ_DB_OPTIONS.indexOf(val) !== -1;
}
```
