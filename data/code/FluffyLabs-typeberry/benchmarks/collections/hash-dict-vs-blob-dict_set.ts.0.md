---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/collections/hash-dict-vs-blob-dict_set.ts#L1-L115
title: benchmarks/collections/hash-dict-vs-blob-dict_set.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: d3b4ef6da3233cc67a341f67eab35ef0dc7c12141df737ff5f09fb3de50308e8
language: typescript
---
`benchmarks/collections/hash-dict-vs-blob-dict_set.ts` (lines 1–115)

```typescript
import { pathToFileURL } from "node:url";
import { add, complete, configure, cycle, save, suite } from "@typeberry/benchmark/setup.js";
import { Bytes } from "@typeberry/bytes";
import { StringHashDictionary } from "@typeberry/collections";
import { BlobDictionary } from "@typeberry/collections/blob-dictionary.js";
import { HASH_SIZE, type OpaqueHash } from "@typeberry/hash";
import blake2b from "blake2b";

const NO_OF_KEYS = 1000;

function blake2bHasher(bytes: Bytes<HASH_SIZE>) {
  const hasher = blake2b(HASH_SIZE);
  return hasher.update(bytes.raw).digest("binary");
}
function longCollisionKey(n: number) {
  const key = Bytes.blobFromString(`${n}`);
  const ret = Bytes.zero(HASH_SIZE);
  ret.raw.set(key.raw, 0);
  ret.raw.reverse();
  return ret;
}

function hashKey(n: number) {
  return Bytes.fromBlob(blake2bHasher(longCollisionKey(n)), HASH_SIZE);
}

const LONG_COLLISION_KEYS = Array.from({ length: NO_OF_KEYS }, (_, i) => longCollisionKey(i));
const HASH_KEYS = Array.from({ length: NO_OF_KEYS }, (_, i) => hashKey(i));
const MIN_THRESHOLD = 1;
const MAX_THRESHOLD = 6;

export default function run() {
  const promises: ReturnType<typeof suite>[] = [];

  const longCollisionKeysBlobDictBenchmarks: ReturnType<typeof add>[] = [];

  for (let threshold = MIN_THRESHOLD; threshold < MAX_THRESHOLD; threshold++) {
    longCollisionKeysBlobDictBenchmarks.push(
      add(`BlobDictionary(${threshold})`, () => {
        const map = BlobDictionary.new<OpaqueHash, number>(threshold);

        return () => {
          for (let k = 0; k < NO_OF_KEYS; k += 1) {
            map.set(LONG_COLLISION_KEYS[k], k);
          }
        };
      }),
    );
  }
  const longCollisionTestPromise = suite(
    `Comparing set operation in two hash dicts using long collision keys and BlobDictionary(n: [${MIN_THRESHOLD}: ${MAX_THRESHOLD}))`,

    add("StringHashDictionary", () => {
      const map = StringHashDictionary.new<OpaqueHash, number>();

      return () => {
        for (let k = 0; k < NO_OF_KEYS; k += 1) {
          map.set(LONG_COLLISION_KEYS[k], k);
        }
      };
    }),

    ...longCollisionKeysBlobDictBenchmarks,

    cycle(),
    complete(),
    configure({}),
    ...save(import.meta.filename),
  );

  const hashKeysBlobDictBenchmarks: ReturnType<typeof add>[] = [];

  for (let threshold = MIN_THRESHOLD; threshold < MAX_THRESHOLD; threshold++) {
    hashKeysBlobDictBenchmarks.push(
      add(`BlobDictionary(${threshold})`, () => {
        const map = BlobDictionary.new<OpaqueHash, number>(threshold);

        return () => {
          for (let k = 0; k < NO_OF_KEYS; k += 1) {
            map.set(HASH_KEYS[k], k);
          }
        };
      }),
    );
  }

  const hashKeyTestPromise = suite(
    `Comparing set operation in two hash dicts using hash keys and BlobDictionary(n: [${MIN_THRESHOLD}: ${MAX_THRESHOLD}))`,

    add("StringHashDictionary", () => {
      const map = StringHashDictionary.new<OpaqueHash, number>();

      return () => {
        for (let k = 0; k < NO_OF_KEYS; k += 1) {
          map.set(HASH_KEYS[k], k);
        }
      };
    }),

    ...hashKeysBlobDictBenchmarks,

    cycle(),
    complete(),
    configure({}),
    ...save(import.meta.filename),
  );

  promises.push(longCollisionTestPromise, hashKeyTestPromise);

  return Promise.allSettled(promises);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
```
