---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/utils.ts#L1-L3
title: packages/jam/jamnp-s/utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 9a111dab5d9e454c96a0762cff5c25e5515c74d491f783a5f4d9874c0b6b96d8
language: typescript
---
`packages/jam/jamnp-s/utils.ts` (lines 1–3)

```typescript
export function handleAsyncErrors(work: () => Promise<void>, onError: (e: unknown) => void) {
  return work().catch(onError);
}
```
