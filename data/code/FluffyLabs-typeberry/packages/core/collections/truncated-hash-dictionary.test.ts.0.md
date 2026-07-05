---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/truncated-hash-dictionary.test.ts#L1-L117
title: packages/core/collections/truncated-hash-dictionary.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 210d5d5cbdac9f9a255929c45344dc820142bc13e3175359ce504c3dbed24fdc
language: typescript
---
`packages/core/collections/truncated-hash-dictionary.test.ts` (lines 1–117)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { Bytes } from "@typeberry/bytes";
import { HASH_SIZE, TRUNCATED_HASH_SIZE, type TruncatedHash } from "@typeberry/hash";
import { TruncatedHashDictionary } from "./truncated-hash-dictionary.js";

describe("TruncatedHashDictionary", () => {
  describe("get", () => {
    it("should return undefined when dictionary is empty", () => {
      const queryKey = Bytes.parseBytes(
        "0x1111111111111111111111111111111111111111111111111111111111111122",
        HASH_SIZE,
      );

      const dict = TruncatedHashDictionary.fromEntries([]);

      // when
      const res = dict.get(queryKey);

      // then
      assert.deepStrictEqual(res, undefined);
    });

    it("should retrieve the value if key differs at last byte", () => {
      const key1 = Bytes.parseBytes("0x11111111111111111111111111111111111111111111111111111111111111aa", HASH_SIZE);
      const key2 = Bytes.parseBytes("0x11111111111111111111111111111111111111111111111111111111111111ff", HASH_SIZE);

      const dict = TruncatedHashDictionary.fromEntries([
        [key1, "abc"],
        [Bytes.fill(HASH_SIZE, 2), "def"],
      ]);

      // when
      const res1 = dict.get(key1);
      const res2 = dict.get(key2);

      // then
      assert.deepStrictEqual(res1, "abc");
      assert.deepStrictEqual(res1, res2);
    });

    it("should return the value from the last entry if truncated keys collide", () => {
      const key1 = Bytes.parseBytes("0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa01", HASH_SIZE);
      const key2 = Bytes.parseBytes("0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaff", HASH_SIZE);

      const dict = TruncatedHashDictionary.fromEntries([
        [key1, "first"],
        [key2, "second"], // same prefix, should override
      ]);

      // when
      const res = dict.get(key1);

      // then
      assert.deepStrictEqual(res, "second");
    });

    it("should retrieve the value when using a truncated key for lookup", () => {
      const fullKey = Bytes.parseBytes("0xababababababababababababababababababababababababababababababab00", HASH_SIZE);
      const truncatedKey = Bytes.fromBlob(fullKey.raw.subarray(0, TRUNCATED_HASH_SIZE), TRUNCATED_HASH_SIZE);

      const dict = TruncatedHashDictionary.fromEntries([[fullKey, "value"]]);

      // when
      const res = dict.get(truncatedKey);

      // then
      assert.deepStrictEqual(res, "value");
    });

    it("should return undefined for a key with a different truncated prefix", () => {
      const insertedKey = Bytes.parseBytes(
        "0x99999999999999999999999999999999999999999999999999999999999999ff",
        HASH_SIZE,
      );
      const queryKey = Bytes.parseBytes(
        "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaff",
        HASH_SIZE,
      );

      const dict = TruncatedHashDictionary.fromEntries([[insertedKey, "exists"]]);

      // when
      const res = dict.get(queryKey);

      // then
      assert.deepStrictEqual(res, undefined);
    });

    it("should not mutate original keys during fromEntries", () => {
      const original = Bytes.parseBytes(
        "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaff",
        HASH_SIZE,
      );
      const copyBefore = original.raw.slice(); // snapshot

      const dict = TruncatedHashDictionary.fromEntries([[original, "value"]]);

      // when
      dict.get(original); // access to possibly trigger mutation

      // then
      assert.deepStrictEqual(original.raw, copyBefore); // unchanged
    });
  });

  describe("set", () => {
    it("should set a new key-value pair", () => {
      const key = Bytes.parseBytes("0x1111111111111111111111111111111111111111111111111111111111111111", HASH_SIZE);
      const dict = TruncatedHashDictionary.fromEntries([]);

      // when
      dict.set(key, "new value");

      // then
      assert.deepStrictEqual(dict.get(key), "new value");
    });
```
