---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/hash/index.ts#L1-L161
title: benchmarks/hash/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 5
content_sha: e9f6a8d742facbfdf637308ef0647407a620bf7cc6a34e2c3b012506cb133655
language: typescript
---
`benchmarks/hash/index.ts` (lines 1–161)

```typescript
import { pathToFileURL } from "node:url";
import { add, complete, configure, cycle, save, suite } from "@typeberry/benchmark/setup.js";
import { Logger } from "@typeberry/logger";

const HASH_LENGTH: number = 32;
const logger = Logger.new(import.meta.filename, "hash");

type ByteHash = Byte[];
type NumberHash = number[];
type StringHash = string[];
type PackedNumberHash = number[];
type BigIntHash = bigint[];

function generateHash<T>(convert: (n: number) => T): T[] {
  const result: T[] = [];
  for (let i = 0; i < HASH_LENGTH; i += 1) {
    const val = convert(Math.floor(Math.random() * 255));
    result.push(val);
  }
  return result;
}

function generateNumberHash(): NumberHash {
  return generateHash((n) => n);
}

function generateStringHash(): StringHash {
  return generateHash((byte) => {
    return byte.toString(16);
  });
}

function generateByteHash(): ByteHash {
  return generateHash((byte) => {
    const val = `x${byte.toString(16).padStart(2, "0")}`;
    // biome-ignore lint/security/noGlobalEval: Having a large switch is no-go.
    return eval(val);
  });
}

function generateUintHash(): Uint8Array {
  const hash = new Uint8Array(HASH_LENGTH);
  for (let i = 0; i < HASH_LENGTH; i += 1) {
    const val = Math.floor(Math.random() * 255);
    hash[i] = val;
  }
  return hash;
}

function generatePackedHash(): PackedNumberHash {
  const r = () => Math.floor(Math.random() * 255);
  const hash: PackedNumberHash = [];
  for (let i = 0; i < HASH_LENGTH / 4; i += 1) {
    let num = r();
    num = (num << 8) + r();
    num = (num << 8) + r();
    num = (num << 8) + r();
    hash.push(num);
  }
  return hash;
}

function generateBigIntHash(): BigIntHash {
  const r = () => BigInt(Math.floor(Math.random() * 255));
  const hash: BigIntHash = [];
  for (let i = 0; i < HASH_LENGTH / 8; i += 1) {
    let num = r();
    for (let j = 0; j < 7; j += 1) {
      num = (num << 8n) + r();
    }
    hash.push(num);
  }

  return hash;
}

function generateUint32Hash(): Uint32Array {
  const r = () => Math.floor(Math.random() * 255);
  const hash = new Uint32Array(HASH_LENGTH / 4);
  for (let i = 0; i < HASH_LENGTH / 4; i += 1) {
    let num = r();
    num = (num << 8) + r();
    num = (num << 8) + r();
    num = (num << 8) + r();
    hash[i] = num;
  }
  return hash;
}

function generate<T>(name: string, f: () => T): T[] {
  const start = process.memoryUsage();
  const result: T[] = [];
  for (let i = 0; i < 2 ** 10; i += 1) {
    result.push(f());
  }
  const end = process.memoryUsage();
  logger.log`[${name}] mem diff: ${Math.round(((start.heapUsed - end.heapUsed) / 1024 / 1024) * 100) / 100}MB`;
  return result;
}

function compareInLine8<T>(a: ArrayLike<T>, b: ArrayLike<T>) {
  return (
    a[0] === b[0] &&
    a[1] === b[1] &&
    a[2] === b[2] &&
    a[3] === b[3] &&
    a[4] === b[4] &&
    a[5] === b[5] &&
    a[6] === b[6] &&
    a[7] === b[7]
  );
}

function compareInLine4<T>(a: ArrayLike<T>, b: ArrayLike<T>) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

function isSame<T>(a: ArrayLike<T>, b: ArrayLike<T>) {
  const len = a.length;
  for (let idx = 0; idx < len; idx += 1) {
    if (a[idx] !== b[idx]) {
      return false;
    }
  }

  return true;
}

function findDuplicates<T>(list: ArrayLike<T>[], compare = isSame): ArrayLike<T>[] {
  const found: ArrayLike<T>[] = [];

  for (const a of list) {
    for (const b of list) {
      if (compare(a, b)) {
        found.push(a);
      }
    }
  }

  return found;
}

export default function run() {
  return suite(
    "Hash + Symbols",

    add("hash with numeric representation", () => {
      const hashes = generate("numeric", generateNumberHash);
      return () => {
        findDuplicates(hashes);
      };
    }),

    add("hash with string representation", () => {
      const hashes = generate("string", generateStringHash);
      return () => {
        findDuplicates(hashes);
      };
    }),

    add("hash with symbol representation", () => {
```
