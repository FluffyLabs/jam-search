---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/hash/index.test.ts#L1-L20
title: packages/core/hash/index.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 0d5a8ab5e07c5bfb0706a158f545def32e8ba06d833f519a5cef4c2d2fba2329
language: typescript
---
`packages/core/hash/index.test.ts` (lines 1–20)

```typescript
import assert from "node:assert";
import { before, describe, it } from "node:test";
import { BytesBlob } from "@typeberry/bytes";
import { Blake2b } from "./index.js";

describe("Hash", () => {
  let blake2b: Blake2b;

  before(async () => {
    blake2b = await Blake2b.createHasher();
  });

  it("should hash given set of bytes", () => {
    const blob = BytesBlob.parseBlob("0x2fa3f686df876995167e7c2e5d74c4c7b6e48f8068fe0e44208344d480f7904c");

    const hash = blake2b.hashBytes(blob);

    assert.strictEqual(hash.toString(), "0x49f5a84b4c975b075b3be90fd3d1c024dce6575de10a1c0a6f77788503bb306d");
  });
});
```
