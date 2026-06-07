---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/hash/blake2b.ts#L1-L56
title: benchmarks/hash/blake2b.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 0fc75eb01416d9d763d23b29549e97fa73d94adee65993740de995d176a8ac39
language: typescript
---
`benchmarks/hash/blake2b.ts` (lines 1–56)

```typescript
import { pathToFileURL } from "node:url";
import { add, complete, configure, cycle, save, suite } from "@typeberry/benchmark/setup.js";
import { BytesBlob } from "@typeberry/bytes";
import { Blake2b, HASH_SIZE } from "@typeberry/hash";
import blake2b from "blake2b";

const BLOB_SIZE = 1 * 1024 * 1024;
const NUMBER_OF_HASHES = 512;

function generateBlob(): BytesBlob {
  const result = new Uint8Array(BLOB_SIZE);
  for (let i = 0; i < BLOB_SIZE; i += 1) {
    const val = Math.floor(Math.random() * 255);
    result[i] = val;
  }
  return BytesBlob.blobFrom(result);
}

export default function run() {
  return suite(
    "Creating many hashes",

    add("our hasher", async () => {
      const blob = generateBlob();
      const blake2b = await Blake2b.createHasher();

      return () => {
        for (let i = 0; i < NUMBER_OF_HASHES; i += 1) {
          blake2b.hashBytes(blob);
        }
      };
    }),

    add("blake2b js", async () => {
      const blob = generateBlob();

      return () => {
        for (let i = 0; i < NUMBER_OF_HASHES; i += 1) {
          const hasher = blake2b(HASH_SIZE);
          hasher.update(blob.raw).digest("binary");
        }
      };
    }),

    // TODO [ToDr] Run in parallel?

    cycle(),
    complete(),
    configure({}),
    ...save(import.meta.filename),
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
```
