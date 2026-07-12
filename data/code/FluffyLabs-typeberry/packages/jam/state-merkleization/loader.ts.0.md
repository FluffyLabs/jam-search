---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/loader.ts#L1-L11
title: packages/jam/state-merkleization/loader.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: ea97373f50543426db25f3023cfb41c2f55b183213cf6ce8cdba2a9176abda90
language: typescript
---
`packages/jam/state-merkleization/loader.ts` (lines 1–11)

```typescript
import type { BytesBlob } from "@typeberry/bytes";
import type { ChainSpec } from "@typeberry/config";
import type { Blake2b, TruncatedHash } from "@typeberry/hash";
import type { StateKey } from "./keys.js";
import { SerializedState } from "./serialized-state.js";
import { StateEntries } from "./state-entries.js";

export function loadState(spec: ChainSpec, blake2b: Blake2b, entries: Iterable<[StateKey | TruncatedHash, BytesBlob]>) {
  const stateEntries = StateEntries.fromEntriesUnsafe(entries);
  return SerializedState.fromStateEntries(spec, blake2b, stateEntries);
}
```
