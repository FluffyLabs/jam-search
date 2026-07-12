---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/state-transition/state-loader.ts#L1-L12
title: bin/test-runner/state-transition/state-loader.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: d0eaa8fa4d9e009682bc945f4758c3f6071f1f6e8b6e3efd0b226c03010f3d47
language: typescript
---
`bin/test-runner/state-transition/state-loader.ts` (lines 1–12)

```typescript
import type { ChainSpec } from "@typeberry/config";
import type { Blake2b } from "@typeberry/hash";
import { loadState as loadSerializedState } from "@typeberry/state-merkleization";
import type { StateKeyVal } from "@typeberry/state-vectors";

export function loadState(spec: ChainSpec, blake2b: Blake2b, keyvals: StateKeyVal[]) {
  return loadSerializedState(
    spec,
    blake2b,
    keyvals.map((x) => [x.key, x.value]),
  );
}
```
