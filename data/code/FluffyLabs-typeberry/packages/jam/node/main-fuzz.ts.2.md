---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main-fuzz.ts#L179-L231
title: packages/jam/node/main-fuzz.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 2
chunk_total: 3
content_sha: d23845e85f19e100097e551fef64860b86544b1adafcb841406628452f2671e9
language: typescript
---
`packages/jam/node/main-fuzz.ts` (lines 179–231)

```typescript
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
    },
  });

  return () => {
    closeFuzzTarget();
    // Close the reused fjall values session (if any) before wiping its files, so
    // the keyspace handle is released first.
    const closed = fjallSession?.close() ?? Promise.resolve();
    fjallSession = null;
    if (fuzzDbBase !== undefined) {
      // best-effort cleanup on shutdown; ignore failures (dir may already be gone).
      closed
        .catch(() => {})
        .finally(() => {
          wipeFuzzDb(fuzzDbBase).catch(() => {});
        });
    }
  };
}

function isValidStateBackend(val: string): val is StateBackend {
  return FUZZ_DB_OPTIONS.indexOf(val) !== -1;
}
```
