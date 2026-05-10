---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/truncated-hash-dictionary.test.ts#L207-L251
title: packages/core/collections/truncated-hash-dictionary.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 2
chunk_total: 3
content_sha: f3658ad581599cbb777c470672edc58b94d490cd0e00d45db68c8fc3f9f11f8e
language: typescript
---
`packages/core/collections/truncated-hash-dictionary.test.ts` (lines 207–251)

```typescript
      assert.deepStrictEqual(dict.get(truncatedKey), undefined);
    });

    it("should delete when keys have same truncated prefix", () => {
      const key1 = Bytes.parseBytes("0x8888888888888888888888888888888888888888888888888888888888888801", HASH_SIZE);
      const key2 = Bytes.parseBytes("0x88888888888888888888888888888888888888888888888888888888888888ff", HASH_SIZE);
      const dict = TruncatedHashDictionary.fromEntries([[key1, "value"]]);

      // when
      dict.delete(key2);

      // then
      assert.deepStrictEqual(dict.get(key1), undefined);
      assert.deepStrictEqual(dict.get(key2), undefined);
    });
  });

  describe("entries", () => {
    it("should return entries with truncated keys", () => {
      const key1 = Bytes.parseBytes("0x8888888888888888888888888888888888888888888888888888888888888801", HASH_SIZE);
      const key2 = Bytes.parseBytes("0x88888888888888888888888888888888888888888888888888888888888888ff", HASH_SIZE);
      const truncatedKey12 = Bytes.parseBytes(
        "0x88888888888888888888888888888888888888888888888888888888888888",
        TRUNCATED_HASH_SIZE,
      );
      const key3 = Bytes.parseBytes("0x77777777777777777777777777777777777777777777777777777777777777ff", HASH_SIZE);
      const truncatedKey3 = Bytes.parseBytes(
        "0x77777777777777777777777777777777777777777777777777777777777777",
        TRUNCATED_HASH_SIZE,
      );
      const dict = TruncatedHashDictionary.fromEntries([
        [key1, "value"],
        [key2, "value2"],
        [key3, "value3"],
      ]);

      const entries = Array.from(dict.entries());
      assert.deepStrictEqual(entries.length, 2);
      assert.deepStrictEqual(entries[0][0].toString(), truncatedKey12.toString());
      assert.deepStrictEqual(entries[0][1], "value2");
      assert.deepStrictEqual(entries[1][0].toString(), truncatedKey3.toString());
      assert.deepStrictEqual(entries[1][1], "value3");
    });
  });
});
```
