---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/test.utils.ts#L1-L17
title: packages/jam/transition/test.utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 61fec42d73fc24b6ca74b0a72405434251989bea3be2a99a076de4bfab2e4447
language: typescript
---
`packages/jam/transition/test.utils.ts` (lines 1–17)

```typescript
import type { State } from "@typeberry/state";

/**
 * A rather test-only function to copy some fields from the state,
 * apply an update to them (excluding services) and return a new plain object.
 *
 * NOTE: if looking something more sophisticated try `InMemoryState` representation.
 */
export function copyAndUpdateState<T extends Partial<State>>(
  preState: T,
  stateUpdate: Partial<T>,
): { [K in keyof T]: T[K] } {
  return {
    ...preState,
    ...stateUpdate,
  };
}
```
