---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/lib/examples/hash-usage.test.ts#L1-L50
title: bin/lib/examples/hash-usage.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 5d8dafaca3ec4e75fcd9ff7774217deef50e2e380b4abc5841167eb335e4d08b
language: typescript
---
`bin/lib/examples/hash-usage.test.ts` (lines 1–50)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

describe("Hash Examples", () => {
  it("should demonstrate hashing with Blake2b", async () => {
    // <!-- example:hash-blake2b -->
    const { Blake2b } = await import("@typeberry/lib/hash");

    // Create a Blake2b hasher
    const hasher = await Blake2b.createHasher();

    // Hash some data
    const data = new Uint8Array([1, 2, 3, 4, 5]);
    const hash = hasher.hashBytes(data);

    // hash is a 32-byte Blake2b hash
    assert.strictEqual(hash.length, 32);
    // <!-- /example:hash-blake2b -->
  });

  it("should demonstrate hashing a string", async () => {
    // <!-- example:hash-string -->
    const { Blake2b } = await import("@typeberry/lib/hash");

    const hasher = await Blake2b.createHasher();

    // Hash a string directly
    const hash = hasher.hashString("Hello, world!");

    // Returns a 32-byte hash
    assert.strictEqual(hash.length, 32);
    // <!-- /example:hash-string -->
  });

  it("should demonstrate hashing multiple blobs", async () => {
    // <!-- example:hash-multiple -->
    const { Blake2b } = await import("@typeberry/lib/hash");

    const hasher = await Blake2b.createHasher();

    // Hash multiple byte arrays together
    const data1 = new Uint8Array([1, 2, 3]);
    const data2 = new Uint8Array([4, 5, 6]);
    const hash = hasher.hashBlobs([data1, data2]);

    // Returns a single hash of all inputs
    assert.strictEqual(hash.length, 32);
    // <!-- /example:hash-multiple -->
  });
});
```
