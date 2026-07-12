---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/bytes/bytes-to-number.ts#L1-L79
title: benchmarks/bytes/bytes-to-number.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 65186bd78c0352edb5dd796267d7edb2161b21ad8bda89b65afc08d4939d6776
language: typescript
---
`benchmarks/bytes/bytes-to-number.ts` (lines 1–79)

```typescript
import { pathToFileURL } from "node:url";
import { add, complete, configure, cycle, save, suite } from "@typeberry/benchmark/setup.js";
import { Bytes } from "@typeberry/bytes";

const HASH_SIZE = 6;
const ARRAY_SIZE = 10_000;

function bytesAsU48WithoutBitOps(bytes: Uint8Array): number {
  const len = bytes.length;

  let value = 0;
  for (let i = 0; i < len; i++) {
    value = value * 256 + bytes[i];
  }

  return value * 8 + len;
}

function bytesAsU48WithBitOps(bytes: Uint8Array): number {
  const len = bytes.length;

  let value = bytes[3] | (bytes[2] << 8) | (bytes[1] << 16) | (bytes[0] << 24);

  for (let i = 4; i < bytes.length; i++) {
    value = value * 256 + bytes[i];
  }

  return value * 8 + len;
}

function generateHash<T extends number>(len: T): Bytes<T> {
  const result: number[] = [];
  for (let i = 0; i < len; i += 1) {
    const val = Math.floor(Math.random() * 255);
    result.push(val);
  }
  return Bytes.fromNumbers(result, len);
}

function generateArrayOfHashes<T extends number>(size: number, hashLen: T): Bytes<T>[] {
  const res: Bytes<T>[] = [];
  for (let i = 0; i < size; i += 1) {
    res.push(generateHash(hashLen));
  }
  return res;
}

const arr = generateArrayOfHashes(ARRAY_SIZE, HASH_SIZE);

/**
 * Comparing conversion 6 bytes into U48 number using two functions:
 * - ugly one that converts 4 bytes into U32 firstly using bit operations and then 2 bytes using math operations
 * - a bit prettier one that convers all bytes using math operations
 */
export default function run() {
  return suite(
    "Bytes into number comparison",
    add("Conversion with bitops ", () => {
      return () => {
        arr.map((x) => bytesAsU48WithBitOps(x.raw));
      };
    }),

    add("Conversion without bitops ", () => {
      return () => {
        arr.map((x) => bytesAsU48WithoutBitOps(x.raw));
      };
    }),

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
