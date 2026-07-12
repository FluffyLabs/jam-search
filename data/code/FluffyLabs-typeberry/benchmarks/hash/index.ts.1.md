---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/hash/index.ts#L154-L294
title: benchmarks/hash/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 5
content_sha: 132481a7c9d5db0df1b6f4993fd4752fa9f4bb3756bb32e310c75da31dad22ae
language: typescript
---
`benchmarks/hash/index.ts` (lines 154–294)

```typescript
    add("hash with string representation", () => {
      const hashes = generate("string", generateStringHash);
      return () => {
        findDuplicates(hashes);
      };
    }),

    add("hash with symbol representation", () => {
      const hashes = generate("symbol", generateByteHash);
      return () => {
        findDuplicates(hashes);
      };
    }),

    add("hash with uint8 representation", () => {
      const hashes = generate("uint", generateUintHash);
      return () => {
        findDuplicates(hashes);
      };
    }),

    add("hash with packed representation", () => {
      const hashes = generate("packed", generatePackedHash);
      const compare = HASH_LENGTH === 32 ? compareInLine8 : HASH_LENGTH === 16 ? compareInLine4 : isSame;
      return () => {
        findDuplicates(hashes, compare);
      };
    }),

    add("hash with bigint representation", () => {
      const hashes = generate("bigint", generateBigIntHash);
      const compare = HASH_LENGTH === 64 ? compareInLine8 : HASH_LENGTH === 32 ? compareInLine4 : isSame;
      return () => {
        findDuplicates(hashes, compare);
      };
    }),

    add("hash with uint32 representation", () => {
      const hashes = generate("uint32", generateUint32Hash);
      const compare = HASH_LENGTH === 32 ? compareInLine8 : HASH_LENGTH === 16 ? compareInLine4 : isSame;

      return () => {
        findDuplicates(hashes, compare);
      };
    }),

    cycle(),
    complete(),
    configure({}),
    ...save(import.meta.filename),
  );
}

const x00 = Symbol("0x00");
const x01 = Symbol("0x01");
const x02 = Symbol("0x02");
const x03 = Symbol("0x03");
const x04 = Symbol("0x04");
const x05 = Symbol("0x05");
const x06 = Symbol("0x06");
const x07 = Symbol("0x07");
const x08 = Symbol("0x08");
const x09 = Symbol("0x09");
const x0a = Symbol("0x0a");
const x0b = Symbol("0x0b");
const x0c = Symbol("0x0c");
const x0d = Symbol("0x0d");
const x0e = Symbol("0x0e");
const x0f = Symbol("0x0f");
const x10 = Symbol("0x10");
const x11 = Symbol("0x11");
const x12 = Symbol("0x12");
const x13 = Symbol("0x13");
const x14 = Symbol("0x14");
const x15 = Symbol("0x15");
const x16 = Symbol("0x16");
const x17 = Symbol("0x17");
const x18 = Symbol("0x18");
const x19 = Symbol("0x19");
const x1a = Symbol("0x1a");
const x1b = Symbol("0x1b");
const x1c = Symbol("0x1c");
const x1d = Symbol("0x1d");
const x1e = Symbol("0x1e");
const x1f = Symbol("0x1f");
const x20 = Symbol("0x20");
const x21 = Symbol("0x21");
const x22 = Symbol("0x22");
const x23 = Symbol("0x23");
const x24 = Symbol("0x24");
const x25 = Symbol("0x25");
const x26 = Symbol("0x26");
const x27 = Symbol("0x27");
const x28 = Symbol("0x28");
const x29 = Symbol("0x29");
const x2a = Symbol("0x2a");
const x2b = Symbol("0x2b");
const x2c = Symbol("0x2c");
const x2d = Symbol("0x2d");
const x2e = Symbol("0x2e");
const x2f = Symbol("0x2f");
const x30 = Symbol("0x30");
const x31 = Symbol("0x31");
const x32 = Symbol("0x32");
const x33 = Symbol("0x33");
const x34 = Symbol("0x34");
const x35 = Symbol("0x35");
const x36 = Symbol("0x36");
const x37 = Symbol("0x37");
const x38 = Symbol("0x38");
const x39 = Symbol("0x39");
const x3a = Symbol("0x3a");
const x3b = Symbol("0x3b");
const x3c = Symbol("0x3c");
const x3d = Symbol("0x3d");
const x3e = Symbol("0x3e");
const x3f = Symbol("0x3f");
const x40 = Symbol("0x40");
const x41 = Symbol("0x41");
const x42 = Symbol("0x42");
const x43 = Symbol("0x43");
const x44 = Symbol("0x44");
const x45 = Symbol("0x45");
const x46 = Symbol("0x46");
const x47 = Symbol("0x47");
const x48 = Symbol("0x48");
const x49 = Symbol("0x49");
const x4a = Symbol("0x4a");
const x4b = Symbol("0x4b");
const x4c = Symbol("0x4c");
const x4d = Symbol("0x4d");
const x4e = Symbol("0x4e");
const x4f = Symbol("0x4f");
const x50 = Symbol("0x50");
const x51 = Symbol("0x51");
const x52 = Symbol("0x52");
const x53 = Symbol("0x53");
const x54 = Symbol("0x54");
const x55 = Symbol("0x55");
const x56 = Symbol("0x56");
const x57 = Symbol("0x57");
```
