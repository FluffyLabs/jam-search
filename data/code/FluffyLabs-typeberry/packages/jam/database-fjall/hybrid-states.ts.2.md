---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/hybrid-states.ts#L201-L217
title: packages/jam/database-fjall/hybrid-states.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 2
chunk_total: 3
content_sha: 12644a23d0aa7945ae1888b2d3beccb9c18c518a4fe053692e99ae8c811a552c
language: typescript
---
`packages/jam/database-fjall/hybrid-states.ts` (lines 201–217)

```typescript
      await this.session.persist();
    } catch (e) {
      logger.error`${e}`;
      return Result.error(StateUpdateError.Commit, () => `Failed to commit values: ${e}`);
    }
    return Result.ok(OK);
  }

  /** Read a value from fjall. */
  private readValue(key: ValueHash): Uint8Array {
    const val = toUint8Array(this.values.get(key.raw));
    if (val === null) {
      throw new Error(`Missing value at key: ${key}`);
    }
    return val;
  }
}
```
