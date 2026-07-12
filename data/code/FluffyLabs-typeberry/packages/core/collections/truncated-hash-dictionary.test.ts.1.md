---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/truncated-hash-dictionary.test.ts#L109-L211
title: packages/core/collections/truncated-hash-dictionary.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 94267798e58cfa5639e0d309091c31f23146b6facdf9425f8ace983f7fd721cc
language: typescript
---
`packages/core/collections/truncated-hash-dictionary.test.ts` (lines 109–211)

```typescript
      const key = Bytes.parseBytes("0x1111111111111111111111111111111111111111111111111111111111111111", HASH_SIZE);
      const dict = TruncatedHashDictionary.fromEntries([]);

      // when
      dict.set(key, "new value");

      // then
      assert.deepStrictEqual(dict.get(key), "new value");
    });

    it("should update an existing key", () => {
      const key = Bytes.parseBytes("0x2222222222222222222222222222222222222222222222222222222222222222", HASH_SIZE);
      const dict = TruncatedHashDictionary.fromEntries([[key, "original"]]);

      // when
      dict.set(key, "updated");

      // then
      assert.deepStrictEqual(dict.get(key), "updated");
    });

    it("should set with truncated keys", () => {
      const fullKey = Bytes.parseBytes("0x3333333333333333333333333333333333333333333333333333333333333333", HASH_SIZE);
      const truncatedKey = Bytes.fromBlob(fullKey.raw.subarray(0, TRUNCATED_HASH_SIZE), TRUNCATED_HASH_SIZE);
      const dict = TruncatedHashDictionary.fromEntries([]);

      // when
      dict.set(truncatedKey, "truncated value");

      // then
      assert.deepStrictEqual(dict.get(fullKey), "truncated value");
      assert.deepStrictEqual(dict.get(truncatedKey), "truncated value");
    });

    it("should overwrite when setting keys with same truncated prefix", () => {
      const key1 = Bytes.parseBytes("0x4444444444444444444444444444444444444444444444444444444444444401", HASH_SIZE);
      const key2 = Bytes.parseBytes("0x44444444444444444444444444444444444444444444444444444444444444ff", HASH_SIZE);
      const dict = TruncatedHashDictionary.fromEntries([[key1, "first"]]);

      // when
      dict.set(key2, "second");

      // then
      assert.deepStrictEqual(dict.get(key1), "second");
      assert.deepStrictEqual(dict.get(key2), "second");
    });

    it("should not reuse the same key object reference for different entries", () => {
      const key1 = Bytes.parseBytes("0x4444444444444444444444444444444444444444444444444444444444444444", HASH_SIZE);
      const key2 = Bytes.parseBytes("0x5555555555555555555555555555555555555555555555555555555555555555", HASH_SIZE);
      const dict = TruncatedHashDictionary.fromEntries([]);

      dict.set(key1, "first");
      dict.set(key2, "second");

      const keys: TruncatedHash[] = [];

      for (const [key, _] of dict) {
        keys.push(key);
      }

      assert.strictEqual([...new Set(keys)].length, 2);
    });
  });

  describe("delete", () => {
    it("should delete an existing key", () => {
      const key = Bytes.parseBytes("0x5555555555555555555555555555555555555555555555555555555555555555", HASH_SIZE);
      const dict = TruncatedHashDictionary.fromEntries([[key, "to delete"]]);

      // when
      dict.delete(key);

      // then
      assert.deepStrictEqual(dict.get(key), undefined);
    });

    it("should handle deleting a non-existent key", () => {
      const key = Bytes.parseBytes("0x6666666666666666666666666666666666666666666666666666666666666666", HASH_SIZE);
      const dict = TruncatedHashDictionary.fromEntries([]);

      // when
      dict.delete(key);

      // then
      assert.deepStrictEqual(dict.get(key), undefined);
    });

    it("should delete with truncated keys", () => {
      const fullKey = Bytes.parseBytes("0x7777777777777777777777777777777777777777777777777777777777777777", HASH_SIZE);
      const truncatedKey = Bytes.fromBlob(fullKey.raw.subarray(0, TRUNCATED_HASH_SIZE), TRUNCATED_HASH_SIZE);
      const dict = TruncatedHashDictionary.fromEntries([[fullKey, "to delete"]]);

      // when
      dict.delete(truncatedKey);

      // then
      assert.deepStrictEqual(dict.get(fullKey), undefined);
      assert.deepStrictEqual(dict.get(truncatedKey), undefined);
    });

    it("should delete when keys have same truncated prefix", () => {
      const key1 = Bytes.parseBytes("0x8888888888888888888888888888888888888888888888888888888888888801", HASH_SIZE);
```
