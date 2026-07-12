---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/recent-history.ts#L105-L120
title: packages/jam/transition/recent-history.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 2
content_sha: dbcf744faa5ba0f5d75dc581d798df3c0d0a61ef450aaa94894c38f1b3c4cede
language: typescript
---
`packages/jam/transition/recent-history.ts` (lines 105–120)

```typescript
    // we remove all items above `MAX_RECENT_HISTORY`.
    if (recentBlocks.length > MAX_RECENT_HISTORY) {
      recentBlocks.shift();
    }

    // write back to the state.
    return {
      recentBlocks: RecentBlocks.create(
        RecentBlocks.create({
          blocks: asKnownSize(recentBlocks),
          accumulationLog: peaks,
        }),
      ),
    };
  }
}
```
