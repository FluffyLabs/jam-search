---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main-fuzz.ts#L175-L260
title: packages/jam/node/main-fuzz.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 2
chunk_total: 4
content_sha: 4afad410802faf253467e92e8e8399406bfe72d824d220b635eb0660e13cd20c
language: typescript
---
`packages/jam/node/main-fuzz.ts` (lines 175–260)

```typescript
              sharedFjallKeyspace: fjallKeyspace ?? undefined,
            },
          );
        };

        if (fuzzDbBase !== undefined) {
          try {
            const fjallKeyspacePath = withRelPath(fuzzDbBase);
            if (hybridStateBackend === FUZZ_DB_FJALL) {
              // fjall-hybrid: values pile up across resets, so rebuild the
              // keyspace periodically to avoid LSM read amplification.
              if (resetCount === 1 || fjallKeyspace === null) {
                // First reset: start from a clean slate.
                await wipeFuzzDb(fuzzDbBase);
                fjallKeyspace = await FjallRoot.open(fjallKeyspacePath, {
                  ephemeral: true,
                  cacheSizeBytes: FUZZ_FJALL_CACHE_BYTES,
                });
                logger.info`🗄️ Opened reusable fjall keyspace at ${fjallKeyspacePath}`;
              } else if (resetCount % REBUILD_FJALL_KEYSPACE_EVERY === 0) {
                // Periodic rebuild: close, wipe keyspace dir, and reopen.
                const keyspace = fjallKeyspace;
                fjallKeyspace = null;
                await keyspace.close().catch(() => {});
                await wipeFuzzDb(fuzzDbBase).catch(() => {});
                fjallKeyspace = await FjallRoot.open(fjallKeyspacePath, {
                  ephemeral: true,
                  cacheSizeBytes: FUZZ_FJALL_CACHE_BYTES,
                });
                logger.info`🗄️ Rebuilt reusable fjall keyspace at ${fjallKeyspacePath}`;
              }
            } else {
              // full-fjall: keep one keyspace open and recycle only the five
              // partitions used by FjallBlocks/FjallStates.
              if (resetCount === 1 || fjallKeyspace === null) {
                await wipeFuzzDb(fuzzDbBase);
                fjallKeyspace = await FjallRoot.open(fjallKeyspacePath, {
                  ephemeral: true,
                  cacheSizeBytes: FUZZ_FJALL_CACHE_BYTES,
                });
                logger.info`🗄️ Opened reusable fjall keyspace at ${fjallKeyspacePath}`;
              } else if (resetCount % REBUILD_FJALL_KEYSPACE_EVERY === 0) {
                // Periodic rebuild: delete/recreate keeps correctness, but a
                // long-lived keyspace accumulates fjall write amplification.
                const keyspace = fjallKeyspace;
                fjallKeyspace = null;
                await keyspace.close().catch(() => {});
                await wipeFuzzDb(fuzzDbBase).catch(() => {});
                fjallKeyspace = await FjallRoot.open(fjallKeyspacePath, {
                  ephemeral: true,
                  cacheSizeBytes: FUZZ_FJALL_CACHE_BYTES,
                });
                logger.info`🗄️ Rebuilt reusable fjall keyspace at ${fjallKeyspacePath}`;
              } else if (fjallKeyspace !== null) {
                const keyspace = fjallKeyspace;
                await Promise.all(FUZZ_FJALL_PARTITIONS.map((name) => keyspace.deletePartition(name)));
              }
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
```
