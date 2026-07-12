---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/root.test.ts#L1-L26
title: packages/jam/database-fjall/root.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2ad6bfc50f48f4267d8f7f24d3efa77386de1698d2ea85e1137804dd3a6ed209
language: typescript
---
`packages/jam/database-fjall/root.test.ts` (lines 1–26)

```typescript
import assert from "node:assert";
import * as fs from "node:fs";
import { describe, it } from "node:test";
import { FjallRoot } from "./root.js";

const key = Buffer.from("key");
const value = Buffer.from("value");

describe("FjallRoot", () => {
  it("deletes a partition and recreates it empty", async () => {
    const dbPath = fs.mkdtempSync("typeberry-fjall-root-");
    const root = await FjallRoot.open(dbPath, { ephemeral: true });
    try {
      const first = await root.writablePartition("scratch");
      await first.insert(key, value);

      await root.deletePartition("scratch");

      const second = await root.writablePartition("scratch");
      assert.strictEqual(second.get(key), null);
    } finally {
      await root.close();
      fs.rmSync(dbPath, { recursive: true, force: true });
    }
  });
});
```
