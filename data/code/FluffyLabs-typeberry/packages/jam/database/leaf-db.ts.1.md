---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database/leaf-db.ts#L120-L147
title: packages/jam/database/leaf-db.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 2
content_sha: ce780616cab2d2096981e7f892f579134ac2f53877de249369f78fb87e6b8250
language: typescript
---
`packages/jam/database/leaf-db.ts` (lines 120–147)

```typescript
          entries.push([key.asOpaque(), lookup.value]);
          continue;
        case LookupKind.DbKey:
          entries.push([key.asOpaque(), BytesBlob.blobFrom(this.db.get(lookup.key))]);
          continue;
        default:
          assertNever(lookup);
      }
    }

    return StateEntries.fromEntriesUnsafe(entries);
  }
}

enum LookupKind {
  EmbeddedValue = 0,
  DbKey = 1,
}

type Lookup =
  | {
      kind: LookupKind.EmbeddedValue;
      value: BytesBlob;
    }
  | {
      kind: LookupKind.DbKey;
      key: ValueHash;
    };
```
