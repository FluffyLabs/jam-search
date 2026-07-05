---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/root.ts#L116-L138
title: packages/jam/database-fjall/root.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: c3f0f1a382bdc222819a20eb839fb796c8ebc612a777cacadd26ff332c468dff
language: typescript
---
`packages/jam/database-fjall/root.ts` (lines 116–138)

```typescript
    } catch {
      return null;
    }
  }

  /** Release this keyspace handle. Call persist() first when durability is needed. */
  async close(): Promise<void> {
    await this.keyspace.close();
  }
}

function dirSizeInBytes(dir: string): number {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      total += dirSizeInBytes(full);
    } else if (entry.isFile()) {
      total += fs.statSync(full).size;
    }
  }
  return total;
}
```
