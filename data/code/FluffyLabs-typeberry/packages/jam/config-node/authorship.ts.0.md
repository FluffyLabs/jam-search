---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config-node/authorship.ts#L1-L13
title: packages/jam/config-node/authorship.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 95012c1155fa961ec2b3948f0654a9e99fa8c387a3c3635a5a72ff9362c969be
language: typescript
---
`packages/jam/config-node/authorship.ts` (lines 1–13)

```typescript
import type { JsonObject } from "@typeberry/block-json";
import { json } from "@typeberry/json-parser";

/** Block authorship options. */
export class AuthorshipOptions {
  static fromJson = json.object<JsonObject<AuthorshipOptions>, AuthorshipOptions>({}, AuthorshipOptions.new);

  static new() {
    return new AuthorshipOptions();
  }

  private constructor() {}
}
```
