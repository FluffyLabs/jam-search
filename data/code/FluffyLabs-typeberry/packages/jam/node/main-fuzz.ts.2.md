---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main-fuzz.ts#L175-L256
title: packages/jam/node/main-fuzz.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 2
chunk_total: 3
content_sha: 8c67534fff4fa24cace7e20bfab3db7714f762dcf0e5ba948c5eaea1837020e8
language: typescript
---
`packages/jam/node/main-fuzz.ts` (lines 175–256)

```typescript
        };

        if (fuzzDbBase !== undefined) {
          try {
            if (hybridStateBackend === FUZZ_DB_FJALL) {
              // fjall-hybrid: open the values keyspace once and reuse it on every
              // reset. The values partition is content-addressed and immutable, so
              // it is fine that values pile up across resets, the unreferenced ones
              // just sit there. `initializeDatabase` decides whether the db is
              // already initialized from the in-memory blocks, which we rebuild on
              // every reset, not from the values store, so reusing it does not
              // resume the previous run.
              if (fjallSession === null) {
                // Start from a clean slate once, then keep the keyspace open.
                await wipeFuzzDb(fuzzDbBase);
                fjallSession = await FjallValuesSession.open(`${withRelPath(fuzzDbBase)}/${FUZZ_FJALL_VALUES_SUBDIR}`, {
                  ephemeral: true,
                  cacheSizeBytes: FUZZ_FJALL_CACHE_BYTES,
                });
                logger.info`🗄️ Opened reusable fjall values session at ${withRelPath(fuzzDbBase)}/${FUZZ_FJALL_VALUES_SUBDIR}`;
              }
            } else {
              // lmdb-hybrid: keep the old behaviour, wipe and reopen on every
              // reset. A fresh db each reset makes `initializeDatabase` set up
              // genesis again instead of resuming the previous run.
              await wipeFuzzDb(fuzzDbBase);
            }
            runningNode = await buildNode(fuzzDbBase);
            return await runningNode.getBestStateRootHash();
          } catch (e) {
            // A partially-opened db may leak on failure; acceptable for this degraded fallback (proper cleanup belongs in mainImporter).
            logger.warn`Failed to open persistent fuzz db at ${fuzzDbBase}, falling back to in-memory: ${e}`;
            runningNode = null;
          }
        }

        runningNode = await buildNode(undefined);
        return await runningNode.getBestStateRootHash();
      })();
      activeReset = reset;
      const clearActiveReset = () => {
        if (activeReset === reset) {
          activeReset = null;
        }
      };
      reset.then(clearActiveReset, clearActiveReset);
      return reset;
    },
  });

  return {
    close: async () => {
      isClosing = true;
      // Stop accepting connections + unlink the socket.
      closeFuzzTarget();
      // Drain the active session (flush + close DB). Swallow errors so a
      // failing close still lets the process exit 0; the db is wiped next.
      // The node references the shared fjall session, so it must close first.
      if (activeReset !== null) {
        await activeReset.catch((e) => logger.error`Error waiting for fuzz reset: ${e}`);
      }
      if (runningNode !== null) {
        const node = runningNode;
        runningNode = null;
        await node.close().catch((e) => logger.error`Error closing fuzz node: ${e}`);
      }
      // Release the reused fjall values keyspace before wiping its files.
      if (fjallSession !== null) {
        const session = fjallSession;
        fjallSession = null;
        await session.close().catch((e) => logger.error`Error closing fjall session: ${e}`);
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
